import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Card } from 'antd';
import { createTenant } from '../../api/tenant';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const TenantCreate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 状态选项
  const statusOptions = [
    { value: 0, label: '禁用' },
    { value: 1, label: '启用' },
  ];

  // 提交表单
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createTenant(values);
      message.success('租户创建成功');
      // 重定向到租户列表页面
      navigate('/tenants');
    } catch (error) {
      message.error('租户创建失败');
      console.error('Failed to create tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消操作，返回租户列表
  const handleCancel = () => {
    navigate('/tenants');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card title="创建租户" variant="outlined">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 1 }} // 默认启用状态
        >
          <Form.Item
            name="name"
            label="租户名称"
            rules={[
              { required: true, message: '请输入租户名称' },
              { max: 50, message: '租户名称最多50个字符' }
            ]}
          >
            <Input placeholder="请输入租户名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="租户编码"
            rules={[
              { required: true, message: '请输入租户编码' },
              { max: 20, message: '租户编码最多20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '租户编码只能包含字母、数字和下划线' }
            ]}
          >
            <Input placeholder="请输入租户编码" />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[
              { required: true, message: '请输入联系人' },
              { max: 20, message: '联系人姓名最多20个字符' }
            ]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' }
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              创建租户
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TenantCreate;