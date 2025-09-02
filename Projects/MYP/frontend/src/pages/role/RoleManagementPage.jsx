import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import request from '../../utils/request';

const { Option } = Select;
const { TextArea } = Input;

const RoleManagementPage = () => {
  const { user, hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // 所有可用权限列表
  const allPermissions = [
    { id: 'TENANT_MANAGE', name: '租户管理' },
    { id: 'USER_MANAGE', name: '用户管理' },
    { id: 'PRODUCT_MANAGE', name: '产品管理' },
    { id: 'ORDER_MANAGE', name: '订单管理' },
    { id: 'PRODUCT_VIEW', name: '产品查看' },
    { id: 'ORDER_CREATE', name: '创建订单' },
    { id: 'REPORT_VIEW', name: '报表查看' },
    { id: 'ROLE_MANAGE', name: '角色管理' },
  ];

  // 加载角色列表
  useEffect(() => {
    if (hasPermission('ROLE_MANAGE')) {
      fetchRoles();
    }
  }, [hasPermission]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      // 实际环境中这里应该调用真实的API
      // const response = await request.get('/roles');
      // setRoles(response.data || []);
      
      // 模拟API调用，使用mock数据
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 从本地存储获取mock角色数据（如果有）
      const mockRolesData = localStorage.getItem('mockRoles');
      if (mockRolesData) {
        setRoles(JSON.parse(mockRolesData));
      } else {
        // 初始mock数据
        const initialRoles = [
          { id: 1, name: 'ADMIN', displayName: '管理员', description: '系统管理员，拥有所有权限', permissions: ['TENANT_MANAGE', 'USER_MANAGE', 'PRODUCT_MANAGE', 'ORDER_MANAGE', 'ROLE_MANAGE'] },
          { id: 2, name: 'USER', displayName: '普通用户', description: '普通系统用户', permissions: ['PRODUCT_VIEW', 'ORDER_CREATE'] },
          { id: 3, name: 'GUEST', displayName: '访客', description: '只读访问权限', permissions: ['PRODUCT_VIEW'] },
        ];
        setRoles(initialRoles);
        // 保存到本地存储
        localStorage.setItem('mockRoles', JSON.stringify(initialRoles));
      }
    } catch (error) {
      message.error('获取角色列表失败');
      console.error('Failed to fetch roles:', error);
    }
    setLoading(false);
  };

  // 保存角色到本地存储
  const saveRolesToStorage = (updatedRoles) => {
    localStorage.setItem('mockRoles', JSON.stringify(updatedRoles));
  };

  // 显示添加/编辑模态框
  const showModal = (roleData = null) => {
    setEditingRole(roleData);
    if (roleData) {
      // 对于编辑模式，设置表单字段值
      form.setFieldsValue({
        ...roleData,
        permissions: roleData.permissions || []
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
    setEditingRole(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let updatedRoles;
      
      if (editingRole) {
        // 更新角色
        updatedRoles = roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values } 
            : role
        );
        message.success('角色更新成功');
      } else {
        // 创建新角色
        const newRole = {
          id: Date.now(), // 临时ID
          ...values,
          createdAt: new Date().toISOString()
        };
        updatedRoles = [...roles, newRole];
        message.success('角色创建成功');
      }
      
      setRoles(updatedRoles);
      saveRolesToStorage(updatedRoles);
      setVisible(false);
      setEditingRole(null);
    } catch (error) {
      message.error('操作失败，请重试');
      console.error('Failed to submit form:', error);
    }
  };

  // 删除角色
  const handleDelete = async (roleId) => {
    try {
      // 防止删除系统内置角色
      if (roleId <= 3) {
        message.error('无法删除系统内置角色');
        return;
      }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedRoles = roles.filter(role => role.id !== roleId);
      setRoles(updatedRoles);
      saveRolesToStorage(updatedRoles);
      message.success('角色已删除');
    } catch (error) {
      message.error('删除失败，请重试');
      console.error('Failed to delete role:', error);
    }
  };

  // 搜索和筛选角色
  const filterRoles = () => {
    let filteredRoles = [...roles];
    
    // 根据搜索文本筛选
    if (searchText) {
      filteredRoles = filteredRoles.filter(role => 
        role.name.includes(searchText) || 
        role.displayName.includes(searchText) || 
        role.description.includes(searchText)
      );
    }
    
    return filteredRoles;
  };

  // 表格列配置
  const columns = [
    { title: '角色ID', dataIndex: 'id', key: 'id' },
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '显示名称', dataIndex: 'displayName', key: 'displayName' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { 
      title: '权限', 
      dataIndex: 'permissions', 
      key: 'permissions',
      render: (permissions) => {
        if (!permissions || permissions.length === 0) return '-';
        return permissions.map(permission => {
          const permissionObj = allPermissions.find(p => p.id === permission);
          return (
            <Tag key={permission} color="blue" style={{ margin: '2px' }}>
              {permissionObj ? permissionObj.name : permission}
            </Tag>
          );
        });
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
            disabled={record.id <= 3} // 禁止编辑系统内置角色
          >
            编辑
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => handleDelete(record.id)}
            disabled={record.id <= 3} // 禁止删除系统内置角色
          >
            删除
          </Button>
        </Space>
      )
    },
  ];

  // 检查是否有角色管理权限
  if (!hasPermission('ROLE_MANAGE')) {
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
        <h2>角色管理</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="搜索角色名称、显示名称或描述"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={filterRoles}>搜索</Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()} 
            style={{ marginLeft: 8 }}
          >
            添加角色
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filterRoles()}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* 添加/编辑角色模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称(英文大写)" disabled={!!editingRole && editingRole.id <= 3} />
          </Form.Item>

          <Form.Item
            name="displayName"
            label="显示名称"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input placeholder="请输入显示名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请选择至少一个权限' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择权限"
              style={{ width: '100%' }}
            >
              {allPermissions.map(permission => (
                <Option key={permission.id} value={permission.id}>{permission.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagementPage;