import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';
import SalesHistory from './components/SalesHistory';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { SalesProvider } from './context/SalesContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <InventoryProvider>
        <SalesProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/*"
                  element={
                    <>
                      <Navigation />
                      <div className="flex-grow p-4">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/sales" element={<Sales />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/sales-history" element={<SalesHistory />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </div>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
          </Router>
        </SalesProvider>
      </InventoryProvider>
    </AuthProvider>
  );
};

export default App;