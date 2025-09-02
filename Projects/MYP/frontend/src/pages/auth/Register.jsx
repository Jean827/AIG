import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

const { Title } = Typography;
const { Password } = Input;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 调用注册API
      const response = await register({
        username: values.username,
        password: values.password,
        email: values.email
      });
      
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
      message.error(error.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card 
          title={<Title level={3} style={{ textAlign: 'center' }}>MYP 平台注册</Title>}
          variant="outlined"
        >
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 20, message: '用户名长度应在3-20个字符之间' }
              ]}
              label="用户名"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入用户名"
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
              label="邮箱"
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="请输入邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 30, message: '密码长度应在6-30个字符之间' }
              ]}
              label="密码"
              hasFeedback
            >
              <Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
              label="确认密码"
              hasFeedback
            >
              <Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请确认密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                注册
              </Button>
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  已有账号？ <a href="/login" style={{ color: '#1890ff' }}>立即登录</a>
                </span>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;