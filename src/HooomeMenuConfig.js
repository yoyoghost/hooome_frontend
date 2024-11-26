import { StockOutlined, PayCircleOutlined, AccountBookOutlined, SmileOutlined } from '@ant-design/icons';
const menuConfig = [
    {
        key: 'tradeTools',
        label: 'tradeTools',
        icon: <StockOutlined />,
        children: [
            {
                key: 'tradeDashboard',
                label: 'tradeDashboard',
                icon: <AccountBookOutlined />
            
            },
            {
                key: 'inProgressOrder',
                label: 'inProgressOrder',
                icon: <PayCircleOutlined />
            },
            {
                key: 'completeOrder',
                label: 'completeOrder',
                icon: <SmileOutlined />
            },
            {
                key: 'page1',
                label: 'page1',
                icon: <PayCircleOutlined />
            },
        ],
    }]

export default menuConfig;