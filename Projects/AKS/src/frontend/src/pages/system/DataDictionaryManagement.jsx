import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Popconfirm,
  message, Space, Divider, Tabs, Tag
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ExclamationCircleOutlined, BookOutlined
} from '@ant-design/icons';
import '../styles.css';
import {
  getDataDictionary,
  createDataDictionary,
  updateDataDictionary,
  deleteDataDictionary,
  getDataDictionaryItems,
  createDataDictionaryItem,
  updateDataDictionaryItem,
  deleteDataDictionaryItem
} from '../../services/systemService';

const { TabPane } = Tabs;
const { Option } = Select;

const DataDictionaryManagement = () => {
  // 字典类型状态
  const [dictTypes, setDictTypes] = useState([]);
  const [typeVisible, setTypeVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeForm] = Form.useForm();
  
  // 字典项状态
  const [dictItems, setDictItems] = useState([]);
  const [itemVisible, setItemVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm] = Form.useForm();
  
  // 当前选择的字典类型
  const [selectedType, setSelectedType] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取字典类型
        const typeResponse = await getDataDictionary();
        setDictTypes(typeResponse.data || []);
        
        // 获取所有字典项
        const itemResponse = await getDataDictionaryItems();
        setDictItems(itemResponse.data || []);
        
        // 默认选择第一个字典类型
        if (typeResponse.data && typeResponse.data.length > 0 && !selectedType) {
          setSelectedType(typeResponse.data[0]);
        }
      } catch (error) {
        console.error('获取数据字典失败:', error);
        message.error('获取数据字典失败，请重试');
      }
    };
    
    fetchData();
  }, [selectedType]);

  // 字典类型相关操作
  // 打开添加/编辑字典类型模态框
  const showTypeModal = (type = null) => {
    setEditingType(type);
    if (type) {
      // 编辑模式，填充表单数据
      typeForm.setFieldsValue({
        name: type.name,
        code: type.code,
        description: type.description,
        status: type.status
      });
    } else {
      // 添加模式，重置表单
      typeForm.resetFields();
    }
    setTypeVisible(true);
  };

  // 关闭字典类型模态框
  const handleTypeCancel = () => {
    setTypeVisible(false);
    setEditingType(null);
    typeForm.resetFields();
  };

  // 提交字典类型表单
  const handleTypeSubmit = async () => {
    try {
      const values = await typeForm.validateFields();
      
      if (editingType) {
        // 更新字典类型
        await updateDataDictionary(editingType.id, values);
        // 重新获取数据
        const typeResponse = await getDataDictionary();
        setDictTypes(typeResponse.data || []);
        // 如果当前选择的是被编辑的类型，更新选择
        const updatedType = typeResponse.data.find(t => t.id === editingType.id);
        if (selectedType && selectedType.id === editingType.id && updatedType) {
          setSelectedType(updatedType);
        }
        message.success('字典类型更新成功');
      } else {
        // 添加字典类型
        await createDataDictionary(values);
        // 重新获取数据
        const typeResponse = await getDataDictionary();
        setDictTypes(typeResponse.data || []);
        message.success('字典类型添加成功');
      }
      
      // 关闭模态框
      handleTypeCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 删除字典类型
  const handleTypeDelete = async (typeId) => {
    try {
      // 检查是否有字典项关联
      const itemResponse = await getDataDictionaryItems();
      const items = itemResponse.data || [];
      const hasItems = items.some(item => item.type_id === typeId);
      if (hasItems) {
        message.error('该字典类型下有关联的字典项，无法删除');
        return;
      }
      
      await deleteDataDictionary(typeId);
      // 重新获取数据
      const typeResponse = await getDataDictionary();
      setDictTypes(typeResponse.data || []);
      // 如果删除的是当前选择的类型，重新选择第一个
      if (selectedType && selectedType.id === typeId) {
        setSelectedType(typeResponse.data && typeResponse.data.length > 0 ? typeResponse.data[0] : null);
      }
      message.success('字典类型删除成功');
    } catch (error) {
      console.error('删除字典类型失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 字典项相关操作
  // 获取当前类型的字典项
  const getCurrentTypeItems = () => {
    if (!selectedType) return [];
    return dictItems.filter(item => item.type_id === selectedType.id);
  };

  // 打开添加/编辑字典项模态框
  const showItemModal = (item = null) => {
    if (!selectedType) {
      message.warning('请先选择一个字典类型');
      return;
    }
    
    setEditingItem(item);
    if (item) {
      // 编辑模式，填充表单数据
      itemForm.setFieldsValue({
        label: item.label,
        value: item.value,
        color: item.color,
        sort_order: item.sort_order,
        status: item.status
      });
    } else {
      // 添加模式，重置表单
      itemForm.resetFields();
    }
    setItemVisible(true);
  };

  // 关闭字典项模态框
  const handleItemCancel = () => {
    setItemVisible(false);
    setEditingItem(null);
    itemForm.resetFields();
  };

  // 提交字典项表单
  const handleItemSubmit = async () => {
    try {
      const values = await itemForm.validateFields();
      
      if (editingItem) {
        // 更新字典项
        await updateDataDictionaryItem(editingItem.id, values);
        // 重新获取数据
        const itemResponse = await getDataDictionaryItems();
        setDictItems(itemResponse.data || []);
        message.success('字典项更新成功');
      } else {
        // 添加字典项
        await createDataDictionaryItem({...values, type_id: selectedType.id});
        // 重新获取数据
        const itemResponse = await getDataDictionaryItems();
        setDictItems(itemResponse.data || []);
        message.success('字典项添加成功');
      }
      
      // 关闭模态框
      handleItemCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 删除字典项
  const handleItemDelete = async (itemId) => {
    try {
      await deleteDataDictionaryItem(itemId);
      // 重新获取数据
      const itemResponse = await getDataDictionaryItems();
      setDictItems(itemResponse.data || []);
      message.success('字典项删除成功');
    } catch (error) {
      console.error('删除字典项失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 切换字典类型
  const handleTypeChange = (typeId) => {
    const type = dictTypes.find(t => t.id === typeId);
    if (type) {
      setSelectedType(type);
    }
  };

  // 字典类型表格列定义
  const typeColumns = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
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
            onClick={() => showTypeModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个字典类型吗？删除后将无法恢复。"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => handleTypeDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => {
              setSelectedType(record);
              setActiveTab('2');
            }}
          >
            查看字典项
          </Button>
        </Space>
      )
    }
  ];

  // 字典项表格列定义
  const itemColumns = [
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      render: (label, record) => (
        <Tag color={record.color}>{label}</Tag>
      )
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value'
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
            onClick={() => showItemModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个字典项吗？删除后将无法恢复。"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => handleItemDelete(record.id)}
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

  // 颜色选项
  const colorOptions = [
    { label: '蓝色', value: '#1890ff' },
    { label: '绿色', value: '#52c41a' },
    { label: '红色', value: '#ff4d4f' },
    { label: '橙色', value: '#fa8c16' },
    { label: '黄色', value: '#faad14' },
    { label: '紫色', value: '#722ed1' },
    { label: '青色', value: '#13c2c2' },
    { label: '粉色', value: '#eb2f96' },
    { label: '灰色', value: '#f5f5f5' },
    { label: '黑色', value: '#262626' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">数据字典管理</h1>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="字典类型管理" key="1">
          <div className="action-buttons mb-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showTypeModal()}
            >
              添加字典类型
            </Button>
          </div>

          <Table
            columns={typeColumns}
            dataSource={dictTypes}
            rowKey="id"
            className="data-table"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
          />
        </TabPane>

        <TabPane tab="字典项管理" key="2">
          <div className="mb-4">
            <div className="form-row">
              <div className="form-item w-40">
                <label className="form-label mr-2">选择字典类型：</label>
                <Select
                  placeholder="请选择字典类型"
                  style={{ width: 200 }}
                  value={selectedType ? selectedType.id : undefined}
                  onChange={handleTypeChange}
                >
                  {dictTypes.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {selectedType && (
            <>
              <div className="action-buttons mb-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showItemModal()}
                >
                  添加字典项
                </Button>
              </div>

              <Table
                columns={itemColumns}
                dataSource={getCurrentTypeItems()}
                rowKey="id"
                className="data-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条记录`
                }}
                locale={{
                  emptyText: '暂无字典项数据'
                }}
              />
            </>
          )}

          {!selectedType && (
            <div className="empty-state">
              <p>请先选择一个字典类型</p>
            </div>
          )}
        </TabPane>
      </Tabs>

      {/* 字典类型模态框 */}
      <Modal
        title={editingType ? '编辑字典类型' : '添加字典类型'}
        open={typeVisible}
        onOk={handleTypeSubmit}
        onCancel={handleTypeCancel}
        width={600}
      >
        <Form
          form={typeForm}
          layout="vertical"
          className="form-container"
        >
          <Form.Item
            label="字典名称"
            name="name"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="请输入字典名称" />
          </Form.Item>

          <Form.Item
            label="字典编码"
            name="code"
            rules={[
              { required: true, message: '请输入字典编码' },
              { pattern: /^[a-z_]+$/, message: '字典编码只能包含小写字母和下划线' }
            ]}
          >
            <Input placeholder="请输入字典编码（小写字母和下划线）" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="请输入字典描述" />
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

      {/* 字典项模态框 */}
      <Modal
        title={editingItem ? '编辑字典项' : '添加字典项'}
        open={itemVisible}
        onOk={handleItemSubmit}
        onCancel={handleItemCancel}
        width={600}
      >
        <Form
          form={itemForm}
          layout="vertical"
          className="form-container"
        >
          <Form.Item
            label="字典类型"
          >
            <Input value={selectedType?.name} disabled />
          </Form.Item>

          <Form.Item
            label="标签"
            name="label"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="请输入标签" />
          </Form.Item>

          <Form.Item
            label="值"
            name="value"
            rules={[{ required: true, message: '请输入值' }]}
          >
            <Input placeholder="请输入值" />
          </Form.Item>

          <Form.Item
            label="颜色"
            name="color"
            initialValue="#1890ff"
          >
            <Select placeholder="请选择标签颜色">
              {colorOptions.map(color => (
                <Option key={color.value} value={color.value}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, backgroundColor: color.value, marginRight: 8 }}></span>
                  {color.label}
                </Option>
              ))}
            </Select>
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

export default DataDictionaryManagement;