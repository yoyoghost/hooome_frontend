import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, InputNumber, Space, Typography, Popconfirm } from 'antd';
import api from '../tools/api.js';

const StockInfoListPage = () => {

    const [stockTypeOptions, setStockTypeOptions] = useState([]);
    const [stockTypeMap, setStockTypeMap] = useState(null);
    const [stockStatusList, setStockStatusList] = useState([]);
    const [stockStatusMap, setStockStatusMap] = useState(null);
    useEffect(() => {
        const getStockTypes = async () => {
            try {
                api.post('/trade/stockInfo/getStockType').then(
                    response => {
                        // console.info("getStockTypes: " + JSON.stringify(response.data));
                        const stockTypeMapTemp = response.data.reduce((acc, item) => {
                            acc[item.code] = item.desc;
                            return acc;
                        }, {});
                        setStockTypeMap(stockTypeMapTemp);
                        setStockTypeOptions(response.data);
                    }
                ).catch(error => {
                    console.error('get stock type error:', error);
                    const errorresp = error.response.data;
                    message.error(errorresp.message);
                });
            } catch (error) {
                console.error('Failed to fetch stockType:', error);
            }
        };

        const getStockStatus = async () => {
            try {
                api.post('/trade/stockInfo/getStockStatus').then(
                    response => {
                        // console.info("getStockStatus: " + JSON.stringify(response.data));
                        const stockStatusMapTemp = response.data.reduce((acc, item) => {
                            acc[item.code] = item.desc;
                            return acc;
                        }, {});
                        setStockStatusMap(stockStatusMapTemp);
                        setStockStatusList(response.data);
                    }
                ).catch(error => {
                    console.error('get stock status error:', error);
                    const errorresp = error.response.data;
                    message.error(errorresp.message);
                });

            } catch (error) {
                console.error('Failed to fetch stockStatus:', error);
            }
        };
        getStockTypes();
        getStockStatus();
    }, []);

    const [filteredInfo, setFilteredInfo] = useState({});
    useEffect(() => {
        const initFilteredInfo = () => {
            if (stockTypeMap && stockStatusMap) {
                let stockTypeFilterDate = [];
                stockTypeOptions.forEach(item => {
                    stockTypeFilterDate.push({ 'text': item['desc'], 'value': item['code'] })
                });

                let stockStatusFilterDate = [];
                stockStatusList.forEach(item => {
                    stockStatusFilterDate.push({ 'text': item['desc'], 'value': item['code'] })
                });
                let filteredInfoTemp = {};
                filteredInfoTemp['stockTypeFilterDate'] = stockTypeFilterDate;
                filteredInfoTemp['stockStatusFilterDate'] = stockStatusFilterDate;
                // console.log("stockStatusFilterDate: " + JSON.stringify(stockStatusFilterDate));
                // console.log("stockTypeFilterDate: " + JSON.stringify(stockTypeFilterDate));
                // console.log("filteredInfoTemp: " + JSON.stringify(filteredInfoTemp));
                setFilteredInfo(filteredInfoTemp);
            };
        }
        initFilteredInfo();
    }, [stockTypeOptions, stockStatusList]);

    // 重置筛选
    const [filteredInfoData, setFilteredInfoData] = useState({});
    const clearFilters = () => {
        setFilteredInfoData({});
    };

    // 重置筛选，配合使用
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfoData(filters);
    };

    const columns = [
        {
            title: '股票名称',
            width: 200,
            dataIndex: 'stock_name',
            key: 'stock_name',
        },
        {
            title: '股票类型',
            width: 120,
            dataIndex: 'stock_type',
            key: 'stock_type',
            filters: filteredInfo['stockTypeFilterDate'],
            filteredValue: filteredInfoData.stock_type || null,
            onFilter: (value, record) => record.stock_type === value,
            render: text => stockTypeOptions.find(opt => opt.code === text)?.desc || '未知',
        },
        {
            title: '最短持有期',
            dataIndex: 'stock_minimum_holding_period',
            key: 'stock_minimum_holding_period',
            width: 120,
        },
        {
            title: '股票状态',
            dataIndex: 'stock_status',
            key: 'stock_status',
            width: 120,
            filters: filteredInfo['stockStatusFilterDate'],
            filteredValue: filteredInfoData.stock_status || null,
            onFilter: (value, record) => record.stock_status === value,
            render: text => stockStatusList.find(opt => opt.code === text)?.desc || '未知',
        },
        {
            title: '股票备注',
            dataIndex: 'stock_remark',
            key: 'stock_remark',
        },
        {
            title: '操作',
            key: 'operation',
            width: 150,
            render: (text, record) => {
                const currentStockStatus = record.stock_status;
                const toModifyStockStatus = currentStockStatus === 1 ? 2 : 1;
                const currentStockName = record.stock_name;
                const btnTetx = currentStockStatus === 1 ? '清仓' : currentStockStatus === 2 ? '启用' : '异常';
                return (
                    <Space size="middle">
                        <Typography.Link onClick={() => handleEditStock(record)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm title={`是否确定${btnTetx} [${currentStockName}]?`} okText="确定" cancelText="取消" onConfirm={() => handleSetStockStatus(toModifyStockStatus, record)}>
                            <a>{btnTetx}</a>
                        </Popconfirm>
                        <Popconfirm title={`是否确定删除 [${currentStockName}]?`} okText="确定" cancelText="取消" onConfirm={() => handleDeleteStock(record)}>
                            <a>删除</a>
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ];

    const [stocks, setStocks] = useState(null);
    useEffect(() => {
        const getStockInfoList = async () => {
            if (stockTypeMap && stockStatusMap) {
                try {
                    api.post('/trade/stockInfo/getStockInfoList').then(
                        response => {
                            var stocks = response.data;
                            if (stocks === null || !Array.isArray(stocks) || stocks.length === 0) {
                                setStocks(null);
                            } else {
                                // console.log("stockTypeMap: " + JSON.stringify(stockTypeMap));
                                const newStocks = stocks.map(item => ({
                                    ...item,
                                    // stock_type: stockTypeMap[item.stock_type] || '未知',
                                    // stock_status: stockStatusMap[item.stock_status] || '未知',
                                }));
                                // console.log("stock list after:" + JSON.stringify(newStocks));
                                setStocks(newStocks);
                            }
                        }
                    ).catch(error => {
                        console.error('get stock info list error:', error);
                        const errorresp = error.response.data;
                        message.error(errorresp.message);
                    });
                } catch (error) {
                    console.error('Failed to fetch stockInfo list:', error);
                }
            }
        };
        getStockInfoList();
    }, [stockTypeMap, stockStatusMap]);

    // 控制modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 控制编辑的
    const [editingStock, setEditingStock] = useState(null);
    const [form] = Form.useForm();
    const initialStock = { stock_name: '', stock_minimum_holding_period: 0, stock_remark: '', stock_type: 1 };
    // 打开新增/编辑弹窗
    const handleAddStock = () => {
        // form.resetFields();
        setEditingStock(null); // 重置编辑
        form.setFieldsValue(initialStock);
        setIsModalVisible(true);
    };

    // 编辑
    const handleEditStock = (stock) => {
        // console.log("edit stock info: ", stock)
        setEditingStock(stock);
        form.setFieldsValue(stock);
        setIsModalVisible(true);
    };

    const handleDeleteStock = (stock) => {
        // console.log("delete stock info: ", stock)
        api.post('/trade/stockInfo/delStockInfo', stock).then(response => {
            // console.info("del response:" + JSON.stringify(response))
            const delStock = response.data;
            if (stocks.length > 0) {
                const updatedStock = stocks.filter(item => item.id !== delStock.id);
                setStocks(updatedStock);
            }
            message.success('删除成功');
        }).catch(error => {
            console.error('Error adding stock info:', error);
            const errorresp = error.response.data;
            message.error(errorresp.message);
        });
    };

    const handleSetStockStatus = (currentStockStatus, stock) => {
        stock.stock_status = currentStockStatus;
        // console.log("set stock status info: ", stock)
        api.post('/trade/stockInfo/setStockStatus', stock).then(response => {
            // console.info("reset stock status response:" + JSON.stringify(response))
            const resetStock = response.data;
            const updatedStock = stocks.map(stock =>
                stock.id === resetStock.id ? { ...stock, ...resetStock } : stock
            );
            setStocks(updatedStock);
            message.success('处理成功');
        }).catch(error => {
            console.error('Error set stock status:', error);
            const errorresp = error.response.data;
            message.error(errorresp.message);
        });
    };

    // 关闭弹窗
    const handleCancel = () => {
        // form.resetFields();
        // 关闭弹窗
        setIsModalVisible(false);
        // 清除编辑的数据
        setEditingStock(null);
    };

    const handleSubmit = (values) => {
        if (editingStock) {
            // 编辑
            console.info("edit value is: " + JSON.stringify(values));
            api.post('/trade/stockInfo/editStockInfo', values).then(response => {
                // console.info("edit response:" + JSON.stringify(response))
                const editStock = response.data;
                // console.info('before editStock is: ' + JSON.stringify(editStock));
                const editStock1 = {
                    ...editStock,
                    // stock_status: stockStatusMap[editStock.stock_status] || '未知'
                }
                // console.info('after editStock is: ' + JSON.stringify(editStock1));
                if (stocks === null || !Array.isArray(stocks) || stocks.length === 0) {
                    setStocks([editStock1]);
                } else {
                    const updatedStock = stocks.map(stock =>
                        stock.id === editStock1.id ? { ...stock, ...editStock1 } : stock
                    );
                    setStocks(updatedStock);
                }
                message.success('修改成功');
            }).catch(error => {
                console.error('Error adding stock info:', error);
                const errorresp = error.response.data;
                message.error(errorresp.message);
            });
        } else {
            // console.info("add value is: " + JSON.stringify(values));
            api.post('/trade/stockInfo/addStockInfo', values).then(response => {
                // console.info("add response:" + JSON.stringify(response))
                const newStock = response.data;
                // console.info('before newStock is: ' + JSON.stringify(newStock));
                const newStock1 = {
                    ...newStock,
                    // stock_status: stockStatusMap[newStock.stock_status] || '未知'
                }
                if (stocks === null || !Array.isArray(stocks) || stocks.length === 0) {
                    setStocks([newStock1]);
                } else {
                    setStocks([...stocks, newStock1]);
                }
                message.success('新增成功');
            }).catch(error => {
                console.error('Error adding stock info:', error);
                const errorresp = error.response.data;
                message.error(errorresp.message);
            });
        }

        // 关闭弹窗
        setIsModalVisible(false);
        // 清除编辑的数据
        setEditingStock(null);
        // 重置表单数据
        form.resetFields();
    };

    return (
        <div>
            <Button type="primary" onClick={handleAddStock} style={{ margin: '0px 0px 10px 0px' }}>
                新增股票
            </Button>
            <Button type="dashed" onClick={clearFilters} style={{ margin: '0px 0px 10px 10px' }}>
                重置筛选
            </Button>
            <Table
                columns={columns}
                dataSource={stocks}
                onChange={handleChange}
                scroll={{
                    x: 'max-content',
                    y: 55 * 5,
                }}
                pagination={false}
            />
            <Modal
                title={editingStock ? '编辑股票信息' : '新增股票'}
                open={isModalVisible}
                footer={null}
                mask='true'
                maskClosable='false'
                closable={false}
            >
                <Form
                    form={form}
                    initialValues={editingStock || { stock_name: '', stock_minimum_holding_period: 0, stock_remark: '' }}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="id"
                        label="id"
                        hidden="true"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="stock_name"
                        label="股票名称"
                        rules={[{ required: true, message: 'Please input stock name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="stock_type"
                        label="股票类型"
                        rules={[{ required: true, message: 'Please select stock type!' }]}
                    >
                        <Select placeholder="股票类型">
                            {stockTypeOptions.map(option => (
                                <Select.Option key={option.code} value={option.code}>
                                    {option.desc}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="stock_minimum_holding_period"
                        label="最短持有期/天"
                        rules={[{ required: true, message: 'Please input minimum holding period!' }]}
                    >
                        <InputNumber
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="stock_remark"
                        label="股票备注"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StockInfoListPage;