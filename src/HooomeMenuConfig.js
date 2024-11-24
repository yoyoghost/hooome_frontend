import { StockOutlined, PayCircleOutlined, AccountBookOutlined, SmileOutlined } from '@ant-design/icons';
const menuConfig = [
    {
        key: 'tradeTools',
        label: 'tradeTools',
        icon: <StockOutlined />,
        children: [
            {
                key: 'tradeDashBord',
                label: 'tradeDashBord',
                icon: <AccountBookOutlined />,
                path: "trade/tradeDashBoard"
            },
            {
                key: 'inProgressOrder',
                label: 'inProgressOrder',
                icon: <PayCircleOutlined />,
                path: "trade/inProgressOrder"
            },
            {
                key: 'completeOrder',
                label: 'completeOrder',
                icon: <SmileOutlined />,
                path: "trade/completeOrder"
            }
        ],
    }]

export default menuConfig;