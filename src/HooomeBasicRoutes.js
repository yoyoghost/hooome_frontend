import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HooomeHomePage';

const HooomeBasicRoutes = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/trade/*" element={<HomePage />} />
            <Route path="/trade" element={<HomePage />} />
        </Routes>
    </Router>
);

export default HooomeBasicRoutes;