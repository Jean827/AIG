import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Checkbox, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import request from '../../utils/request';

const { Option } = Select;
const { TextArea } = Input;

const UserManagementPage = () => {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // 角色选项
  const roleOptions = [
    { value: 'all', label: '全部角色' },
    { value: 'ADMIN', label: '管理员' },
    { value: 'USER', label: '普通用户' },
    { value: 'GUEST', label: '访客' }
  ];

  // 加载用户列表
  useEffect(() => {
    if (hasPermission('USER_MANAGE')) {
      fetchUsers();
    }
  }, [hasPermission]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 实际环境中这里应该调用真实的API
      // const response = await request.get('/users');
      // setUsers(response.data || []);
      
      // 模拟API调用，使用mock数据
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 从本地存储获取mock用户数据（如果有）
      const mockUsersData = localStorage.getItem('mockUsers');
      if (mockUsersData) {
        setUsers(JSON.parse(mockUsersData));
      } else {
        // 初始mock数据
        const initialUsers = [
          {
            id: 1,
            username: 'admin',
            name: '超级管理员',
            email: 'admin@example.com',
            status: 'active',
            roles: [{ id: 1, name: 'ADMIN' }],
            tenantId: null,
            tenantName: '全局',
            createdAt: '2023-01-15T08:30:00Z'
          },
          {
            id: 2,
            username: 'user1',
            name: '用户1',
            email: 'user1@example.com',
            status: 'active',
            roles: [{ id: 2, name: 'USER' }],
            tenantId: 1,
            tenantName: '租户A',
            createdAt: '2023-01-20T14:15:00Z'
          },
          {
            id: 3,
            username: 'user2',
            name: '用户2',
            email: 'user2@example.com',
            status: 'active',
            roles: [{ id: 2, name: 'USER' }],
            tenantId: 2,
            tenantName: '租户B',
            createdAt: '2023-02-05T09:20:00Z'
          },
          {
            id: 4,
            username: 'test',
            name: '测试用户',
            email: 'test@example.com',
            status: 'inactive',
            roles: [{ id: 3, name: 'GUEST' }],
            tenantId: 1,
            tenantName: '租户A',
            createdAt: '2023-02-10T16:40:00Z'
          }
        ];
        setUsers(initialUsers);
        // 保存到本地存储
        localStorage.setItem('mockUsers', JSON.stringify(initialUsers));
      }
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('Failed to fetch users:', error);
    }
    setLoading(false);
  };

  // 保存用户到本地存储
  const saveUsersToStorage = (updatedUsers) => {
    localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
  };

  // 显示添加/编辑模态框
  const showModal = (userData = null) => {
    setEditingUser(userData);
    if (userData) {
      // 对于编辑模式，设置表单字段值
      form.setFieldsValue({
        ...userData,
        role: userData.roles && userData.roles.length > 0 ? userData.roles[0].name : 'USER'
      });
    } else {
      // 对于添加模式，重置表单
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let updatedUsers;
      
      if (editingUser) {
        // 更新用户
        updatedUsers = users.map(u => 
          u.id === editingUser.id 
            ? { 
                ...u, 
                ...values, 
                roles: [{ id: getRoleId(values.role), name: values.role }] 
              } 
            : u
        );
        message.success('用户更新成功');
      } else {
        // 创建新用户
        const newUser = {
          id: Date.now(), // 临时ID
          ...values,
          status: 'active',
          roles: [{ id: getRoleId(values.role), name: values.role }],
          tenantId: user && user.currentTenantId ? user.currentTenantId : null,
          tenantName: user && user.currentTenantName ? user.currentTenantName : '全局',
          createdAt: new Date().toISOString()
        };
        updatedUsers = [...users, newUser];
        message.success('用户创建成功');
      }
      
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      setVisible(false);
      setEditingUser(null);
    } catch (error) {
      message.error('操作失败，请重试');
      console.error('Failed to submit form:', error);
    }
  };

  // 获取角色ID
  const getRoleId = (roleName) => {
    switch (roleName) {
      case 'ADMIN': return 1;
      case 'USER': return 2;
      case 'GUEST': return 3;
      default: return 2;
    }
  };

  // 禁用/启用用户
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' } 
          : user
      );
      
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      message.success(`用户已${currentStatus === 'active' ? '禁用' : '启用'}`);
    } catch (error) {
      message.error(`操作失败，请重试`);
      console.error('Failed to toggle user status:', error);
    }
  };

  // 删除用户
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const updatedUsers = users.filter(user => user.id !== userId);
          setUsers(updatedUsers);
          saveUsersToStorage(updatedUsers);
          message.success('用户删除成功');
        } catch (error) {
          message.error('删除用户失败');
          console.error('Failed to delete user:', error);
        }
      },
    });
  };

  // 搜索和筛选用户
  const filterUsers = () => {
    let filteredUsers = [...users];
    
    // 根据搜索文本筛选
    if (searchText) {
      filteredUsers = filteredUsers.filter(user => 
        user.username.includes(searchText) || 
        user.name.includes(searchText) || 
        user.email.includes(searchText)
      );
    }
    
    // 根据角色筛选
    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.roles && user.roles.some(role => role.name === roleFilter)
      );
    }
    
    return filteredUsers;
  };

  // 表格列配置
  const columns = [
    { title: '用户ID', dataIndex: 'id', key: 'id' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { 
      title: '角色', 
      dataIndex: 'roles', 
      key: 'roles',
      render: (roles) => {
        if (!roles || roles.length === 0) return '-';
        return roles.map(role => (
          <Tag key={role.id} color={getRoleColor(role.name)}>
            {role.name === 'ADMIN' ? '管理员' : role.name === 'USER' ? '普通用户' : '访客'}
          </Tag>
        ));
      }
    },
    { title: '租户', dataIndex: 'tenantName', key: 'tenantName' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    { 
      title: '创建时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('zh-CN');
      }
    },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showModal(record)}
            disabled={record.id === user?.id} // 禁止编辑自己
          >
            编辑
          </Button>
          <Button 
            type={record.status === 'active' ? 'default' : 'primary'}
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            size="small" 
            onClick={() => toggleUserStatus(record.id, record.status)}
            disabled={record.id === user?.id} // 禁止禁用自己
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => handleDelete(record.id)}
            disabled={record.id === user?.id} // 禁止删除自己
          >
            删除
          </Button>
        </Space>
      )
    },
  ];

  // 获取角色对应的颜色
  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'ADMIN': return 'red';
      case 'USER': return 'blue';
      case 'GUEST': return 'gray';
      default: return 'default';
    }
  };

  // 检查是否有用户管理权限
  if (!hasPermission('USER_MANAGE')) {
    return (
      <div style={{ 
        padding: '24px', 
        textAlign: 'center',
        color: 'red',
        fontSize: '16px'
      }}>
        您没有权限访问此页面
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2>用户管理</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="搜索用户名、姓名或邮箱"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={filterUsers}>搜索</Button>
          <Select
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            style={{ width: 120, marginLeft: 8 }}
          >
            {roleOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()} 
            style={{ marginLeft: 8 }}
          >
            添加用户
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filterUsers()}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* 添加/编辑用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="ADMIN">管理员</Option>
              <Option value="USER">普通用户</Option>
              <Option value="GUEST">访客</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;