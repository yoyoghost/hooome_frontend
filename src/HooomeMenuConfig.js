import { StockOutlined} from '@ant-design/icons';
import TradeRoute from './routes/TradeRoutes.js';

const menuConfig = [
    {
        key: 'tradeTools',
        label: 'tradeTools',
        icon: <StockOutlined />,
        children: TradeRoute
    }]

export default menuConfig;


// [
//     {
//         key: 'tradeDashboard',
//         label: 'tradeDashboard',
//         icon: <AccountBookOutlined />
    
//     },
//     {
//         key: 'inProgressOrder',
//         label: 'inProgressOrder',
//         icon: <PayCircleOutlined />
//     },
//     {
//         key: 'completeOrder',
//         label: 'completeOrder',
//         icon: <SmileOutlined />
//     }
// ],