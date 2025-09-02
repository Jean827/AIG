import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, TreeSelect, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../../services/menuService';
import '../styles.css';

const { Option } = Select;
const { TreeNode } = TreeSelect;

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [menuTree, setMenuTree] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [form] = Form.useForm();

  // 获取菜单数据
  useEffect(() => {
    fetchMenus();
  }, []);

  // 构建菜单树结构
  useEffect(() => {
    const buildMenuTree = (menuList) => {
      const tree = menuList.map(menu => ({
        title: menu.name,
        value: menu.id,
        key: menu.id,
        children: menu.children ? buildMenuTree(menu.children) : []
      }));
      return tree;
    };
    
    setMenuTree(buildMenuTree(menus));
  }, [menus]);

  // 获取菜单列表
  const fetchMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      console.error('获取菜单列表失败:', error);
      message.error('获取菜单列表失败');
    }
  };

  // 打开添加/编辑菜单模态框
  const showModal = (menu = null) => {
    setEditingMenu(menu);
    if (menu) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        name: menu.name,
        icon: menu.icon,
        type: menu.type,
        path: menu.path,
        component: menu.component,
        parent_id: menu.parent_id,
        order: menu.order,
        status: menu.status
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
    setEditingMenu(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingMenu) {
        // 更新菜单
        await updateMenu(editingMenu.id, values);
        message.success('菜单更新成功');
      } else {
        // 添加菜单
        await createMenu(values);
        message.success('菜单添加成功');
      }
      
      // 重新获取菜单列表
      fetchMenus();
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 删除菜单
  const handleDelete = async (menuId) => {
    try {
      await deleteMenu(menuId);
      message.success('菜单删除成功');
      // 重新获取菜单列表
      fetchMenus();
    } catch (error) {
      console.error('删除菜单失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 递归获取所有菜单数据
  const getAllMenuItems = (menuList) => {
    let allMenus = [];
    menuList.forEach(menu => {
      allMenus.push(menu);
      if (menu.children) {
        allMenus = allMenus.concat(getAllMenuItems(menu.children));
      }
    });
    return allMenus;
  };

  // 表格列定义
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        switch (type) {
          case 'catalog':
            return '目录';
          case 'menu':
            return '菜单';
          case 'button':
            return '按钮';
          default:
            return type;
        }
      }
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order'
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个菜单吗？"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  // 菜单图标选项
  const iconOptions = [
    'SettingOutlined', 'MenuOutlined', 'UserOutlined', 'UserSwitchOutlined',
    'TeamOutlined', 'DatabaseOutlined', 'FileTextOutlined', 'CustomerServiceOutlined',
    'EnvironmentOutlined', 'BidOutlined', 'FormOutlined', 'HistoryOutlined',
    'FileDoneOutlined', 'FileAddOutlined', 'PlayCircleOutlined', 'AccountBookOutlined',
    'SearchOutlined', 'PayCircleOutlined', 'FileSearchOutlined', 'CreditCardOutlined',
    'LineChartOutlined'
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">菜单管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加菜单
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={getAllMenuItems(menus)}
        rowKey="id"
        className="data-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editingMenu ? '编辑菜单' : '添加菜单'}
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
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            label="菜单图标"
            name="icon"
          >
            <Select placeholder="请选择菜单图标">
              {iconOptions.map(icon => (
                <Option key={icon} value={icon}>{icon}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="菜单类型"
            name="type"
            rules={[{ required: true, message: '请选择菜单类型' }]}
          >
            <Select placeholder="请选择菜单类型">
              <Option value="catalog">目录</Option>
              <Option value="menu">菜单</Option>
              <Option value="button">按钮</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="菜单路径"
            name="path"
          >
            <Input placeholder="请输入菜单路径" />
          </Form.Item>

          <Form.Item
            label="组件路径"
            name="component"
          >
            <Input placeholder="请输入组件路径" />
          </Form.Item>

          <Form.Item
            label="父菜单"
            name="parent_id"
          >
            <TreeSelect
              placeholder="请选择父菜单"
              allowClear
              treeDefaultExpandAll
            >
              {menuTree.map(node => (
                <TreeNode
                  key={node.key}
                  value={node.value}
                  title={node.title}
                >
                  {node.children && node.children.map(child => (
                    <TreeNode
                      key={child.key}
                      value={child.value}
                      title={child.title}
                    />
                  ))}
                </TreeNode>
              ))}
            </TreeSelect>
          </Form.Item>

          <Form.Item
            label="排序号"
            name="order"
            rules={[
              { required: true, message: '请输入排序号' },
              { type: 'number', message: '请输入数字' }
            ]}
            initialValue={10}
          >
            <Input type="number" placeholder="请输入排序号" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue={1}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement;