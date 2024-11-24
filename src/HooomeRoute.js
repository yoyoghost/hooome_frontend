import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import InProgressOrderPage from './trade/InProgressOrderPage';
import TradeDashBoardPage from './trade/TradeDashBoardPage';
import CompleteOrderPage from './trade/CompleteOrderPage';

const HooomeRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="trade/inProgressOrder" element={<InProgressOrderPage />} />
            <Route path="trade/tradeDashBoard" element={<TradeDashBoardPage />} />
            <Route path="trade/completeOrder" element={<CompleteOrderPage />} />
        </Routes>
    </Router>
);

export default HooomeRoutes;