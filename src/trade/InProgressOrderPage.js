import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, InputNumber, Space, Typography, Popconfirm } from 'antd';
import { Radio, DatePicker, AutoComplete } from 'antd';
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
            // console.info("getDCStockInfoList: " + JSON.stringify(response.data));
            setStockList(response.data);
          }
        ).catch(error => {
          console.error('getDCStockInfoList error:', error);
          const errorresp = error.response.data;
          message.error(errorresp.message);
        });

      } catch (error) {
        console.error('Failed to getDCStockInfoList:', error);
      }
    };

    const getTradeType = async () => {
      try {
        api.post(tradeCommonBaseUrl + 'getTradeType').then(
          response => {
            // console.info("getTradeType: " + JSON.stringify(response.data));
            setTradeType(response.data);
          }
        ).catch(error => {
          console.error('getTradeType error:', error);
          const errorresp = error.response.data;
          message.error(errorresp.message);
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
      if (stockList) {
        // 股票名称过滤
        let stockFilterDate = [];
        stockList.forEach(item => {
          stockFilterDate.push({ 'text': item['stock_name'], 'value': item['stock_name'] })
        });
        let filteredInfoTemp = {};
        filteredInfoTemp['stockFilterDate'] = stockFilterDate;
        // console.log("filteredInfoTemp: " + JSON.stringify(filteredInfoTemp));
        setFilteredInfo(filteredInfoTemp);
      };
    }
    initFilteredInfo();
  }, [stockList]);

  // 筛选和排序相关
  const [filteredInfoData, setFilteredInfoData] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const clearFilters = () => {
    setFilteredInfoData({});
  };

  const clearFiltersAndSorts = () => {
    setFilteredInfoData({});
    setSortedInfo({});
  };

  // 重置筛选，配合使用
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfoData(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: '股票名称',
      width: 150,
      dataIndex: 'stock_name',
      key: 'stock_name',
      filters: filteredInfo['stockFilterDate'],
      filteredValue: filteredInfoData.stock_name || null,
      onFilter: (value, record) => record.stock_name === value,
    },
    {
      title: '买入日期',
      width: 120,
      dataIndex: 'trade_date',
      key: 'trade_date',
      sorter: (a, b) => {
        // 使用dayjs将日期字符串转换为日期对象
        const dateA = dayjs(a.trade_date);
        const dateB = dayjs(b.trade_date);
        // 比较两个日期对象
        return dateA.diff(dateB);
      },
      sortOrder: sortedInfo.columnKey === 'trade_date' ? sortedInfo.order : null,
    },
    {
      title: '买入点位',
      dataIndex: 'trade_point',
      key: 'trade_point',
      width: 120,
      sorter: (a, b) => a.trade_point - b.trade_point,
      sortOrder: sortedInfo.columnKey === 'trade_point' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '买入数量',
      dataIndex: 'trade_number',
      key: 'trade_number',
      width: 120,
      filters: filteredInfo['stockStatusFilterDate'],
      filteredValue: filteredInfoData.stock_status || null,
      onFilter: (value, record) => record.stock_status === value,
    },
    {
      title: '买入金额',
      dataIndex: 'trade_amount',
      key: 'trade_amount',
      width: 120,
    },
    {
      title: '剩余数量',
      dataIndex: 'trade_remaining_number',
      key: 'trade_remaining_number',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (text, record) => {
        // 是否可以编辑
        const isCanEdit = record.is_can_edit === 1;
        // 删除信息提示
        const delInfo = record.stock_name + '-' + record.trade_point;
        return (
          <Space size="middle">
            <Typography.Link onClick={() => handleSell(record)}>
              新增卖出
            </Typography.Link>
            {isCanEdit && (
              <>
                <Typography.Link onClick={() => handleEdit(record)}>
                  编辑
                </Typography.Link>
                <Popconfirm title={`是否确定删除 [${delInfo}]?`} okText="确定" cancelText="取消" onConfirm={() => handleDelete(record)}>
                  <a>删除</a>
                </Popconfirm>
              </>
            )}
          </Space>
        )
      },
    },
  ];

  // 获取列表，依赖其他数据加载完成
  const [tradeInfoList, setTradeInfoList] = useState(null);
  useEffect(() => {
    const getTradeInfoList = async () => {
      // console.log("tradeType: " + JSON.stringify(tradeType));
      // console.log("stockList: " + JSON.stringify(stockList));
      if (tradeType && stockList && tradeType.length > 0) {
        try {
          api.post(tradeInfoBaseUrl + 'getInProgressTradeInfoList').then(
            response => {
              var tradeInfoList = response.data;
              if (tradeInfoList === null || !Array.isArray(tradeInfoList) || tradeInfoList.length === 0) {
                setTradeInfoList(null);
              } else {
                // console.log("tradeInfoList: " + JSON.stringify(tradeInfoList));
                setTradeInfoList(tradeInfoList);
              }
            }
          ).catch(error => {
            console.error('get tradeInfoList error:', error);
            const errorresp = error.response.data;
            message.error(errorresp.message);
          });
        } catch (error) {
          console.error('Failed to fetch tradeInfoList:', error);
        }
      }
    };
    getTradeInfoList();
  }, [tradeType, stockList]);

  // form
  const [form] = Form.useForm();

  // 控制modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 控制编辑
  const [editingData, setEditingData] = useState(null);

  // 控制新增卖出
  // sellData 新增的卖出的数据
  // sellMainData 原买入的数据
  const [sellData, setSellData] = useState(null);
  const [sellMainData, setSellMianData] = useState(null);

  // 买入点位，创建卖出时使用
  const [buyPoint, setBuyPoint] = useState(null);
  const [buyNumber, setBuyNumber] = useState(null);
  // 控制表单字段是否展示
  const [isBuyPointVisible, setIsBuyPointVisible] = useState({ display: 'none' });

  // 打开新增/编辑弹窗
  const handleAdd = () => {
    setEditingData(null); // 重置编辑
    setSellData(null) // 重置新增卖出
    form.setFieldsValue({ stock_desc: undefined });
    form.setFieldsValue(initialData);
    setTradeDate(dayjs().format('YYYY-MM-DD'));
    setIsModalVisible(true);
  };

  // 处理卖出
  // parent_trade_info_id
  const handleSell = (data) => {
    setEditingData(null); // 重置编辑
    const sellData = { ...data }
    // 交易父记录id
    sellData.parent_trade_info_id = data.id;
    // 展示购买点位/剩余可卖数量
    setBuyPoint(data.trade_point);
    setBuyNumber(data.trade_remaining_number);
    sellData.trade_type = "2"; // 默认卖出
    // 股票下拉框重新赋值
    sellData.stock_desc = data.stock_name;
    // 相关属性置为空
    sellData.id = null;
    sellData.trade_point = null;
    sellData.trade_number = null;
    // 交易金额重新赋值
    sellData.trade_amount = null;
    // console.log("sell data: ", sellData)
    setSellData(sellData);
    setIsBuyPointVisible({ display: 'block' });
    form.setFieldsValue(sellData);
    setIsModalVisible(true);
  };

  // 编辑
  const handleEdit = (data) => {
    setSellData(null) // 重置新增卖出
    const newEditData = { ...data }
    // console.log("edit data: ", newEditData)
    // 回填交易日期
    setTradeDate(data.trade_date);
    form.setFieldsValue({ trade_date: data.trade_date });
    // 股票下拉框重新赋值
    newEditData.stock_desc = data.stock_name;
    // 操作类型重新赋值
    newEditData.trade_type = data.trade_type + "";
    // 交易金额重新赋值
    newEditData.trade_amount = null;
    setEditingData(newEditData);
    form.setFieldsValue(newEditData);
    setIsModalVisible(true);
  };

  const handleDelete = (data) => {
    console.log("delete data: ", data)
    api.post(tradeInfoBaseUrl + 'delTradeInfo', data).then(response => {
      // console.info("del response:" + JSON.stringify(response))
      const delData = response.data;
      if (tradeInfoList.length > 0) {
        const updatedDataList = tradeInfoList.filter(item => item.id !== delData.id);
        setTradeInfoList(updatedDataList);
      }
      message.success('删除成功');
    }).catch(error => {
      const errorresp = error.response.data;
      console.error('Error addTradeInfo: ', error);
      message.error(errorresp.message);
    });
  };

  // 关闭弹窗
  const handleCancel = () => {
    // 关闭弹窗
    setIsModalVisible(false);

    // 清除编辑的数据
    setEditingData(null);
    setStockId(null);
    setStockName(null);
    setTradeAmount(null);

    // 清除新建卖出相关
    setSellData(null);
    setIsBuyPointVisible({ display: 'none' });

    // 清除告警等信息
    form.resetFields();

    // 重置默认日期
    form.setFieldsValue({ stock_desc: undefined });
    setTradeDate(dayjs().format('YYYY-MM-DD'));
  };

  const handleSubmit = (values) => {
    if (editingData) {
      // 编辑
      console.info("edit value is: " + JSON.stringify(values));
      api.post(tradeInfoBaseUrl + 'editTradeInfo', values).then(response => {
        // console.info("edit response:" + JSON.stringify(response))
        const editData = response.data;
        if (tradeInfoList === null || !Array.isArray(tradeInfoList) || tradeInfoList.length === 0) {
          setTradeInfoList([editData]);
        } else {
          const updatedTradeList = tradeInfoList.map(trade =>
            trade.id === editData.id ? { ...trade, ...editData } : trade
          );
          setTradeInfoList(updatedTradeList);
        }
        message.success('修改成功');
      }).catch(error => {
        console.error('Error addTradeInfo: ', error);
        const errorresp = error.response.data;
        message.error(errorresp.message);
      });
    } else {
      // 新增买入或者卖出
      const currentTradetype = values.trade_type;
      console.info("add value is: " + JSON.stringify(values));
      api.post(tradeInfoBaseUrl + 'addTradeInfo', values).then(response => {
        // console.info("add response:" + JSON.stringify(response))
        const newData = response.data;
        // console.log("currentTradetype: " + currentTradetype);
        if(currentTradetype === "1") {
          if (tradeInfoList === null || !Array.isArray(tradeInfoList) || tradeInfoList.length === 0) {
            setTradeInfoList([newData]);
          } else {
            setTradeInfoList([...tradeInfoList, newData]);
          }
        } else {
          const tradeRemainingNumber = newData.trade_remaining_number;
          if(tradeRemainingNumber === 0) {
            const updatedDataList = tradeInfoList.filter(item => item.id !== newData.id);
            setTradeInfoList(updatedDataList);
          } else {
            const updatedDataList = tradeInfoList.map(trade =>
              trade.id === newData.id ? { ...trade, ...newData } : trade
            );
            setTradeInfoList(updatedDataList);
          }
        }
        message.success('新增成功');
      }).catch(error => {
        const errorresp = error.response.data;
        console.error('Error addTradeInfo: ', error);
        message.error(errorresp.message);
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

    // 提交成功以后重置表单交易日期
    setTradeDate(dayjs().format('YYYY-MM-DD'));
    form.setFieldsValue({ trade_date: dayjs().format('YYYY-MM-DD') });
  };

  // 新增或者编辑交易相关
  const tradeTypeInfo = [{ 'label': '买入', 'value': '1' }, { 'label': '卖出', 'value': '2' }];

  // 计算交易金额
  const [tradeAmount, setTradeAmount] = useState('');
  const handleCalculate = () => {
    form.validateFields(['trade_number', 'trade_point']).then((values) => {
      const { trade_number, trade_point } = values;
      const total = parseFloat(trade_number) * parseFloat(trade_point) / 1000;
      // console.log("total: " + total);
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
  // 初始化交易日期
  const [tradeDate, setTradeDate] = useState(dayjs().format('YYYY-MM-DD'));
  // 初始化表单数据
  const initialData = { 'trade_amount': null, 'trade_desc': null, 'trade_point': null, 'parent_trade_info_id': 0, 'trade_type': '1', 'trade_number': 10000 };
  // 默认交易数量
  const tradeAmountOption = [{ value: 5000 }, { value: 10000 }, { value: 20000 },]
  // 处理日期
  const handleDateChange = (date, dateString) => {
    setTradeDate(dateString);
    form.setFieldsValue({ trade_date: dateString }); // 更新表单字段值
  };
  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ margin: '0px 0px 10px 0px' }}>
        新增交易信息
      </Button>
      <Button type="dashed" onClick={clearFilters} style={{ margin: '0px 0px 10px 10px' }}>
        重置筛选
      </Button>
      <Button type="dashed" onClick={clearFiltersAndSorts} style={{ margin: '0px 0px 10px 10px' }}>
        重置筛选和排序
      </Button>
      <Table
        locale={{
          triggerAsc: '升序',  // 升序排序
          triggerDesc: '降序', // 降序排序
          cancelSort: '取消排序'   // 取消排序
        }}
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
        title={editingData ? '编辑交易信息' : (sellData ? '新增卖出信息' : '新增交易信息')}
        open={isModalVisible}
        footer={null}
        mask='true'
        maskClosable='false'
        closable={false}
      >
        <Form
          form={form}
          initialValues={editingData || sellData || initialData}
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
            name="parent_trade_info_id"
            label="parent_trade_info_id"
            hidden="true"
          >
            <Input />
          </Form.Item>
          {/* 股票ID */}
          <Form.Item
            name="stock_id"
            label="stock_id"
            hidden="true"
            value={stockId}
          >
            <Input />
          </Form.Item>

          {/* 股票名称 */}
          <Form.Item
            name="stock_name"
            label="stock_name"
            hidden="true"
            value={stockName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stock_desc"
            label="股票名称"
            rules={[{ required: true, message: '请选择一个交易对象!' }]}
            layout="horizontal"
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
            initialValue={tradeDate}
            layout="horizontal"
          >
            <Space>
              <DatePicker locale={zhCN}
                maxDate={dayjs()}
                format="YYYY-MM-DD"
                value={dayjs(tradeDate)}
                // defaultValue={}
                onChange={handleDateChange}
              />
            </Space>
          </Form.Item>
          <Form.Item
            name="trade_type"
            label="交易类型"
            layout="horizontal"
            rules={[{ required: true, message: '请选择交易类型!' }]}
          >
            <Radio.Group
              block
              // disabled
              options={tradeTypeInfo}
              optionType="button"
            />
          </Form.Item>

          {/* 买入点位 买入数量 */}
          <Space.Compact style={isBuyPointVisible}>
            <Form.Item
              label="买入点位"
              layout="horizontal"
              style={{
                display: 'inline-block',
                width: '50%',
              }}
            >
              <Input
                count={{
                  max: 1,
                }}
                variant="borderless" // 无边框
                value={buyPoint}
              />
            </Form.Item>
            <Form.Item
              label="剩余可卖数量"
              layout="horizontal"
              style={{
                display: 'inline-block',
                width: '50%',
              }}
            >
              <Input
                count={{
                  max: 1,
                }}
                variant="borderless" // 无边框
                value={buyNumber}
              />
            </Form.Item>
          </Space.Compact>
          <Form.Item
            name="trade_point"
            label="交易点位"
            rules={[{ required: true, message: '请输入交易点位!' }]}
            layout="horizontal"
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
            layout="horizontal"
          >
            {/* <InputNumber
              style={{
                width: '100%',
              }}
            /> */}
            <AutoComplete
              style={{ width: '100%' }}
              options={tradeAmountOption}
              placeholder="请输入或选择交易数量"
            />
          </Form.Item>
          <Form.Item
            name="trade_amount"
            label="交易金额"
            rules={[{ required: true, message: '请输入交易金额!' }]}
            layout="horizontal"
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input placeholder="点击计算交易金额" value={tradeAmount} />
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