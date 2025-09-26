import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  jurisdiction?: {
    state?: string;
    district?: string;
    block?: string;
    village?: string;
  };
  department?: string;
  agency?: string;
  permissions: string[];
  isEmailVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  dashboardRoute: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  jurisdiction?: {
    state?: string;
    district?: string;
    block?: string;
    village?: string;
  };
  department?: string;
  agency?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardRoute, setDashboardRoute] = useState<string | null>(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/user`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            setToken(savedToken);
            
            // Get dashboard route
            const dashboardResponse = await fetch(`${API_BASE_URL}/auth/dashboard-route`, {
              headers: {
                'Authorization': `Bearer ${savedToken}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (dashboardResponse.ok) {
              const dashboardData = await dashboardResponse.json();
              setDashboardRoute(dashboardData.data.dashboardRoute);
            }
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('AuthContext: Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('AuthContext: Setting user data:', data.data.user);
      setUser(data.data.user);
      setToken(data.token);
      setDashboardRoute(data.dashboardRoute);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data.data.user);
      setToken(data.token);
      setDashboardRoute(data.data.user.dashboardRoute || '/dashboard/gram-panchayat');
      localStorage.setItem('token', data.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    setDashboardRoute(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        dashboardRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};