import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Space, Upload, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import '../styles.css';
import { getFarmers, createFarmer, updateFarmer, deleteFarmer } from '../../services/basicService';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const FarmManagement = () => {
  const [farms, setFarms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [form] = Form.useForm();
  const [organizations, setOrganizations] = useState([]);
  const [farmTypes, setFarmTypes] = useState([]);
  const [farmStatuses, setFarmStatuses] = useState([]);

  // 从service获取数据
  useEffect(() => {
    // 获取农户数据
    getFarmers().then(data => {
      setFarms(data);
    }).catch(error => {
      console.error('获取农户数据失败:', error);
      message.error('获取农户数据失败，请重试');
    });

    // 模拟组织机构数据
    setOrganizations([
      { id: '1', name: '总部' },
      { id: '2', name: '阿克苏分公司' },
      { id: '3', name: '喀什分公司' },
      { id: '4', name: '和田分公司' }
    ]);

    // 模拟农场类型数据
    setFarmTypes([
      { id: '1', name: '棉花农场' },
      { id: '2', name: '小麦农场' },
      { id: '3', name: '玉米农场' },
      { id: '4', name: '水果农场' },
      { id: '5', name: '蔬菜农场' },
      { id: '6', name: '综合农场' }
    ]);

    // 模拟农场状态数据
    setFarmStatuses([
      { id: '1', name: '正常运营' },
      { id: '2', name: '建设中' },
      { id: '3', name: '暂停运营' },
      { id: '4', name: '已关闭' }
    ]);
  }, []);

  // 刷新农户数据
  const refreshFarms = () => {
    getFarmers().then(data => {
      setFarms(data);
    }).catch(error => {
      console.error('刷新农户数据失败:', error);
      message.error('刷新农户数据失败，请重试');
    });
  };

  // 打开添加/编辑农场模态框
  const showModal = (farm = null) => {
    setEditingFarm(farm);
    if (farm) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        name: farm.name,
        code: farm.code,
        organization_id: farm.organization_id,
        type_id: farm.type_id,
        address: farm.address,
        area: farm.area,
        total_land_count: farm.total_land_count,
        contact_person: farm.contact_person,
        contact_phone: farm.contact_phone,
        description: farm.description,
        status: farm.status
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
    setEditingFarm(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 查找关联的数据名称
      const organization = organizations.find(org => org.id === values.organization_id);
      const farmType = farmTypes.find(type => type.id === values.type_id);
      
      if (editingFarm) {
        // 更新农户
        await updateFarmer(editingFarm.id, {
          ...values,
          organization_name: organization?.name || '',
          type_name: farmType?.name || ''
        });
        message.success('农户更新成功');
      } else {
        // 添加农户
        await createFarmer({
          ...values,
          organization_name: organization?.name || '',
          type_name: farmType?.name || ''
        });
        message.success('农户添加成功');
      }
      
      refreshFarms();
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error(error.message || '操作失败，请重试');
    }
  };

  // 删除农户
  const handleDelete = async (farmId) => {
    try {
      await deleteFarmer(farmId);
      setFarms(farms.filter(farm => farm.id !== farmId));
      message.success('农户删除成功');
    } catch (error) {
      console.error('删除农户失败:', error);
      message.error(error.message || '删除农户失败，请重试');
    }
  };

  // 上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload', // 实际项目中替换为真实的上传接口
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '农场名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-primary font-medium">{text}</span>
    },
    {
      title: '农场编码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '所属机构',
      dataIndex: 'organization_name',
      key: 'organization_name'
    },
    {
      title: '农场类型',
      dataIndex: 'type_name',
      key: 'type_name'
    },
    {
      title: '面积（亩）',
      dataIndex: 'area',
      key: 'area'
    },
    {
      title: '地块总数',
      dataIndex: 'total_land_count',
      key: 'total_land_count'
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusObj = status !== undefined ? farmStatuses.find(s => s.id === status.toString()) : null;
        const statusColor = {
          '1': '#52c41a',
          '2': '#faad14',
          '3': '#fa8c16',
          '4': '#ff4d4f'
        };
        return (
          <span style={{ color: statusColor[status] || '#d9d9d9' }}>
            {statusObj?.name || '未知'}
          </span>
        );
      }
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
            description="确定要删除这个农场吗？删除后将无法恢复。"
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
        <h1 className="page-title">农场信息管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加农场
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={farms}
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
                <Title level={5}>农场详情</Title>
                <div className="detail-row">
                  <span className="detail-label">详细地址：</span>
                  <span className="detail-value">{record.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">农场描述：</span>
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
                <Title level={5}>上传农场图片</Title>
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">
                    支持单个或批量上传，最多上传10张图片
                  </p>
                </Dragger>
              </div>
            </div>
          ),
        }}
      />

      <Modal
        title={editingFarm ? '编辑农场' : '添加农场'}
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
                label="农场名称"
                name="name"
                rules={[{ required: true, message: '请输入农场名称' }]}
              >
                <Input placeholder="请输入农场名称" />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="农场编码"
                name="code"
                rules={[{ required: true, message: '请输入农场编码' }]}
              >
                <Input placeholder="请输入农场编码" />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="所属机构"
                name="organization_id"
                rules={[{ required: true, message: '请选择所属机构' }]}
              >
                <Select placeholder="请选择所属机构">
                  {organizations.map(organization => (
                    <Option key={organization.id} value={organization.id}>{organization.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="农场类型"
                name="type_id"
                rules={[{ required: true, message: '请选择农场类型' }]}
              >
                <Select placeholder="请选择农场类型">
                  {farmTypes.map(type => (
                    <Option key={type.id} value={type.id}>{type.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="面积（亩）"
                name="area"
                rules={[
                  { required: true, message: '请输入农场面积' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0.01, message: '面积必须大于0' }
                ]}
              >
                <Input type="number" placeholder="请输入农场面积" />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="地块总数"
                name="total_land_count"
                rules={[
                  { required: true, message: '请输入地块总数' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 1, message: '地块数量必须大于0' }
                ]}
              >
                <Input type="number" placeholder="请输入地块总数" />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="联系人"
                name="contact_person"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="联系电话"
                name="contact_phone"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="详细地址"
            name="address"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Form.Item
            label="农场描述"
            name="description"
          >
            <TextArea rows={4} placeholder="请输入农场描述" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue="1"
          >
            <Select placeholder="请选择状态">
              {farmStatuses.map(status => (
                <Option key={status.id} value={status.id}>{status.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FarmManagement;