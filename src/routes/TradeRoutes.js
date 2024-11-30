import { PayCircleOutlined, AccountBookOutlined, SmileOutlined, RobotOutlined } from '@ant-design/icons';
import InProgressOrderPage from '../trade/InProgressOrderPage';
import CompleteOrderPage from '../trade/CompleteOrderPage';
import TradeDashboardPage from '../trade/TradeDashboardPage';
import StockInfoListPage from '../trade/StockInfoListPage';

const TradeRouteArray = [
    { key: 'inProgressOrder', element: InProgressOrderPage, label: '进行中交易单', icon: <PayCircleOutlined /> },
    { key: 'tradeDashboard', element: TradeDashboardPage, label: '交易情况概览', icon: <AccountBookOutlined />  },
    { key: 'completeOrder', element: CompleteOrderPage, label: '完成交易单', icon: <SmileOutlined />  },
    { key: 'stockInfoList', element: StockInfoListPage, label: '股票列表', icon: <RobotOutlined />  },
];
export default TradeRouteArray;