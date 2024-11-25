import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate} from 'react-router-dom';
import 'antd/dist/reset.css';
import menuConfig from './HooomeMenuConfig';
const { Sider } = Layout;

const HooomeMenu = () => {
    const [selectedKey, setSelectedKey] = useState('/trade/inProgressOrder');
    const [collapsed, setCollapsed] = React.useState(false);
    
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        console.log('click ', e);
        setSelectedKey(e.key);
        navigate(`${e.key}`);
    };

    return (
        <Sider width={200} className="site-layout-background" collapsed={collapsed} onCollapse={setCollapsed}>
            <Menu mode="inline" 
                // defaultSelectedKeys={['/trade/inProgressOrder']} 
                defaultOpenKeys={['tradeTools']} 
                selectedKeys={[selectedKey]}
                style={{ height: '100%', borderRight: 0 }} 
                items={menuConfig} 
                onClick={handleMenuClick}/>
        </Sider>
    )
};

export default HooomeMenu;