import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import menuConfig from './HooomeMenuConfig';
const { Sider } = Layout;

const HooomeMenu = () => {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('tradeDashboard');
    
    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    useEffect(() => {
        console.log('useEffect selectedKey:', selectedKey);
        navigate(selectedKey);
    }, [selectedKey]);
    
    return (
        <Sider width={200} className="site-layout-background" collapsed={collapsed} onCollapse={setCollapsed}>
            <Menu mode="inline"
                // defaultSelectedKeys={['trade/inProgressOrder']} 
                defaultOpenKeys={['tradeTools']}
                selectedKeys={[selectedKey]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuConfig}
                onClick={handleMenuClick} />
        </Sider>
    )
};

export default HooomeMenu;