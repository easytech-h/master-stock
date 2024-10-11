import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, LayoutDashboard, Box, DollarSign, FileText, History, LogOut, RefreshCw, Settings, Menu } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetSystem = () => {
    if (window.confirm('Are you sure you want to reset the system? This action cannot be undone.')) {
      // Reset logic goes here
      console.log('System reset');
    }
  };

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => (
    <Link to={to} className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-white" />
            <span className="ml-2 text-white font-semibold text-lg hidden sm:block">EASYTECH MASTER STOCK</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
              <NavLink to="/inventory" icon={<Box size={18} />}>Inventory</NavLink>
              <NavLink to="/sales" icon={<DollarSign size={18} />}>Sales</NavLink>
              <NavLink to="/reports" icon={<FileText size={18} />}>Reports</NavLink>
              <NavLink to="/sales-history" icon={<History size={18} />}>Sales History</NavLink>
              <NavLink to="/settings" icon={<Settings size={18} />}>Settings</NavLink>
              {user?.isSuperAdmin && (
                <button
                  onClick={handleResetSystem}
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <RefreshCw size={18} />
                  <span className="ml-2">Reset System</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut size={18} />
                <span className="ml-2">Log out</span>
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-indigo-500 px-2 py-1 rounded-md"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
            <NavLink to="/inventory" icon={<Box size={18} />}>Inventory</NavLink>
            <NavLink to="/sales" icon={<DollarSign size={18} />}>Sales</NavLink>
            <NavLink to="/reports" icon={<FileText size={18} />}>Reports</NavLink>
            <NavLink to="/sales-history" icon={<History size={18} />}>Sales History</NavLink>
            <NavLink to="/settings" icon={<Settings size={18} />}>Settings</NavLink>
            {user?.isSuperAdmin && (
              <button
                onClick={handleResetSystem}
                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center w-full"
              >
                <RefreshCw size={18} />
                <span className="ml-2">Reset System</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center w-full"
            >
              <LogOut size={18} />
              <span className="ml-2">Log out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;