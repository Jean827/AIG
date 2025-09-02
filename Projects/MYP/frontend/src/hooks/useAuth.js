import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authAPI from '../api/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 从localStorage加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // 验证token是否有效
          const response = await authAPI.getUserInfo();
          setUser(response.data);
          setError(null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user information:', err);
        setUser(null);
        setError('Failed to load user information');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录方法
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      // 保存token和用户信息到localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        name: response.name,
        tenantId: response.tenantId,
        tenantName: response.tenantName,
        currentTenantId: response.currentTenantId,
        currentTenantName: response.currentTenantName,
        currentTenantCode: response.currentTenantCode,
        roles: response.roles
      }));
      
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        name: response.name,
        tenantId: response.tenantId,
        tenantName: response.tenantName,
        currentTenantId: response.currentTenantId,
        currentTenantName: response.currentTenantName,
        currentTenantCode: response.currentTenantCode,
        roles: response.roles
      });
      setError(null);
      
      return { success: true, user: {
        id: response.id,
        username: response.username,
        email: response.email,
        name: response.name,
        tenantId: response.tenantId,
        tenantName: response.tenantName,
        currentTenantId: response.currentTenantId,
        currentTenantName: response.currentTenantName,
        currentTenantCode: response.currentTenantCode,
        roles: response.roles
      } };
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      // 可选：调用登出API
      await authAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      // 清除localStorage中的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      // 重定向到登录页面
      navigate('/login');
    }
  };

  // 检查用户是否有特定角色
  const hasRole = (roleName) => {
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.some(role => role.name === roleName);
  };

  // 检查用户是否有特定权限
  const hasPermission = (permissionName) => {
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.some(role => 
      role.permissions && role.permissions.some(permission => permission.name === permissionName)
    );
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const response = await authAPI.getUserInfo();
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Failed to refresh user information:', err);
      setError('Failed to refresh user information');
      return null;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    hasPermission,
    refreshUser
  };
};

export default useAuth;