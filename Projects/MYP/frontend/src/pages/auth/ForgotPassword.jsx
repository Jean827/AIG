import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

const { Title } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 调用忘记密码API
      const response = await forgotPassword({
        email: values.email
      });
      
      message.success(response.message || '密码重置邮件已发送，请查收邮箱');
      // 这里可以添加跳转到验证页面的逻辑，或者让用户手动进入邮箱点击链接
      navigate('/login');
    } catch (error) {
      console.error('发送重置密码邮件失败:', error);
      message.error(error.response?.data?.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

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
                忘记密码
              </Title>
            </Row>
          }
          variant="outlined"
        >
          <Form
            form={form}
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
          >
            <div style={{ marginBottom: '20px' }}>
              <Typography.Text>
                请输入您注册时使用的邮箱，我们将向您发送密码重置链接。
              </Typography.Text>
            </div>
            
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                发送重置链接
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;