import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // 使用useAuth钩子中的login方法
      const result = await login({
        username: values.username,
        password: values.password,
        tenantCode: values.tenantCode || undefined
      });
      
      if (result.success) {
        message.success('登录成功');
        navigate('/');  // 登录成功后导航到Dashboard页面
      } else {
        message.error(result.error || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查用户名和密码');
    }
  };

  const handleFormValuesChange = () => {
    // 清除错误信息
  };

  // 跳转到忘记密码页面
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card 
            title={<Title level={3} style={{ textAlign: 'center' }}>MYP 平台登录</Title>} 
            variant="outlined"
          >
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                onValuesChange={handleFormValuesChange}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                  label="用户名"
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="请输入用户名"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                  label="密码"
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="请输入密码"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  name="tenantCode"
                  label="租户编码"
                  tooltip="超级管理员可以留空，普通用户必须输入租户编码"
                >
                  <Input
                    prefix={<HomeOutlined className="site-form-item-icon" />}
                    placeholder="请输入租户编码 (如 TENANT_A)"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item>
                  {error && (
                    <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
                      {error}
                    </div>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    登录
                  </Button>
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      测试账号: admin/admin123 (超级管理员，租户编码留空),
                      user1/user123 (租户A，租户编码: TENANT_A),
                      user2/user234 (租户B，租户编码: TENANT_B)
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <Button type="link" onClick={handleForgotPassword}>
                      忘记密码？
                    </Button>
                  </div>
                </Form.Item>
              </Form>
          </Card>
      </Col>
    </Row>
  );
};

export default Login;