import React, { createContext, useState, useContext } from 'react';

interface User {
  username: string;
  isSuperAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  resetPassword: (newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    if ((username === 'admin' && password === 'admin') || (username === 'Easytech' && password === 'Juliette')) {
      setUser({ username, isSuperAdmin: username === 'Easytech' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    // In a real application, this would interact with a backend
    // For this example, we'll just simulate a successful password change
    return true;
  };

  const resetPassword = (newPassword: string): boolean => {
    // In a real application, this would update the user's password in the backend
    // For this example, we'll just simulate a successful password reset
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};