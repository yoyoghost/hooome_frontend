import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Table, message } from 'antd';
import { tradeDashboardBaseUrl } from '../tools/const'
import api from '../tools/api.js';
import '../index.css';
import '../Custom.css';

// 使用 style 属性设置背景色
const cardStyle = {
  // backgroundColor: '#F3FAF6', // 设置背景颜色
  borderColor: '#666666',     // 设置边框颜色
};

const TradeDashboardPage = () => {

  const table1Columns = [
    {
      title: '名称',
      dataIndex: 'stock_name',
      key: 'stock_name',
    },
    {
      title: '点位',
      dataIndex: 'trade_point',
      key: 'trade_point',
    },
    {
      title: '可交易数量',
      dataIndex: 'trade_remaining_number',
      key: 'trade_remaining_number',
    },
  ];

  const [table1DataList, setTable1DataList] = useState([]);

  useEffect(() => {
    const getTradeInfoList = async () => {
      try {
        api.post(tradeDashboardBaseUrl + 'getSmallTradePoint').then(
          response => {
            var dataList = response.data;
            if (dataList === null || !Array.isArray(dataList) || dataList.length === 0) {
              setTable1DataList(null);
            } else {
              console.log("tradeInfoList: " + JSON.stringify(dataList));
              setTable1DataList(dataList);
            }
          }
        ).catch(error => {
          console.error('getSmallTradePoint error:', error);
          const errorresp = error.response.data;
          message.error(errorresp.message);
        });
      } catch (error) {
        console.error('Failed togetSmallTradePoint:', error);
      }
    };
    getTradeInfoList();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="持有的最低的两个点位及数量" bordered={true} style={cardStyle} className='fixed-height-card'>
          <Table dataSource={table1DataList} columns={table1Columns} pagination={false} size="small" className="hide-header" />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="各个持有剩余总量" bordered={true} style={cardStyle}>
          
        </Card>
      </Col>
      <Col span={8}>
        <Card title="待定....." bordered={true} style={cardStyle}>
          
        </Card>
      </Col>
    </Row>
  )
};
export default TradeDashboardPage;