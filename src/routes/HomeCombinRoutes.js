import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TradeRouteArray from './TradeRoutes';
import OtherRoutes from './OtherRoutes';

const HomeCombinRoutes = () => (
        <Routes>
                {TradeRouteArray.map((route, index) => (
                        <Route key={index} path={route.key} element={<route.element />} />))}
                {OtherRoutes.map((route, index) => (
                        <Route key={index} path={route.key} element={<route.element />} />))}
        </Routes>
);
export default HomeCombinRoutes;