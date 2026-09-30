import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { SEED_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  activeRole: Role;
  login: (email: string, roleRequired?: Role) => { success: boolean; message?: string };
  loginAsDemo: (role: Role, sellerIndex?: number) => void;
  registerCustomer: (name: string, email: string, phone: string) => { success: boolean; user?: User };
  registerSeller: (name: string, email: string, phone: string, storeName: string) => { success: boolean; user?: User };
  simulatedResetPassword: (email: string) => boolean;
  logout: () => void;
  switchActiveUser: (userId: string) => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'optique_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('optique_users');
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_USERS[0]; // Default to Amina (Customer) or null
    } catch {
      return SEED_USERS[0];
    }
  });

  const activeRole: Role = currentUser ? currentUser.role : 'guest';

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save current user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('optique_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users', e);
    }
  }, [users]);

  const login = (email: string, roleRequired?: Role): { success: boolean; message?: string } => {
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'Adresse email non reconnue dans la démo.' };
    }
    if (roleRequired && user.role !== roleRequired) {
      return {
        success: false,
        message: `Ce compte a le rôle "${user.role}" et ne peut pas se connecter via ce portail.`
      };
    }
    setCurrentUser(user);
    return { success: true };
  };

  const loginAsDemo = (role: Role, sellerIndex = 0) => {
    if (role === 'customer') {
      const cust = users.find(u => u.role === 'customer') || SEED_USERS[0];
      setCurrentUser(cust);
    } else if (role === 'seller') {
      const sellers = users.filter(u => u.role === 'seller');
      const seller = sellers[sellerIndex] || sellers[0] || SEED_USERS[1];
      setCurrentUser(seller);
    } else if (role === 'admin') {
      const admin = users.find(u => u.role === 'admin') || SEED_USERS[4];
      setCurrentUser(admin);
    } else {
      setCurrentUser(null);
    }
  };

  const registerCustomer = (name: string, email: string, phone: string) => {
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false };
    }
    const newUser: User = {
      id: `user-cust-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const registerSeller = (name: string, email: string, phone: string, _storeName: string) => {
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false };
    }
    const storeId = `store-${Date.now()}`;
    const newUser: User = {
      id: `user-seller-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      phone,
      role: 'seller',
      sellerStoreId: storeId,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const simulatedResetPassword = (email: string): boolean => {
    // Just verify format
    return email.includes('@');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchActiveUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        login,
        loginAsDemo,
        registerCustomer,
        registerSeller,
        simulatedResetPassword,
        logout,
        switchActiveUser,
        allUsers: users
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
