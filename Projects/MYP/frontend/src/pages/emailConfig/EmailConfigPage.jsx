import React, { useState, useEffect } from 'react';
import './EmailConfigPage.css';
import { Card, Form, Input, InputNumber, Checkbox, Button, message, Switch, Space } from 'antd';
import { SaveOutlined, ReloadOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getEmailConfig, updateEmailConfig, testEmailConfig } from '../../api/emailConfig';

const EmailConfigPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 加载邮件配置
  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = async () => {
    setLoading(true);
    try {
      const response = await getEmailConfig();
      if (response.data) {
        form.setFieldsValue({
          host: response.data.host,
          port: response.data.port,
          username: response.data.username,
          password: response.data.password,
          useSsl: response.data.properties?.mail?.smtp?.ssl?.enable || false,
          defaultEncoding: response.data.defaultEncoding || 'UTF-8',
          auth: response.data.properties?.mail?.smtp?.auth || false,
          connectionTimeout: response.data.properties?.mail?.smtp?.connectiontimeout || 5000,
          timeout: response.data.properties?.mail?.smtp?.timeout || 3000,
          writeTimeout: response.data.properties?.mail?.smtp?.writetimeout || 5000,
          debug: response.data.properties?.mail?.debug || false
        });
      }
    } catch (error) {
      message.error('加载邮件配置失败');
      console.error('Failed to load email config:', error);
    }
    setLoading(false);
  };

  // 保存邮件配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);
      
      // 构建配置对象
      const configData = {
        host: values.host,
        port: values.port,
        username: values.username,
        password: values.password,
        defaultEncoding: values.defaultEncoding,
        properties: {
          mail: {
            smtp: {
              auth: values.auth,
              connectiontimeout: values.connectionTimeout,
              timeout: values.timeout,
              writetimeout: values.writeTimeout,
              ssl: {
                enable: values.useSsl
              }
            },
            debug: values.debug
          }
        }
      };

      await updateEmailConfig(configData);
      message.success('邮件配置保存成功');
    } catch (error) {
      message.error('保存失败，请检查输入');
      console.error('Failed to save email config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 测试邮件配置
  const handleTest = async () => {
    try {
      const values = await form.validateFields();
      setTestLoading(true);
      
      const testData = {
        host: values.host,
        port: values.port,
        username: values.username,
        password: values.password,
        useSsl: values.useSsl,
        recipient: 'test@example.com' // 可以让用户指定测试收件人
      };

      await testEmailConfig(testData);
      message.success('邮件测试发送成功');
    } catch (error) {
      message.error('测试邮件发送失败');
      console.error('Failed to test email config:', error);
    } finally {
      setTestLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="email-config-page">
      <div className="header">
        <h2>邮件服务器配置</h2>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <Card title="邮件服务器设置" className="email-config-card">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              useSsl: false,
              auth: true,
              defaultEncoding: 'UTF-8',
              connectionTimeout: 5000,
              timeout: 3000,
              writeTimeout: 5000,
              debug: false
            }}
          >
            <Form.Item
              name="host"
              label="SMTP服务器地址"
              rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
            >
              <Input placeholder="例如: smtp.muyacorp.com" />
            </Form.Item>

            <Form.Item
              name="port"
              label="端口"
              rules={[{ required: true, message: '请输入端口号' }]}
            >
              <InputNumber min={1} max={65535} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="useSsl"
              label="使用SSL"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={(checked) => {
                  // 当SSL状态改变时，可以自动调整端口号
                  if (checked && form.getFieldValue('port') === 25) {
                    form.setFieldsValue({ port: 465 });
                  } else if (!checked && form.getFieldValue('port') === 465) {
                    form.setFieldsValue({ port: 25 });
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="auth"
              label="需要认证"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>

            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="邮件服务器认证用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="邮件服务器认证密码" />
            </Form.Item>

            <Form.Item
              name="defaultEncoding"
              label="默认编码"
              rules={[{ required: true, message: '请输入默认编码' }]}
            >
              <Input placeholder="例如: UTF-8" />
            </Form.Item>

            <Form.Item label="高级设置">
              <div className="advanced-settings">
                <Form.Item
                  name="connectionTimeout"
                  label="连接超时(毫秒)"
                  className="advanced-item"
                >
                  <InputNumber min={1000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="timeout"
                  label="超时(毫秒)"
                  className="advanced-item"
                >
                  <InputNumber min={1000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="writeTimeout"
                  label="写入超时(毫秒)"
                  className="advanced-item"
                >
                  <InputNumber min={1000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="debug"
                  label="调试模式"
                  valuePropName="checked"
                  className="advanced-item"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={isSaving}
                >
                  保存配置
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button
                  type="dashed"
                  icon={<SendOutlined />}
                  onClick={handleTest}
                  loading={testLoading}
                >
                  测试配置
                </Button>
              </Space>
              <div style={{ marginTop: 16, color: '#666' }}>
                <Space>
                  <InfoCircleOutlined />
                  <span>提示：修改配置后请测试确保邮件服务器正常工作</span>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default EmailConfigPage;