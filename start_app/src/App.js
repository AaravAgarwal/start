import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingForm from './components/onboarding';
import Landing from './components/landing';
import Dasboard from './components/dashboard';
import UnitEcon from './components/unitEcon';
import BusinessPlanForm from './components/business';
import ChatPage from './components/chatPage';
import Valuation from './components/valuation';

// Simple auth check function
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// Protected route component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<OnboardingForm />} />
        <Route path="/dashboard" element={<Dasboard />} />
        <Route path="/unitecon" element={<UnitEcon />} />
        <Route path="/business" element={<BusinessPlanForm />} />
        <Route path="/valuation" element={<Valuation />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;