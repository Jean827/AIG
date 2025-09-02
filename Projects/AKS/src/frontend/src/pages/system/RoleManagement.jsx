import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, TreeSelect, Popconfirm, message, Space, Divider, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { getRoles, createRole, updateRole, deleteRole, updateRoleStatus, getPermissions } from '../../services/systemService';
import '../styles.css';

const { TreeNode } = TreeSelect;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();
  const [permissionTree, setPermissionTree] = useState([]);

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取角色数据
        const rolesData = await getRoles();
        setRoles(rolesData.map(role => ({
          ...role,
          create_time: role.create_time ? new Date(role.create_time).toLocaleString() : '',
          update_time: role.update_time ? new Date(role.update_time).toLocaleString() : ''
        })));

        // 获取权限树数据
        try {
          const permissionsData = await getPermissions();
          setPermissionTree(permissionsData);
        } catch (error) {
          // 如果没有getPermissions API，使用默认的权限树结构
          console.warn('获取权限树失败，使用默认结构:', error);
          setPermissionTree([
            {
              id: '1',
              title: '系统管理',
              children: [
                { id: '1-1', title: '用户管理' },
                { id: '1-2', title: '角色管理' },
                { id: '1-3', title: '菜单管理' },
                { id: '1-4', title: '数据字典' }
              ]
            },
            {
              id: '2',
              title: '基础信息',
              children: [
                { id: '2-1', title: '农场信息' },
                { id: '2-2', title: '地块信息' },
                { id: '2-3', title: '作物信息' }
              ]
            },
            {
              id: '3',
              title: '土地竞拍',
              children: [
                { id: '3-1', title: '竞拍列表' },
                { id: '3-2', title: '竞拍参与' },
                { id: '3-3', title: '竞拍结果' }
              ]
            },
            {
              id: '4',
              title: '合同管理',
              children: [
                { id: '4-1', title: '合同列表' },
                { id: '4-2', title: '合同创建' },
                { id: '4-3', title: '合同审核' }
              ]
            },
            {
              id: '5',
              title: '缴费管理',
              children: [
                { id: '5-1', title: '缴费列表' },
                { id: '5-2', title: '缴费确认' },
                { id: '5-3', title: '票据管理' }
              ]
            },
            {
              id: '6',
              title: '财务管理',
              children: [
                { id: '6-1', title: '财务报表' },
                { id: '6-2', title: '收支明细' },
                { id: '6-3', title: '预算管理' }
              ]
            }
          ]);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败，请重试');
      }
    };

    fetchData();
  }, []);

  // 渲染权限树节点
  const renderTreeNode = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.title}>
            {renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.title} />;
    });
  };

  // 打开添加/编辑角色模态框
  const showModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        status: role.status
      });
    } else {
      // 添加模式，重置表单
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingRole(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRole) {
        // 更新角色
        const updatedRole = await updateRole(editingRole.id, values);
        
        // 更新本地状态
        setRoles(roles.map(role => 
          role.id === updatedRole.id 
            ? {
                ...updatedRole,
                create_time: role.create_time, // 保持创建时间不变
                update_time: new Date().toLocaleString()
              } 
            : role
        ));
        message.success('角色更新成功');
      } else {
        // 添加角色
        const newRole = await createRole(values);
        
        // 更新本地状态
        setRoles([...roles, {
          ...newRole,
          create_time: new Date().toLocaleString(),
          update_time: new Date().toLocaleString()
        }]);
        message.success('角色添加成功');
      }
      
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error(error.message || '操作失败，请重试');
    }
  };

  // 删除角色
  const handleDelete = async (roleId) => {
    try {
      await deleteRole(roleId);
      setRoles(roles.filter(role => role.id !== roleId));
      message.success('角色删除成功');
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error(error.message || '删除角色失败，请重试');
    }
  };

  // 切换角色状态
  const handleStatusChange = async (checked, roleId) => {
    try {
      const status = checked ? 1 : 0;
      await updateRoleStatus(roleId, status);
      
      setRoles(roles.map(role => 
        role.id === roleId 
          ? { ...role, status, update_time: new Date().toLocaleString() } 
          : role
      ));
      message.success(`角色已${checked ? '启用' : '禁用'}`);
    } catch (error) {
      console.error('切换角色状态失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => permissions.length
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(checked, record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个角色吗？删除后将无法恢复。"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">角色管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加角色
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        className="data-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={700}
        style={{ maxHeight: '80vh', overflow: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="description"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item
            label="权限设置"
            name="permissions"
            rules={[{ required: true, message: '请选择至少一个权限' }]}
            initialValue={[]}
          >
            <TreeSelect
              mode="multiple"
              placeholder="请选择角色权限"
              style={{ width: '100%' }}
              maxTagCount="responsive"
            >
              {renderTreeNode(permissionTree)}
            </TreeSelect>
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue={1}
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;