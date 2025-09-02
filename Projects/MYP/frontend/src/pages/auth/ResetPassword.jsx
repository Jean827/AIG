import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

const { Title } = Typography;
const { Password } = Input;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [validToken, setValidToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 从URL查询参数中获取token
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      // 如果URL中没有token，显示错误信息
      setValidToken(false);
      message.error('无效的重置链接');
    }
  }, [searchParams]);

  const onFinish = async (values) => {
    if (!token) {
      message.error('无效的重置链接');
      return;
    }

    setLoading(true);
    try {
      // 调用重置密码API
      const response = await resetPassword({
        token: token,
        newPassword: values.newPassword
      });
      
      message.success(response.message || '密码重置成功');
      // 重置成功后跳转到登录页面
      navigate('/login');
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error(error.response?.data?.message || '重置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (!validToken) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={16} md={12} lg={8} xl={6}>
          <Card 
            title={<Title level={3} style={{ textAlign: 'center' }}>重置密码</Title>}
            variant="outlined"
          >
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Typography.Text type="danger" style={{ fontSize: '16px' }}>
                无效的重置链接或链接已过期
              </Typography.Text>
              <Button
                type="primary"
                onClick={handleBack}
                style={{ marginTop: '20px' }}
              >
                返回登录
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card 
          title={
            <Row align="middle">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                style={{ marginRight: '10px' }}
              />
              <Title level={3} style={{ margin: 0, textAlign: 'center', flex: 1 }}>
                重置密码
              </Title>
            </Row>
          }
          variant="outlined"
        >
          <Form
            form={form}
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
          >
            <div style={{ marginBottom: '20px' }}>
              <Typography.Text>
                请输入新密码以重置您的账户密码。
              </Typography.Text>
            </div>
            
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, max: 30, message: '密码长度应在6-30个字符之间' },
                { 
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 
                  message: '密码必须包含至少一个字母和一个数字'
                }
              ]}
              label="新密码"
              hasFeedback
            >
              <Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请输入新密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
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
                placeholder="请再次输入新密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                确认重置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;