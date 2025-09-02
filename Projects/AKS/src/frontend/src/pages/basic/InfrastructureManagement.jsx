import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Space, Upload, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EnvironmentOutlined, FileImageOutlined } from '@ant-design/icons';
import '../styles.css';
import {
  getInfrastructures,
  createInfrastructure,
  updateInfrastructure,
  deleteInfrastructure,
  getInfrastructureTypes,
  getInfrastructureStatuses,
  getLandAreas,
  getFarmers
} from '../../services/basicService';

const { Option } = Select;
const { Dragger } = Upload;

const InfrastructureManagement = () => {
  const [infrastructures, setInfrastructures] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingInfra, setEditingInfra] = useState(null);
  const [form] = Form.useForm();
  const [farms, setFarms] = useState([]);
  const [infraTypes, setInfraTypes] = useState([]);
  const [infraStatuses, setInfraStatuses] = useState([]);
  const [landAreas, setLandAreas] = useState([]);

  // 从API获取数据
  const fetchData = async () => {
    try {
      // 获取基础设施数据
      const infrastructuresData = await getInfrastructures();
      setInfrastructures(infrastructuresData);
      
      // 获取基础设施类型数据
      const infraTypesData = await getInfrastructureTypes();
      setInfraTypes(infraTypesData);
      
      // 获取基础设施状态数据
      const infraStatusesData = await getInfrastructureStatuses();
      setInfraStatuses(infraStatusesData);
      
      // 获取地块数据
      const landAreasData = await getLandAreas();
      setLandAreas(landAreasData);
      
      // 获取农场数据
      const farmsData = await getFarmers();
      setFarms(farmsData);
    } catch (error) {
      message.error('获取数据失败，请稍后重试');
      console.error('获取基础设施相关数据失败:', error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  // 刷新数据
  const refreshData = () => {
    fetchData();
    message.success('数据刷新成功');
  };

  // 打开添加/编辑基础设施模态框
  const showModal = (infra = null) => {
    setEditingInfra(infra);
    if (infra) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        code: infra.code,
        name: infra.name,
        farm_id: infra.farm_id,
        type_id: infra.type_id,
        land_id: infra.land_id,
        location: infra.location,
        longitude: infra.longitude,
        latitude: infra.latitude,
        description: infra.description,
        status: infra.status,
        build_year: infra.build_year
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
    setEditingInfra(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingInfra) {
        // 更新基础设施
        await updateInfrastructure(editingInfra.id, values);
        message.success('基础设施更新成功');
      } else {
        // 添加基础设施
        await createInfrastructure(values);
        message.success('基础设施添加成功');
      }
      
      // 刷新数据
      refreshData();
      
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 删除基础设施
  const handleDelete = async (infraId) => {
    try {
      await deleteInfrastructure(infraId);
      // 刷新数据
      refreshData();
    } catch (error) {
      console.error('删除基础设施失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 模拟上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload', // 实际项目中替换为真实的上传接口
    headers: {
      authorization: 'Bearer token', // 实际项目中替换为真实的认证信息
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '设施编码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '设施名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-primary font-medium">{text}</span>
    },
    {
      title: '所属农场',
      dataIndex: 'farm_name',
      key: 'farm_name'
    },
    {
      title: '设施类型',
      dataIndex: 'type_name',
      key: 'type_name'
    },
    {
      title: '所属地块',
      dataIndex: 'land_name',
      key: 'land_name'
    },
    {
      title: '建造年份',
      dataIndex: 'build_year',
      key: 'build_year'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusObj = infraStatuses.find(s => s.id === status.toString());
        const statusColor = {
          '1': '#52c41a',
          '2': '#faad14',
          '3': '#ff4d4f',
          '4': '#d9d9d9'
        };
        return (
          <span style={{ color: statusColor[status] || '#d9d9d9' }}>
            {statusObj?.name || '未知'}
          </span>
        );
      }
    },
    {
      title: '图片数量',
      dataIndex: 'images',
      key: 'images_count',
      render: (images) => (
        <Tag color="blue">{images.length} 张</Tag>
      )
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
            description="确定要删除这个基础设施吗？删除后将无法恢复。"
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
        <h1 className="page-title">基础设施管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加基础设施
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            onClick={refreshData}
          >
            刷新数据
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={infrastructures}
        rowKey="id"
        className="data-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="expand-content">
              <div className="expand-section">
                <h4>设施详情</h4>
                <div className="detail-row">
                  <span className="detail-label">详细位置：</span>
                  <span className="detail-value">{record.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">经纬度：</span>
                  <span className="detail-value">
                    经度 {record.longitude}, 纬度 {record.latitude}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">设施描述：</span>
                  <span className="detail-value">{record.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">创建时间：</span>
                  <span className="detail-value">{record.create_time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">更新时间：</span>
                  <span className="detail-value">{record.update_time}</span>
                </div>
              </div>
              
              <div className="expand-section">
                <h4>地图位置</h4>
                <div className="map-placeholder">
                  <EnvironmentOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                  <p>地图组件加载中...</p>
                  <p className="text-gray">实际项目中，这里会显示基础设施的地图位置</p>
                </div>
              </div>
              
              {record.images && record.images.length > 0 && (
                <div className="expand-section">
                  <h4>设施图片</h4>
                  <div className="image-gallery">
                    {record.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <FileImageOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        <p>{image}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
        }}
      />

      <Modal
        title={editingInfra ? '编辑基础设施' : '添加基础设施'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
        >
          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="设施编码"
                name="code"
                rules={[{ required: true, message: '请输入设施编码' }]}
              >
                <Input placeholder="请输入设施编码" />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="设施名称"
                name="name"
                rules={[{ required: true, message: '请输入设施名称' }]}
              >
                <Input placeholder="请输入设施名称" />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="所属农场"
                name="farm_id"
                rules={[{ required: true, message: '请选择所属农场' }]}
              >
                <Select placeholder="请选择所属农场">
                  {farms.map(farm => (
                    <Option key={farm.id} value={farm.id}>{farm.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="设施类型"
                name="type_id"
                rules={[{ required: true, message: '请选择设施类型' }]}
              >
                <Select placeholder="请选择设施类型">
                  {infraTypes.map(type => (
                    <Option key={type.id} value={type.id}>{type.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="所属地块"
                name="land_id"
                rules={[{ required: true, message: '请选择所属地块' }]}
              >
                <Select placeholder="请选择所属地块">
                  {landAreas.map(land => (
                    <Option key={land.id} value={land.id}>{land.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="建造年份"
                name="build_year"
                rules={[
                  { required: true, message: '请输入建造年份' },
                  { pattern: /^\d{4}$/, message: '请输入4位年份' }
                ]}
              >
                <Input placeholder="请输入建造年份" />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="经度"
                name="longitude"
                rules={[
                  { type: 'number', message: '请输入有效数字' }
                ]}
              >
                <InputNumber 
                  placeholder="请输入经度" 
                  style={{ width: '100%' }}
                  step={0.000001}
                />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="纬度"
                name="latitude"
                rules={[
                  { type: 'number', message: '请输入有效数字' }
                ]}
              >
                <InputNumber 
                  placeholder="请输入纬度" 
                  style={{ width: '100%' }}
                  step={0.000001}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="详细位置"
            name="location"
            rules={[{ required: true, message: '请输入详细位置' }]}
          >
            <Input placeholder="请输入详细位置" />
          </Form.Item>

          <Form.Item
            label="设施描述"
            name="description"
          >
            <Input.TextArea rows={4} placeholder="请输入设施描述" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue="1"
          >
            <Select placeholder="请选择状态">
              {infraStatuses.map(status => (
                <Option key={status.id} value={status.id}>{status.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="上传图片">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。最多上传10张图片，单张图片不超过2MB
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InfrastructureManagement;