import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, InputNumber, Space, Typography, Popconfirm } from 'antd';
import { Radio, DatePicker } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { stockBaseUrl, tradeInfoBaseUrl, tradeCommonBaseUrl } from '../tools/const'
import api from '../tools/api.js';

const TradeInfoListPage = () => {
  // step 1 获取当前记录中的基金股票ETF
  const [tradeType, setTradeType] = useState([]);
  const [stockList, setStockList] = useState([]);
  useEffect(() => {
    const getDCStockInfoList = async () => {
      try {
        api.post(stockBaseUrl + 'getDCStockInfoList').then(
          response => {
            console.info("getDCStockInfoList: " + JSON.stringify(response.data));
            setStockList(response.data);
          }
        ).catch(error => {
          console.error('getDCStockInfoList error:', error);
        });

      } catch (error) {
        console.error('Failed to getDCStockInfoList:', error);
      }
    };

    const getTradeType = async () => {
      try {
        api.post(tradeCommonBaseUrl + 'getTradeType').then(
          response => {
            console.info("getTradeType: " + JSON.stringify(response.data));
            setTradeType(response.data);
          }
        ).catch(error => {
          console.error('getTradeType error:', error);
        });

      } catch (error) {
        console.error('Failed to getTradeType:', error);
      }
    };
    getDCStockInfoList();
    getTradeType();
  }, []);

  // 构造过滤字段的值
  const [filteredInfo, setFilteredInfo] = useState({});
  useEffect(() => {
    const initFilteredInfo = () => {
      if (tradeType && stockList) {

        // 股票名称过滤
        let stockFilterDate = [];
        stockList.forEach(item => {
          stockFilterDate.push({ 'text': item['stock_name'], 'value': item['stock_name'] })
        });

        // 交易类型过滤
        let tradeTypeFilterDate = [];
        tradeType.forEach(item => {
          tradeType.push({ 'text': item['desc'], 'value': item['code'] })
        });
        let filteredInfoTemp = {};
        filteredInfoTemp['tradeTypeFilterDate'] = tradeTypeFilterDate;
        filteredInfoTemp['stockFilterDate'] = stockFilterDate;
        // console.log("stockStatusFilterDate: " + JSON.stringify(stockStatusFilterDate));
        // console.log("stockTypeFilterDate: " + JSON.stringify(stockTypeFilterDate));
        // console.log("filteredInfoTemp: " + JSON.stringify(filteredInfoTemp));
        setFilteredInfo(filteredInfoTemp);
      };
    }
    initFilteredInfo();
  }, [tradeType, stockList]);

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
      // render: text => stockTypeOptions.find(opt => opt.code === text)?.desc || '未知',
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
      // render: text => stockStatusList.find(opt => opt.code === text)?.desc || '未知',
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
            <Typography.Link onClick={() => handleEdit(record)}>
              编辑
            </Typography.Link>
            <Popconfirm title={`是否确定删除 [${currentStockName}]?`} okText="确定" cancelText="取消" onConfirm={() => handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];

  const [tradeInfoList, setTradeInfoList] = useState(null);
  useEffect(() => {
    const getTradeInfoList = async () => {
      if (tradeType && stockList) {
        try {
          api.post(tradeInfoBaseUrl + 'getTradeInfoList').then(
            response => {
              var tradeInfoList = response.data;
              if (tradeInfoList === null || !Array.isArray(tradeInfoList) || tradeInfoList.length === 0) {
                setTradeInfoList(null);
              } else {
                console.log("tradeInfoList: " + JSON.stringify(tradeInfoList));
                setTradeInfoList(tradeInfoList);
              }
            }
          ).catch(error => {
            console.error('get tradeInfoList error:', error);
          });
        } catch (error) {
          console.error('Failed to fetch tradeInfoList:', error);
        }
      }
    };
    getTradeInfoList();
  }, [tradeType, stockList]);

  // 控制modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 控制编辑
  const [editingData, setEditingData] = useState(null);
  const [form] = Form.useForm();
  
  // 打开新增/编辑弹窗
  const handleAdd = () => {
    // form.resetFields();
    setEditingData(null); // 重置编辑
    form.setFieldsValue(initialData);
    setIsModalVisible(true);
  };

  // 编辑
  const handleEdit = (data) => {
    console.log("edit data: ", data)
    setEditingData(data);
    form.setFieldsValue(data);
    setIsModalVisible(true);
  };

  const handleDelete = (data) => {
    console.log("delete data: ", data)
    api.post(tradeInfoBaseUrl + 'delTradeInfo', data).then(response => {
      console.info("del response:" + JSON.stringify(response))
      const delData = response.data;
      if (tradeInfoList.length > 0) {
        const updatedDataList = tradeInfoList.filter(item => item.id !== delData.id);
        setTradeInfoList(updatedDataList);
      }
      message.success('删除成功');
    }).catch(error => {
      console.error('Error adding stock info:', error);
      message.success('删除异常');
    });
  };

  // 关闭弹窗
  const handleCancel = () => {
    form.resetFields();
    // 关闭弹窗
    setIsModalVisible(false);
    // 清除编辑的数据
    setEditingData(null);
    // 清除数据
    setStockId(null);
    setStockName(null);
    setTradeAmount(null);
  };

  const handleSubmit = (values) => {
    if (editingData) {
      // 编辑
      console.info("edit value is: " + JSON.stringify(values));
      api.post(tradeInfoBaseUrl + 'editTradeInfo', values).then(response => {
        console.info("edit response:" + JSON.stringify(response))
        const editData = response.data;
        if (tradeInfoList === null || !Array.isArray(tradeInfoList) || tradeInfoList.length === 0) {
          setTradeInfoList([editData]);
        } else {
          const updatedStock = tradeInfoList.map(trade =>
            trade.id === editData.id ? { ...trade, ...editData } : trade
          );
          setTradeInfoList(updatedStock);
        }
        message.success('修改成功');
      }).catch(error => {
        console.error('Error editTradeInfo: ', error);
        message.success('修改异常');
      });
    } else {
      console.info("add value is: " + JSON.stringify(values));
      api.post(tradeInfoBaseUrl + 'addTradeInfo', values).then(response => {
        console.info("add response:" + JSON.stringify(response))
        const newData = response.data;
        if (tradeInfoList === null || !Array.isArray(tradeInfoList) || tradeInfoList.length === 0) {
          setTradeInfoList([newData]);
        } else {
          setTradeInfoList([...tradeInfoList, newData]);
        }
        message.success('新增成功');
      }).catch(error => {
        console.error('Error addTradeInfo: ', error);
        message.success('新增异常');
      });
    }

    // 关闭弹窗
    setIsModalVisible(false);
    // 清除编辑的数据
    setEditingData(null);
    // 重置表单数据
    form.resetFields();
    // 清除数据
    setStockId(null);
    setStockName(null);
    setTradeAmount(null);
  };

  // 新增或者编辑交易相关
  const tradeTypeInfo = [{ 'label': '买入', 'value': 1 }, { 'label': '卖出', 'value': 2 }];

  // 计算交易金额
  const [tradeAmount, setTradeAmount] = useState('');
  const handleCalculate = () => {
    form.validateFields(['trade_number', 'trade_point']).then((values) => {
      const { trade_number, trade_point } = values;
      const total = parseFloat(trade_number) * parseFloat(trade_point) / 1000;
      console.log("total: " + total);
      setTradeAmount(total);
      // 手动标记字段为已触碰
      form.setFields([
        {
          name: 'trade_amount',
          value: total,
          errors: [], // 清除任何现有的错误信息
          touched: true, // 标记为已触碰
        },
      ]);
      message.success('计算完成');
    }).catch((errorInfo) => {
      console.log('验证失败:', errorInfo);
      message.error('请检查输入的数值');
    });
  }

  // 处理隐藏值
  const [stockId, setStockId] = useState(null);
  const [stockName, setStockName] = useState(null);
  const handleStockInfo = (value) => {
    console.log(value);
    setStockId(value);
    const currentStock = stockList.find(stock => stock.id === value);
    setStockName(currentStock.stock_name);
    form.setFields([
      {
        name: 'stock_id',
        value: value,
        touched: true, // 标记为已触碰
      },
    ]);
    form.setFields([
      {
        name: 'stock_name',
        value: currentStock.stock_name,
        touched: true, // 标记为已触碰
      },
    ]);
  }

  // 初始化表单数据
  const today = dayjs().format('YYYY-MM-DD');
  const initialData = { 'trade_type': 1, 'trade_number': 10000, 'trade_date': today};

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ margin: '0px 0px 10px 0px' }}>
        新增交易信息
      </Button>
      <Button type="dashed" onClick={clearFilters} style={{ margin: '0px 0px 10px 10px' }}>
        重置筛选
      </Button>
      <Table
        columns={columns}
        dataSource={tradeInfoList}
        onChange={handleChange}
        scroll={{
          x: 'max-content',
          y: 55 * 5,
        }}
        pagination={false}
      />
      <Modal
        title={editingData ? '编辑交易信息' : '新增交易信息'}
        open={isModalVisible}
        footer={null}
        mask='true'
        maskClosable='false'
        closable={false}
      >
        <Form
          form={form}
          initialValues={editingData || initialData}
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

          {/* 股票ID */}
          <Form.Item
            name="stock_id"
            label="stock_id"
            hidden="true"
            value = {stockId}
          >
            <Input />
          </Form.Item>

          {/* 股票名称 */}
          <Form.Item
            name="stock_name"
            label="stock_name"
            hidden="true"
            value = {stockName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stock_desc"
            label="股票名称"
            rules={[{ required: true, message: '请选择一个交易对象!' }]}
          >
            <Select placeholder="股票名称" onChange={handleStockInfo}>
              {stockList.map(option => (
                <Select.Option key={option.id} value={option.id}>
                  {option.stock_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="trade_date"
            label="交易日期"
            rules={[{ required: true, message: '请选择交易日期!' }]}
          >
            <Space>
              <DatePicker locale={zhCN}
                maxDate={dayjs()}
                format="YYYY-MM-DD"
                defaultValue = {dayjs()}
              />
            </Space>
          </Form.Item>
          <Form.Item
            name="trade_type"
            label="交易类型"
          >
            <Radio.Group
              block
              options={tradeTypeInfo}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

          <Form.Item
            name="trade_point"
            label="交易点位"
            rules={[{ required: true, message: '请输入交易点位!' }]}
          >
            <InputNumber
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            name="trade_number"
            label="交易数量"
            rules={[{ required: true, message: '请输入交易数量!' }]}
          >
            <InputNumber
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            name="trade_amount"
            label="交易金额"
            rules={[{ required: true, message: '请输入交易金额!' }]}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input placeholder="点击计算交易金额" value={tradeAmount}/>
              <Button type="primary" onClick={handleCalculate}>计算</Button>
            </Space.Compact>
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

export default TradeInfoListPage;