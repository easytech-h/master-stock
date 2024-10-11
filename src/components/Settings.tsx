import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useSales } from '../context/SalesContext';
import { Lock, RefreshCw, UserPlus, Users, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, changePassword, resetSuperAdminPassword } = useAuth();
  const { deleteAllProducts } = useInventory();
  const { clearSales } = useSales();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', isSuperAdmin: false });
  const [users, setUsers] = useState([
    { id: '1', username: 'admin', isSuperAdmin: false },
    { id: '2', username: 'Easytech', isSuperAdmin: true },
    { id: '3', username: 'cashier1', isSuperAdmin: false },
  ]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    if (changePassword(oldPassword, newPassword)) {
      setMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage('Failed to change password');
    }
  };

  const handleResetSuperAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    if (resetSuperAdminPassword(newPassword)) {
      setMessage('Superadmin password reset successfully');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage('Failed to reset superadmin password');
    }
  };

  const handleResetSystem = () => {
    if (window.confirm('Are you sure you want to reset the entire system? This action will delete all products and sales data. This action cannot be undone.')) {
      deleteAllProducts();
      clearSales();
      setMessage('System has been completely reset');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.password) {
      setUsers([...users, { id: Date.now().toString(), ...newUser }]);
      setNewUser({ username: '', password: '', isSuperAdmin: false });
      setMessage('User added successfully');
    } else {
      setMessage('Please fill in all fields');
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      setMessage('User deleted successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block mb-2">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <Lock className="inline-block mr-2" size={18} />
            Change Password
          </button>
        </form>
      </div>
      
      {user?.isSuperAdmin && (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Reset Superadmin Password</h2>
            <form onSubmit={handleResetSuperAdminPassword}>
              <div className="mb-4">
                <label htmlFor="newSuperAdminPassword" className="block mb-2">New Superadmin Password:</label>
                <input
                  type="password"
                  id="newSuperAdminPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmSuperAdminPassword" className="block mb-2">Confirm New Superadmin Password:</label>
                <input
                  type="password"
                  id="confirmSuperAdminPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <Lock className="inline-block mr-2" size={18} />
                Reset Superadmin Password
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <form onSubmit={handleAddUser} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSuperAdmin"
                    checked={newUser.isSuperAdmin}
                    onChange={(e) => setNewUser({...newUser, isSuperAdmin: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isSuperAdmin">Super Admin</label>
                </div>
              </div>
              <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <UserPlus className="inline-block mr-2" size={18} />
                Add User
              </button>
            </form>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.isSuperAdmin ? 'Super Admin' : 'Cashier'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Reset System</h2>
            <p className="mb-4 text-red-600">
              <AlertTriangle className="inline-block mr-2" size={18} />
              Warning: This action will reset the entire system, deleting all products and sales data. This action cannot be undone.
            </p>
            <button
              onClick={handleResetSystem}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              <RefreshCw className="inline-block mr-2" size={18} />
              Reset Entire System
            </button>
          </div>
        </>
      )}
      
      {message && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default Settings;