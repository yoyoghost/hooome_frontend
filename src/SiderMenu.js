import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import 'antd/dist/reset.css';
import menuConfig from './HooomeMenuConfig';
const { Sider } = Layout;


const SiderMenu = () => (
    <Sider width={200} className="site-layout-background">
        <Menu mode="inline" defaultSelectedKeys={['inProgressOrder']} defaultOpenKeys={['tradeTools']} style={{ height: '100%', borderRight: 0 }} items={menuConfig} />
    </Sider>
);

export default SiderMenu;