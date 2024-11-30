import React , { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import api from '../tools/api.js';

const StockInfoListPage = () => {

    const columns = [
        {
            title: '股票名称',
            width: 100,
            dataIndex: 'stock_name',
            key: 'stock_name',
        },
        {
            title: '股票类型',
            width: 100,
            dataIndex: 'stock_type',
            key: 'stock_type',
        },
        {
            title: '最短持有期',
            dataIndex: 'stock_minimum_holding_period',
            key: 'stock_minimum_holding_period',
            width: 150,
        },
        {
            title: '股票状态',
            dataIndex: 'stock_status',
            key: 'stock_status',
            width: 150,
        },
        {
            title: '股票备注',
            dataIndex: 'stock_remark',
            key: 'stock_remark',
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <Button onClick={() => handleEditStock(record)}>编辑</Button>
            ),
        },
    ];

    const initialData = Array.from({
        length: 5,
    }).map((_, i) => ({
        key: i,
        stock_name: `Edward King ${i}`,
        stock_type: 1,
        stock_status: `London, Park Lane no. ${i}`,
    }));

    const [stocks, setStocks] = useState(initialData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStock, setEditingStock] = useState(null);

    // 打开新增/编辑弹窗
    const handleAddStock = () => {
        setEditingStock(null); // 重置编辑
        setIsModalVisible(true);
    };

    // 编辑
    const handleEditStock = (stock) => {
        setEditingStock(stock);
        setIsModalVisible(true);
    };

    // 关闭弹窗
    const handleCancel = (form) => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.info("value: " + JSON.stringify(values));
        const updatedValues = { ...values };

        if (editingStock) {
            // 编辑用户
            const updatedStock = stocks.map(stock =>
                stock.id === editingStock.id ? { ...stock, ...updatedValues } : stock
            );
            setStocks(updatedStock);
            message.success('修改成功');
        } else {
            // 新增股票
            const newStock = { ...updatedValues }; // 生成一个新的 ID
            setStocks([...stocks, newStock]);
            message.success('新增成功');
        }

        setIsModalVisible(false); // 关闭弹窗
    };

    return (
        <div>
            <Button type="primary" onClick={handleAddStock} style={{margin: '0px 0px 10px 0px'}}>
                新增股票
            </Button>
            <Table
                columns={columns}
                dataSource={initialData}
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
                <StockInfoForm
                    initialValues={editingStock}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </Modal>
        </div>
    );
};



const StockInfoForm = ({ initialValues, onSubmit, onCancel }) => {
    
    const [stockTypeOptions, setStockTypeOptions] = useState([]);
    const getStockTypes = async () => {
        try {
            const response = await api.post('/trade/getStockType');
            setStockTypeOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch stockType:', error);
        }
    };

    useEffect(() => {
        getStockTypes();
      }, []);

    const [form] = Form.useForm();
    return (
        <Form
            form={form}
            initialValues={initialValues || { stock_name: '', stock_minimum_holding_period: 0, stock_remark: '' }}
            onFinish={onSubmit}
            layout="vertical"
        >
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
                <Input />
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
                <Button onClick={() => onCancel(form)} style={{ marginLeft: '10px' }}>
                    取消
                </Button>
            </Form.Item>
        </Form>
    );
}

export default StockInfoListPage;