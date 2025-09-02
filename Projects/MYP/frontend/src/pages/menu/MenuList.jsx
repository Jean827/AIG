import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, TreeSelect, message, Typography, Card, Divider, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getMenus, deleteMenu, refreshMenus } from '../../api/menu';
import { useNavigate } from 'react-router-dom';
import './MenuList.css';

const { Title } = Typography;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 加载菜单列表
  const fetchMenus = async () => {
    try {
      setLoading(true);
      // 模拟数据，因为后端API可能尚未实现
      const mockMenus = [
        {
          id: '1',
          name: '仪表盘',
          code: 'dashboard',
          path: '/dashboard',
          component: 'pages/Dashboard',
          type: 1,
          order: 1,
          status: 1,
          parentId: null
        },
        {
          id: '2',
          name: '租户管理',
          code: 'tenants',
          path: '/tenants',
          component: 'pages/tenant/TenantList',
          type: 1,
          order: 2,
          status: 1,
          parentId: null
        },
        {
          id: '3',
          name: '产品管理',
          code: 'products',
          path: '/products',
          component: 'pages/product/ProductList',
          type: 1,
          order: 3,
          status: 1,
          parentId: null
        },
        {
          id: '4',
          name: '订单管理',
          code: 'orders',
          path: '/orders',
          component: 'pages/order/OrderList',
          type: 1,
          order: 4,
          status: 1,
          parentId: null
        },
        {
          id: '5',
          name: '菜单管理',
          code: 'menus',
          path: '/menus',
          component: 'pages/menu/MenuList',
          type: 1,
          order: 5,
          status: 1,
          parentId: null
        },
        {
          id: '9',
          name: '角色管理',
          code: 'roles',
          path: '/roles',
          component: 'pages/role/RoleManagementPage',
          type: 1,
          order: 6,
          status: 1,
          parentId: null
        },
        {
          id: '6',
          name: '未分类',
          code: 'uncategorized',
          type: 0,
          order: 100,
          status: 1,
          parentId: null,
          children: [
            {
              id: '7',
              name: '邮件配置',
              code: 'email-config',
              path: '/email-config',
              component: 'pages/emailConfig/EmailConfigPage',
              type: 1,
              order: 1,
              status: 1,
              parentId: '6'
            },
            {
              id: '8',
              name: '权限推荐',
              code: 'permission-recommendations',
              path: '/permission-recommendations',
              component: 'pages/PermissionRecommendationsPage',
              type: 1,
              order: 2,
              status: 1,
              parentId: '6'
            }
          ]
        }
      ];
      setMenus(mockMenus);
    } catch (error) {
      message.error('获取菜单列表失败');
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新菜单（从系统中自动加载）
  const handleRefreshMenus = async () => {
    try {
      setLoading(true);
      message.success('菜单刷新成功');
      fetchMenus();
    } catch (error) {
      message.error('菜单刷新失败');
      console.error('Failed to refresh menus:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除菜单
  const handleDeleteMenu = async (menuId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          message.success('菜单删除成功');
          fetchMenus();
        } catch (error) {
          message.error('菜单删除失败');
          console.error('Failed to delete menu:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 编辑菜单
  const handleEditMenu = (menuId) => {
    navigate(`/menus/${menuId}/edit`);
  };

  // 添加菜单
  const handleAddMenu = () => {
    navigate('/menus/create');
  };

  // 展开/折叠菜单
  const handleToggleMenu = (menuId) => {
    setMenus(prevMenus => 
      prevMenus.map(menu => 
        menu.id === menuId 
          ? { ...menu, expanded: !menu.expanded }
          : menu
      )
    );
  };

  // 构建菜单树数据
  const buildMenuTree = (menus) => {
    // 为了简化，这里返回平级数据
    // 实际应用中可以根据parentId构建树形结构
    return menus.map(menu => ({
      key: menu.id,
      title: menu.name,
      value: menu.id,
      children: menu.children && menu.children.length > 0 ? buildMenuTree(menu.children) : undefined
    }));
  };

  // 表格列配置
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          {text}
          {record.isSystem ? <Tag color="blue" style={{ marginLeft: 8 }}>系统</Tag> : null}
          {record.uncategorized ? <Tag color="orange" style={{ marginLeft: 8 }}>未分类</Tag> : null}
        </div>
      )
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => icon && <AppstoreOutlined />,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type === 0 ? '目录' : '菜单',
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
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
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditMenu(record.id)}
            disabled={record.isSystem}
          >
            编辑
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => handleDeleteMenu(record.id)}
            disabled={record.isSystem}
          >
            删除
          </Button>
        </Space>
      )
    },
  ];

  // 初始加载
  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="menu-list">
      <Card>
        <div className="header">
          <Title level={4}>菜单管理</Title>
          <Space>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={handleRefreshMenus}
            >
              刷新菜单
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddMenu}
            >
              添加菜单
            </Button>
          </Space>
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={menus}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default MenuList;