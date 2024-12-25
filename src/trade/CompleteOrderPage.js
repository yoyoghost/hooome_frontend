import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { stockBaseUrl, tradeInfoBaseUrl } from '../tools/const'
import api from '../tools/api.js';
import '../Custom.css';

import { createStyles } from 'antd-style';
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const CompleteOrderPage = () => {

  // 获取股票名称等相关信息
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
    getDCStockInfoList();
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
  ];

  const childColumns = [
    {
      title: '卖出日期',
      width: 120,
      dataIndex: 'trade_date',
      key: 'trade_date',
    },
    {
      title: '卖出点位',
      dataIndex: 'trade_point',
      key: 'trade_point',
      width: 120,
    },
    {
      title: '卖出数量',
      dataIndex: 'trade_number',
      key: 'trade_number',
      width: 120,
    },
    {
      title: '卖出金额',
      dataIndex: 'trade_amount',
      key: 'trade_amount',
      width: 120,
    },
  ];

  // 控制展开
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const onExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.key]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.key));
    }
  };

  const expandedRowRender = (record) => (
    <div style={{ width: '90%', marginLeft: 'auto' }}>
      <Table columns={childColumns} dataSource={record.completed_trade_info_list || []} pagination={false} size="small" className='sub-table-custom-class'/>
    </div>
  );

  // 获取列表，依赖其他数据加载完成
  const [tradeInfoList, setTradeInfoList] = useState(null);
  useEffect(() => {
    const getTradeInfoList = async () => {
      // console.log("tradeType: " + JSON.stringify(tradeType));
      // console.log("stockList: " + JSON.stringify(stockList));
      if (stockList && stockList.length > 0) {
        try {
          api.post(tradeInfoBaseUrl + 'getCompleteTradeInfoList').then(
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
  }, [stockList]);

  const { styles } = useStyle();

  return (
    <div>
      <Button type="dashed" onClick={clearFilters} style={{ margin: '0px 0px 10px 10px' }}>
        重置筛选
      </Button>
      <Button type="dashed" onClick={clearFiltersAndSorts} style={{ margin: '0px 0px 10px 10px' }}>
        重置筛选和排序
      </Button>
      <Table

        className={styles.customTable}

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

        expandable={{
          expandedRowRender,
        }}

        rowKey="id"

        pagination={false}
      />
    </div>
  );
};

export default CompleteOrderPage;