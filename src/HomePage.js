import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SiderMenu from './SiderMenu';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import InProgressOrderPage from './trade/InProgressOrderPage';
import TradeDashBoardPage from './trade/TradeDashBoardPage';
import CompleteOrderPage from './trade/CompleteOrderPage';

import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Space, Table } from 'antd';
const { Header, Content, Sider, Footer } = Layout;


const expandDataSource = Array.from({
  length: 3,
}).map((_, i) => ({
  key: i.toString(),
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));

const dataSource = Array.from({
  length: 3,
}).map((_, i) => ({
  key: i.toString(),
  name: 'Screen',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}));

const expandColumns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Status',
    key: 'state',
    render: () => <Badge status="success" text="Finished" />,
  },
  {
    title: 'Upgrade Status',
    dataIndex: 'upgradeNum',
    key: 'upgradeNum',
  },
  {
    title: 'Action',
    key: 'operation',
    render: () => (
      <Space size="middle">
        <a>Pause</a>
        <a>Stop</a>
      </Space>
    ),
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Platform',
    dataIndex: 'platform',
    key: 'platform',
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: 'Upgraded',
    dataIndex: 'upgradeNum',
    key: 'upgradeNum',
  },
  {
    title: 'Creator',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Action',
    key: 'operation',
    render: () => <a>Publish</a>,
  },
];

const expandedRowRender = () => (
  <Table columns={expandColumns} dataSource={expandDataSource} pagination={false} />
);

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Layout>
        <SiderMenu />
        <Layout
          style={{
            padding: '0 24px 24px',
            height: '100%'
          }}
        >
          <Breadcrumb
            items={[
              {
                title: 'Home',
              },
              {
                title: 'List',
              },
              {
                title: 'App',
              },
            ]}
            style={{
              margin: '16px 0',
            }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="trade/inProgressOrder" element={<InProgressOrderPage />} />
              <Route path="trade/tradeDashBoard" element={<TradeDashBoardPage />} />
              <Route path="trade/completeOrder" element={<CompleteOrderPage />} />
          </Routes>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >◎hooome</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;