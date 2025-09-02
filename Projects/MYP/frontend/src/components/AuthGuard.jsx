import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // 如果没有token或用户信息，重定向到登录页面
    if (!token || !user) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
};

export default AuthGuard;