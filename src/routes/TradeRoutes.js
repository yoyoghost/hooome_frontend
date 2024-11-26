import InProgressOrderPage from '../trade/InProgressOrderPage';
import CompleteOrderPage from '../trade/CompleteOrderPage';
import TradeDashboardPage from '../trade/TradeDashboardPage';

const TradeRouteArray = [
    { path: 'inProgressOrder', element: InProgressOrderPage },
    { path: 'tradeDashboard', element: TradeDashboardPage },
    { path: 'completeOrder', element: CompleteOrderPage }
];
export default TradeRouteArray;