import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, TreeSelect, Popconfirm, message, Space, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../../services/systemService';
import '../styles.css';

const { TreeNode } = TreeSelect;

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [form] = Form.useForm();
  const [orgTree, setOrgTree] = useState([]);

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await getOrganizations();
        setOrganizations(orgData.map(org => ({
          ...org,
          create_time: org.create_time ? new Date(org.create_time).toLocaleString() : '',
          update_time: org.update_time ? new Date(org.update_time).toLocaleString() : ''
        })));
        // 构建组织机构树
        buildOrgTree(orgData);
      } catch (error) {
        console.error('获取组织机构数据失败:', error);
        message.error('获取数据失败，请重试');
      }
    };

    fetchData();
  }, []);

  // 构建组织机构树
  const buildOrgTree = (orgData) => {
    const treeData = [];
    
    // 找到根节点（parent_id为0的节点）
    const roots = orgData.filter(item => item.parent_id === '0');
    
    // 递归构建树
    const buildTree = (parentId) => {
      const children = orgData.filter(item => item.parent_id === parentId);
      if (children.length === 0) return null;
      
      return children.map(child => {
        const subChildren = buildTree(child.id);
        return subChildren ? 
          { id: child.id, title: child.name, children: subChildren } :
          { id: child.id, title: child.name };
      });
    };
    
    roots.forEach(root => {
      const children = buildTree(root.id);
      treeData.push(children ? 
        { id: root.id, title: root.name, children } :
        { id: root.id, title: root.name }
      );
    });
    
    setOrgTree(treeData);
  };

  // 渲染树节点
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

  // 打开添加/编辑组织机构模态框
  const showModal = (org = null) => {
    setEditingOrg(org);
    if (org) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        name: org.name,
        parent_id: org.parent_id,
        description: org.description,
        address: org.address,
        contact_person: org.contact_person,
        contact_phone: org.contact_phone,
        sort_order: org.sort_order,
        status: org.status
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
    setEditingOrg(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingOrg) {
        // 更新组织机构
        const updatedOrg = await updateOrganization(editingOrg.id, values);
        
        // 更新本地状态
        const updatedOrgs = organizations.map(org => 
          org.id === updatedOrg.id 
            ? {
                ...updatedOrg,
                create_time: org.create_time, // 保持创建时间不变
                update_time: new Date().toLocaleString()
              } 
            : org
        );
        setOrganizations(updatedOrgs);
        buildOrgTree(updatedOrgs);
        message.success('组织机构更新成功');
      } else {
        // 添加组织机构
        const newOrg = await createOrganization(values);
        
        // 更新本地状态
        const updatedOrgs = [...organizations, {
          ...newOrg,
          create_time: new Date().toLocaleString(),
          update_time: new Date().toLocaleString()
        }];
        setOrganizations(updatedOrgs);
        buildOrgTree(updatedOrgs);
        message.success('组织机构添加成功');
      }
      
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error(error.message || '操作失败，请重试');
    }
  };

  // 删除组织机构
  const handleDelete = async (orgId) => {
    try {
      // 检查是否有子组织机构
      const hasChildren = organizations.some(org => org.parent_id === orgId);
      if (hasChildren) {
        message.error('该组织机构下有子组织机构，无法删除');
        return;
      }
      
      await deleteOrganization(orgId);
      
      const updatedOrgs = organizations.filter(org => org.id !== orgId);
      setOrganizations(updatedOrgs);
      buildOrgTree(updatedOrgs);
      message.success('组织机构删除成功');
    } catch (error) {
      console.error('删除组织机构失败:', error);
      message.error(error.message || '删除组织机构失败，请重试');
    }
  };

  // 查找父组织机构名称
  const getParentOrgName = (parentId) => {
    if (parentId === '0') return '无';
    const parent = organizations.find(org => org.id === parentId);
    return parent ? parent.name : '未知';
  };

  // 表格列定义
  const columns = [
    {
      title: '组织机构名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '上级组织机构',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parentId) => getParentOrgName(parentId)
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '联系人',
      dataIndex: 'contact_person',
      key: 'contact_person'
    },
    {
      title: '联系电话',
      dataIndex: 'contact_phone',
      key: 'contact_phone'
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      key: 'sort_order'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? '#52c41a' : '#d9d9d9' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
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
            description="确定要删除这个组织机构吗？删除后将无法恢复。"
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
        <h1 className="page-title">组织机构管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加组织机构
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={organizations}
        rowKey="id"
        className="data-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editingOrg ? '编辑组织机构' : '添加组织机构'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
        >
          <Form.Item
            label="组织机构名称"
            name="name"
            rules={[{ required: true, message: '请输入组织机构名称' }]}
          >
            <Input placeholder="请输入组织机构名称" />
          </Form.Item>

          <Form.Item
            label="上级组织机构"
            name="parent_id"
            initialValue="0"
          >
            <TreeSelect
              placeholder="请选择上级组织机构"
              style={{ width: '100%' }}
            >
              <TreeNode key="0" title="无" />
              {renderTreeNode(orgTree)}
            </TreeSelect>
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="请输入组织机构描述" />
          </Form.Item>

          <Form.Item
            label="联系地址"
            name="address"
          >
            <Input placeholder="请输入联系地址" />
          </Form.Item>

          <Form.Item
            label="联系人"
            name="contact_person"
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="contact_phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            label="排序"
            name="sort_order"
            initialValue={0}
            rules={[
              { type: 'number', message: '请输入数字' },
              { min: 0, message: '排序值不能小于0' }
            ]}
          >
            <Input type="number" placeholder="请输入排序值" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue={1}
          >
            <select className="ant-input" style={{ width: '100%' }}>
              <option value="1">启用</option>
              <option value="0">禁用</option>
            </select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationManagement;