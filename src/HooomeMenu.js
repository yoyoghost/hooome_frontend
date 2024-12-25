import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import menuConfig from './HooomeMenuConfig';
import { calc } from 'antd/es/theme/internal';
const { Sider } = Layout;

const HooomeMenu = () => {

    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('tradeDashboard');

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    useEffect(() => {
        console.log('useEffect selectedKey:', selectedKey);
        navigate(selectedKey);
    }, [selectedKey]);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };



    return (
        <Sider className="site-layout-background" collapsed={collapsed} onCollapse={setCollapsed}>
            <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{
                    marginBottom: 8,
                    marginTop: 8,
                }}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu mode="inline"
                // defaultSelectedKeys={['trade/inProgressOrder']} 
                defaultOpenKeys={['tradeTools']}
                selectedKeys={[selectedKey]}
                // style={{ height: '100%', borderRight: 0 }}
                style={{ height: "calc(100% - 48px)", borderRight: 0 }}
                items={menuConfig}
                onClick={handleMenuClick} />

        </Sider>
    )
};

export default HooomeMenu;