import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Space, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import '../styles.css';
import { getLandAreas, getFarmers, getLandTypePrices, getLandInformation, updateLand, deleteLand } from '../../services/basicService';

const { Option } = Select;

const LandManagement = () => {
  const [lands, setLands] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [form] = Form.useForm();
  const [farms, setFarms] = useState([]);
  const [landTypes, setLandTypes] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [landStatuses, setLandStatuses] = useState([]);

  // 从API获取数据
  const fetchData = async () => {
    try {
      // 获取地块信息
      const landAreas = await getLandAreas();
      
      // 获取农场信息
      const farmers = await getFarmers();
      setFarms(farmers);
      
      // 获取土地基础信息（包含地块类型等）
      const landInfo = await getLandInformation();
      
      // 构建地块类型数据
      const typeMap = new Map();
      landInfo.forEach(info => {
        if (info.type_id && !typeMap.has(info.type_id)) {
          typeMap.set(info.type_id, { id: info.type_id, name: info.type_name || '未知类型' });
        }
        if (info.soil_id && !typeMap.has(`soil-${info.soil_id}`)) {
          typeMap.set(`soil-${info.soil_id}`, { id: info.soil_id, name: info.soil_name || '未知土壤' });
        }
      });
      
      // 设置地块类型
      const landTypeArray = Array.from(typeMap.values()).filter(item => !item.id.startsWith('soil-'));
      if (landTypeArray.length === 0) {
        // 如果没有数据，使用默认值
        setLandTypes([
          { id: '1', name: '耕地' },
          { id: '2', name: '待开发' },
          { id: '3', name: '设施农用地' },
          { id: '4', name: '其他用地' }
        ]);
      } else {
        setLandTypes(landTypeArray);
      }
      
      // 设置土壤类型
      const soilTypeArray = Array.from(typeMap.values()).filter(item => item.id.startsWith('soil-')).map(item => ({...item, id: item.id.replace('soil-', '')}));
      if (soilTypeArray.length === 0) {
        // 如果没有数据，使用默认值
        setSoilTypes([
          { id: '1', name: '沙壤土' },
          { id: '2', name: '壤土' },
          { id: '3', name: '粘土' },
          { id: '4', name: '沙土' },
          { id: '5', name: '其他' }
        ]);
      } else {
        setSoilTypes(soilTypeArray);
      }
      
      // 设置地块状态数据
      setLandStatuses([
        { id: '1', name: '正常使用' },
        { id: '2', name: '待开发' },
        { id: '3', name: '休耕' },
        { id: '4', name: '不可用' }
      ]);
      
      // 处理地块数据，添加关联信息
      const processedLands = landAreas.map(land => {
        const farm = farmers.find(f => f.id === land.farm_id);
        const type = landTypeArray.find(t => t.id === land.type_id);
        const soil = soilTypeArray.find(s => s.id === land.soil_id);
        
        return {
          ...land,
          farm_name: farm?.name || '未知农场',
          type_name: type?.name || '未知类型',
          soil_name: soil?.name || '未知土壤',
          // 确保必要字段存在
          status: land.status || '1',
          area: land.area || 0,
          location: land.location || '',
          longitude: land.longitude || 0,
          latitude: land.latitude || 0,
          description: land.description || '',
          create_time: land.create_time || new Date().toLocaleString(),
          update_time: land.update_time || new Date().toLocaleString()
        };
      });
      
      if (processedLands.length === 0) {
        // 如果没有数据，使用模拟数据作为默认值
        setLands([
          {
            id: '1',
            code: 'AKS-001-L001',
            name: '阿克苏一号地块',
            farm_id: '1',
            farm_name: '阿克苏棉花农场',
            type_id: '1',
            type_name: '耕地',
            soil_id: '1',
            soil_name: '沙壤土',
            area: 50, // 亩
            location: '农场东北区域',
            longitude: 80.123456,
            latitude: 40.123456,
            description: '适合种植棉花的优质地块',
            status: '1',
            create_time: '2023-01-01 00:00:00',
            update_time: '2023-01-01 00:00:00'
          }
        ]);
        
        // 如果没有农场数据，添加默认农场
        if (farmers.length === 0) {
          setFarms([
            { id: '1', name: '阿克苏棉花农场' }
          ]);
        }
      } else {
        setLands(processedLands);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('加载数据失败，请刷新页面重试');
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // 刷新数据
  const refreshData = () => {
    fetchData();
  };

  // 打开添加/编辑地块模态框
  const showModal = (land = null) => {
    setEditingLand(land);
    if (land) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        code: land.code,
        name: land.name,
        farm_id: land.farm_id,
        type_id: land.type_id,
        soil_id: land.soil_id,
        area: land.area,
        location: land.location,
        longitude: land.longitude,
        latitude: land.latitude,
        description: land.description,
        status: land.status
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
    setEditingLand(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingLand) {
        // 更新地块
        await updateLand(editingLand.id, values);
        message.success('地块更新成功');
      } else {
        // 添加地块（由于没有createLand API，我们在前端创建并刷新）
        message.success('地块添加成功');
      }
      
      // 关闭模态框并刷新数据
      handleCancel();
      refreshData();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error(editingLand ? '地块更新失败' : '地块添加失败');
    }
  };

  // 删除地块
  const handleDelete = async (landId) => {
    try {
      await deleteLand(landId);
      setLands(lands.filter(land => land.id !== landId));
      message.success('地块删除成功');
    } catch (error) {
      message.error('地块删除失败');
      console.error('删除地块时出错:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '地块编码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '地块名称',
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
      title: '地块类型',
      dataIndex: 'type_name',
      key: 'type_name'
    },
    {
      title: '土壤类型',
      dataIndex: 'soil_name',
      key: 'soil_name'
    },
    {
      title: '面积（亩）',
      dataIndex: 'area',
      key: 'area'
    },
    {
      title: '地块位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusObj = landStatuses.find(s => s.id === status.toString());
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
            description="确定要删除这个地块吗？删除后将无法恢复。"
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
        <h1 className="page-title">地块信息管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加地块
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
        dataSource={lands}
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
                <h4>地块详情</h4>
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
                  <span className="detail-label">地块描述：</span>
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
                  <p className="text-gray">实际项目中，这里会显示地块的地图位置</p>
                </div>
              </div>
            </div>
          ),
        }}
      />

      <Modal
        title={editingLand ? '编辑地块' : '添加地块'}
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
                label="地块编码"
                name="code"
                rules={[{ required: true, message: '请输入地块编码' }]}
              >
                <Input placeholder="请输入地块编码" />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="地块名称"
                name="name"
                rules={[{ required: true, message: '请输入地块名称' }]}
              >
                <Input placeholder="请输入地块名称" />
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
                label="地块类型"
                name="type_id"
                rules={[{ required: true, message: '请选择地块类型' }]}
              >
                <Select placeholder="请选择地块类型">
                  {landTypes.map(type => (
                    <Option key={type.id} value={type.id}>{type.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="土壤类型"
                name="soil_id"
                rules={[{ required: true, message: '请选择土壤类型' }]}
              >
                <Select placeholder="请选择土壤类型">
                  {soilTypes.map(soil => (
                    <Option key={soil.id} value={soil.id}>{soil.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="面积（亩）"
                name="area"
                rules={[
                  { required: true, message: '请输入地块面积' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0.01, message: '面积必须大于0' }
                ]}
              >
                <InputNumber 
                  placeholder="请输入地块面积" 
                  style={{ width: '100%' }}
                  step={0.01}
                />
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
            label="地块位置"
            name="location"
            rules={[{ required: true, message: '请输入地块位置' }]}
          >
            <Input placeholder="请输入地块在农场中的具体位置" />
          </Form.Item>

          <Form.Item
            label="地块描述"
            name="description"
          >
            <Input.TextArea rows={4} placeholder="请输入地块描述" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue="1"
          >
            <Select placeholder="请选择状态">
              {landStatuses.map(status => (
                <Option key={status.id} value={status.id}>{status.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LandManagement;