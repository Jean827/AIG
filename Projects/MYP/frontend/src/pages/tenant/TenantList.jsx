import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTenants, createTenant, updateTenant, deleteTenant } from '../../api/tenant';

const { Option } = Select;

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // 状态选项
  const statusOptions = [
    { value: 0, label: '禁用' },
    { value: 1, label: '启用' },
  ];

  // 加载租户列表
  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await getTenants();
      setTenants(response.data || []);
    } catch (error) {
      message.error('获取租户列表失败');
      console.error('Failed to fetch tenants:', error);
    }
    setLoading(false);
  };

  // 显示添加/编辑模态框
  const showModal = (tenant = null) => {
    setEditingTenant(tenant);
    if (tenant) {
      form.setFieldsValue(tenant);
    } else {
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingTenant(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingTenant) {
        // 更新租户
        await updateTenant(editingTenant.id, values);
        message.success('租户更新成功');
      } else {
        // 创建租户
        await createTenant(values);
        message.success('租户创建成功');
      }

      setVisible(false);
      fetchTenants(); // 重新加载租户列表
    } catch (error) {
      message.error('操作失败，请重试');
      console.error('Failed to submit form:', error);
    }
  };

  // 删除租户
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个租户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteTenant(id);
          message.success('租户删除成功');
          fetchTenants(); // 重新加载租户列表
        } catch (error) {
          message.error('租户删除失败');
          console.error('Failed to delete tenant:', error);
        }
      },
    });
  };

  // 搜索租户
  const handleSearch = () => {
    if (searchText) {
      const filteredTenants = tenants.filter(tenant => 
        tenant.name.includes(searchText) || 
        tenant.code.includes(searchText) || 
        tenant.contactPerson.includes(searchText)
      );
      setTenants(filteredTenants);
    } else {
      fetchTenants();
    }
  };

  // 表格列配置
  const columns = [
    { title: '租户名称', dataIndex: 'name', key: 'name' },
    { title: '租户编码', dataIndex: 'code', key: 'code' },
    { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson' },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? 'green' : 'red' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      )
    },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <div>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            style={{ marginRight: 8 }} 
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="tenant-list-container">
      <div className="header">
        <h2>租户管理</h2>
        <div className="search-bar">
          <Input
            placeholder="搜索租户..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={(e) => {
            // 按住Shift键点击保留原有的模态框添加功能
            if (e.shiftKey) {
              showModal();
            } else {
              // 正常点击跳转到专门的租户创建页面
              navigate('/tenants/create');
            }
          }}
          title="点击进入创建页面，按住Shift键点击使用模态框创建"
        >
          添加租户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tenants}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTenant ? '编辑租户' : '添加租户'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="租户名称"
            rules={[{ required: true, message: '请输入租户名称' }]}
          >
            <Input placeholder="请输入租户名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="租户编码"
            rules={[{ required: true, message: '请输入租户编码' }]}
          >
            <Input placeholder="请输入租户编码" />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
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
        </Form>
      </Modal>
    </div>
  );
};

export default TenantList;