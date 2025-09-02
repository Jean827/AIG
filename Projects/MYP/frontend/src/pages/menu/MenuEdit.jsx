import React, { useState, useEffect } from 'react';
import { Form, Input, Select, TreeSelect, InputNumber, Button, message, Typography, Card, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
// 使用模拟数据，暂时不导入API
import './MenuEdit.css';

const { Title } = Typography;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const MenuEdit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [menuTree, setMenuTree] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // 加载菜单树（使用模拟数据）
  const fetchMenuTree = async () => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟菜单树数据
      const mockMenuTree = [
        {
          key: '1',
          title: '仪表盘',
          value: '1'
        },
        {
          key: '2',
          title: '租户管理',
          value: '2'
        },
        {
          key: '3',
          title: '产品管理',
          value: '3'
        },
        {
          key: '4',
          title: '订单管理',
          value: '4'
        },
        {
          key: '6',
          title: '未分类',
          value: '6',
          children: [
            {
              key: '7',
              title: '邮件配置',
              value: '7'
            },
            {
              key: '8',
              title: '权限推荐',
              value: '8'
            }
          ]
        }
      ];
      
      setMenuTree(mockMenuTree);
    } catch (error) {
      console.error('Failed to fetch menu tree:', error);
      message.error('获取菜单树失败');
    }
  };

  // 构建菜单树
  const buildMenuTree = (menus) => {
    // 递归构建菜单树结构
    return menus.map(menu => ({
      key: menu.id,
      title: menu.name,
      value: menu.id,
      children: menu.children && menu.children.length > 0 ? buildMenuTree(menu.children) : undefined
    }));
  };

  // 加载菜单详情（使用模拟数据）
  const fetchMenuDetail = async () => {
    try {
      setLoading(true);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟菜单详情数据
      const mockMenuData = {
        id: id,
        name: `菜单 ${id}`,
        code: `menu_${id}`,
        path: `/menu/${id}`,
        component: `pages/menu/Menu${id}`,
        parentId: id > 5 ? '6' : null,
        icon: 'appstore',
        type: id % 3,
        order: id,
        status: 1
      };
      
      setMenuId(mockMenuData.id);
      
      // 初始化表单数据
      form.setFieldsValue({
        ...mockMenuData,
        parentId: mockMenuData.parentId || undefined
      });
    } catch (error) {
      message.error('获取菜单详情失败');
      console.error('Failed to fetch menu detail:', error);
      navigate('/menus');
    } finally {
      setLoading(false);
    }
  };

  // 处理表单提交（使用模拟数据）
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟成功响应
      message.success('菜单更新成功');
      
      // 重定向回菜单列表页面
      navigate('/menus');
    } catch (error) {
      message.error('菜单更新失败');
      console.error('Failed to update menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchMenuDetail();
    fetchMenuTree();
  }, [id]);

  return (
    <div className="menu-edit">
      <Card>
        <Title level={4}>编辑菜单</Title>
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          loading={loading}
        >
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="菜单编码"
            rules={[{ required: true, message: '请输入菜单编码' }]}
          >
            <Input placeholder="请输入菜单编码" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: true, message: '请输入菜单路径' }]}
          >
            <Input placeholder="请输入菜单路径" />
          </Form.Item>

          <Form.Item
            name="component"
            label="组件路径"
            rules={[{ required: true, message: '请输入组件路径' }]}
          >
            <Input placeholder="请输入组件路径" />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <TreeSelect
              placeholder="请选择上级菜单"
              treeDefaultExpandAll
              allowClear
              onChange={(value) => {
                // 不允许选择自己作为父级
                if (value === menuId) {
                  message.error('不能选择自己作为上级菜单');
                  form.setFieldValue('parentId', undefined);
                }
              }}
            >
              {menuTree.map(node => (
                <TreeNode key={node.key} title={node.title} value={node.value}>
                  {node.children && node.children.map(child => (
                    <TreeNode 
                      key={child.key} 
                      title={child.title} 
                      value={child.value} 
                      disabled={child.value === id}
                    />
                  ))}
                </TreeNode>
              ))}
            </TreeSelect>
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标"
          >
            <Input placeholder="请输入图标名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
          >
            <Select>
              <Option value={0}>目录</Option>
              <Option value={1}>菜单</Option>
              <Option value={2}>按钮</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="order"
            label="排序号"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
          >
            <Select>
              <Option value={0}>禁用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新菜单
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => navigate('/menus')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MenuEdit;