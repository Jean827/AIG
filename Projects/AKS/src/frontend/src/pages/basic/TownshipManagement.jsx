import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, InputNumber, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles.css';
import { getTownships, createTownship, updateTownship, deleteTownship } from '../../services/basicService';

const TownshipManagement = () => {
  const [townships, setTownships] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingTownship, setEditingTownship] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTownships, setFilteredTownships] = useState([]);

  // 获取乡镇数据
  useEffect(() => {
    fetchTownships();
  }, []);

  // 根据搜索词过滤乡镇
  useEffect(() => {
    if (searchTerm) {
      const filtered = townships.filter(township => 
        township.name.includes(searchTerm) || 
        township.code.includes(searchTerm) ||
        township.description.includes(searchTerm)
      );
      setFilteredTownships(filtered);
    } else {
      setFilteredTownships(townships);
    }
  }, [townships, searchTerm]);

  // 获取乡镇列表
  const fetchTownships = async () => {
    try {
      const data = await getTownships();
      setTownships(data);
      
      // 设置父级选项（仅包含区级及以上的行政单位）
      const parentData = data.filter(item => item.parent_id === 0).map(item => ({
        value: item.id,
        label: item.name
      }));
      setParentOptions([{ value: 0, label: '无' }, ...parentData]);
    } catch (error) {
      console.error('获取乡镇列表失败:', error);
      message.error('获取乡镇列表失败，请重试');
    }
  };

  // 打开添加/编辑乡镇模态框
  const showModal = (township = null) => {
    setEditingTownship(township);
    if (township) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        name: township.name,
        code: township.code,
        region_type: township.region_type,
        parent_id: township.parent_id,
        order: township.order,
        status: township.status === 1,
        description: township.description
      });
    } else {
      // 添加模式，重置表单
      form.resetFields();
      form.setFieldsValue({
        parent_id: 0,
        order: 10,
        status: true
      });
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingTownship(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 转换状态值
      const submitData = {
        ...values,
        status: values.status ? 1 : 0
      };
      
      if (editingTownship) {
        // 更新乡镇
        await updateTownship(editingTownship.id, submitData);
        message.success('乡镇更新成功');
      } else {
        // 添加乡镇
        await createTownship(submitData);
        message.success('乡镇添加成功');
      }
      
      // 重新获取乡镇列表
      fetchTownships();
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error(error.message || '操作失败，请重试');
    }
  };

  // 删除乡镇
  const handleDelete = async (townshipId) => {
    try {
      await deleteTownship(townshipId);
      message.success('乡镇删除成功');
      // 重新获取乡镇列表
      fetchTownships();
    } catch (error) {
      console.error('删除乡镇失败:', error);
      message.error(error.message || '删除失败，请重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '乡镇名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '行政代码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '类型',
      dataIndex: 'region_type',
      key: 'region_type'
    },
    {
      title: '上级单位',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parentId) => {
        if (parentId === 0) return '无';
        const parent = townships.find(item => item.id === parentId);
        return parent ? parent.name : '未知';
      }
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
            description="确定要删除这个乡镇吗？"
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">乡镇管理</h1>
        <div className="action-buttons">
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <Input
              placeholder="搜索乡镇名称或代码"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加乡镇
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTownships}
        rowKey="id"
        className="data-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editingTownship ? '编辑乡镇' : '添加乡镇'}
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
            label="乡镇名称"
            name="name"
            rules={[{ required: true, message: '请输入乡镇名称' }]}
          >
            <Input placeholder="请输入乡镇名称" />
          </Form.Item>

          <Form.Item
            label="行政代码"
            name="code"
            rules={[{ required: true, message: '请输入行政代码' }]}
          >
            <Input placeholder="请输入行政代码" />
          </Form.Item>

          <Form.Item
            label="行政类型"
            name="region_type"
            rules={[{ required: true, message: '请选择行政类型' }]}
          >
            <Select placeholder="请选择行政类型">
              <Select.Option value="省">省</Select.Option>
              <Select.Option value="市">市</Select.Option>
              <Select.Option value="区">区</Select.Option>
              <Select.Option value="县">县</Select.Option>
              <Select.Option value="街道">街道</Select.Option>
              <Select.Option value="乡镇">乡镇</Select.Option>
              <Select.Option value="开发区">开发区</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="上级单位"
            name="parent_id"
          >
            <Select placeholder="请选择上级单位">
              {parentOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="排序号"
            name="order"
            rules={[
              { required: true, message: '请输入排序号' },
              { type: 'number', message: '请输入数字' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入排序号" min={1} />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={4} placeholder="请输入乡镇描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TownshipManagement;