import InProgressOrderPage from '../trade/InProgressOrderPage';
import CompleteOrderPage from '../trade/CompleteOrderPage';
import TradeDashboardPage from '../trade/TradeDashboardPage';

const TradeRouteArray = [
    { path: '/trade/inProgressOrder', element: InProgressOrderPage },
    { path: '/trade/tradeDashboard', element: TradeDashboardPage },
    { path: '/trade/completeOrder', element: CompleteOrderPage }
];
export default TradeRouteArray;