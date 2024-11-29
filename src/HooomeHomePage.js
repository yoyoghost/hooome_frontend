import React from 'react';
import { useLocation } from 'react-router-dom';
import HooomeMenu from './HooomeMenu';
import HomeCombinRoutes from './routes/HomeCombinRoutes';
import { Breadcrumb, Layout, theme } from 'antd';
import './index.css';
const { Content, Footer } = Layout;

const HooomeHomePage = () => {

  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Layout>
        <HooomeMenu />
        <Layout
          style={{
            padding: '0 24px 24px',
            height: '100%'
          }}
        >
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{location.pathname.split('/').pop()}</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <HomeCombinRoutes />
          </Content>
          <Footer>◎hooome</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default HooomeHomePage;