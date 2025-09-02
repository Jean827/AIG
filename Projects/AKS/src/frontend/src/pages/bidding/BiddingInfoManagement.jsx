import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, message, Space, Popconfirm, InputNumber, Row, Col, Card } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import '../styles.css';
import { getBiddingInfos, createBiddingInfo, updateBiddingInfo, deleteBiddingInfo, getBiddingStatuses, getLands, getAuctioneers } from '../../services/biddingService';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const BiddingInfoManagement = () => {
  const [biddingInfos, setBiddingInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingBiddingInfo, setEditingBiddingInfo] = useState(null);
  const [searchParams, setSearchParams] = useState({
    code: '',
    name: '',
    status: '',
    dateRange: null
  });
  const [form] = Form.useForm();
  const [biddingStatuses, setBiddingStatuses] = useState([]);
  const [lands, setLands] = useState([]);
  const [auctioneers, setAuctioneers] = useState([]);

  // 初始化数据
  useEffect(() => {
    fetchBiddingStatuses();
    fetchLands();
    fetchAuctioneers();
    fetchBiddingInfos();
  }, []);

  // 获取竞拍状态
  const fetchBiddingStatuses = async () => {
    try {
      const data = await getBiddingStatuses();
      setBiddingStatuses(data);
    } catch (error) {
      console.error('获取竞拍状态失败:', error);
      message.error('获取竞拍状态失败，请重试');
    }
  };

  // 获取土地信息
  const fetchLands = async () => {
    try {
      const data = await getLands();
      setLands(data);
    } catch (error) {
      console.error('获取土地信息失败:', error);
      message.error('获取土地信息失败，请重试');
    }
  };

  // 获取拍卖师信息
  const fetchAuctioneers = async () => {
    try {
      const data = await getAuctioneers();
      setAuctioneers(data);
    } catch (error) {
      console.error('获取拍卖师信息失败:', error);
      message.error('获取拍卖师信息失败，请重试');
    }
  };

  // 获取竞拍信息列表
  const fetchBiddingInfos = async () => {
    try {
      setLoading(true);
      const data = await getBiddingInfos();
      setBiddingInfos(data);
    } catch (error) {
      console.error('获取竞拍信息列表失败:', error);
      message.error('获取竞拍信息列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索参数变化
  const handleSearchParamChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 执行搜索
  const handleSearch = () => {
    // 在实际项目中，这里应该调用API进行搜索
    // 此处使用模拟数据进行前端过滤
    let filtered = [...biddingInfos];
    
    if (searchParams.code) {
      filtered = filtered.filter(item => item.code.includes(searchParams.code));
    }
    
    if (searchParams.name) {
      filtered = filtered.filter(item => item.name.includes(searchParams.name));
    }
    
    if (searchParams.status) {
      filtered = filtered.filter(item => item.status.toString() === searchParams.status);
    }
    
    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const startTime = new Date(item.start_time);
        return startTime >= start && startTime <= end;
      });
    }
    
    // 重新设置过滤后的数据
    // 注意：这里为了简化，直接使用过滤后的数据替换原数据
    // 实际项目中应该考虑分页和性能问题
    // 这里仅作为演示，实际应该调用API获取过滤后的数据
    const temp = [...biddingInfos];
    setBiddingInfos(filtered);
    
    // 延迟恢复原数据，仅作为演示
    setTimeout(() => {
      setBiddingInfos(temp);
    }, 3000);
  };

  // 重置搜索参数
  const handleResetSearch = () => {
    setSearchParams({
      code: '',
      name: '',
      status: '',
      dateRange: null
    });
  };

  // 打开添加/编辑竞拍信息模态框
  const showModal = (biddingInfo = null) => {
    setEditingBiddingInfo(biddingInfo);
    if (biddingInfo) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        code: biddingInfo.code,
        name: biddingInfo.name,
        land_id: biddingInfo.land_id,
        start_price: biddingInfo.start_price,
        increment: biddingInfo.increment,
        start_time: biddingInfo.start_time ? new Date(biddingInfo.start_time) : null,
        end_time: biddingInfo.end_time ? new Date(biddingInfo.end_time) : null,
        status: biddingInfo.status.toString(),
        auctioneer_id: biddingInfo.auctioneer_id,
        description: biddingInfo.description
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
    setEditingBiddingInfo(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 转换日期格式
      const submitData = {
        ...values,
        status: parseInt(values.status),
        start_time: values.start_time ? format(values.start_time, 'yyyy-MM-dd HH:mm:ss') : null,
        end_time: values.end_time ? format(values.end_time, 'yyyy-MM-dd HH:mm:ss') : null
      };
      
      if (editingBiddingInfo) {
        // 更新竞拍信息
        await updateBiddingInfo(editingBiddingInfo.id, submitData);
        message.success('竞拍信息更新成功');
      } else {
        // 添加竞拍信息
        await createBiddingInfo(submitData);
        message.success('竞拍信息添加成功');
      }
      
      // 重新获取竞拍信息列表
      fetchBiddingInfos();
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error(error.message || '操作失败，请重试');
    }
  };

  // 删除竞拍信息
  const handleDelete = async (biddingInfoId) => {
    try {
      await deleteBiddingInfo(biddingInfoId);
      message.success('竞拍信息删除成功');
      // 重新获取竞拍信息列表
      fetchBiddingInfos();
    } catch (error) {
      console.error('删除竞拍信息失败:', error);
      message.error(error.message || '删除失败，请重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '竞拍编号',
      dataIndex: 'code',
      key: 'code',
      width: 150
    },
    {
      title: '竞拍名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '关联地块',
      dataIndex: 'land_name',
      key: 'land_name',
      render: (_, record) => `${record.land_code || ''} ${record.land_name || ''}`
    },
    {
      title: '起始价格(元)',
      dataIndex: 'start_price',
      key: 'start_price',
      sorter: (a, b) => a.start_price - b.start_price
    },
    {
      title: '当前价格(元)',
      dataIndex: 'current_price',
      key: 'current_price',
      sorter: (a, b) => a.current_price - b.current_price
    },
    {
      title: '加价幅度(元)',
      dataIndex: 'increment',
      key: 'increment'
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (time) => time ? format(new Date(time), 'yyyy-MM-dd HH:mm') : '-',
      sorter: (a, b) => new Date(a.start_time) - new Date(b.start_time)
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (time) => time ? format(new Date(time), 'yyyy-MM-dd HH:mm') : '-',
      sorter: (a, b) => new Date(a.end_time) - new Date(b.end_time)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusObj = biddingStatuses.find(s => s.id === status.toString());
        return statusObj ? (
          <Tag color={statusObj.color}>{statusObj.name}</Tag>
        ) : (
          <Tag color="default">未知</Tag>
        );
      },
      filters: biddingStatuses.map(status => ({
        text: status.name,
        value: status.id
      }))
    },
    {
      title: '拍卖师',
      dataIndex: 'auctioneer_name',
      key: 'auctioneer_name'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => time ? format(new Date(time), 'yyyy-MM-dd HH:mm') : '-',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个竞拍信息吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
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
        <h1 className="page-title">竞拍信息管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            添加竞拍信息
          </Button>
        </div>
      </div>

      <Card className="search-card">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="竞拍编号" className="search-item">
              <Input
                placeholder="请输入竞拍编号"
                value={searchParams.code}
                onChange={(e) => handleSearchParamChange('code', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="竞拍名称" className="search-item">
              <Input
                placeholder="请输入竞拍名称"
                value={searchParams.name}
                onChange={(e) => handleSearchParamChange('name', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="竞拍状态" className="search-item">
              <Select
                placeholder="请选择竞拍状态"
                value={searchParams.status}
                onChange={(value) => handleSearchParamChange('status', value)}
                allowClear
              >
                {biddingStatuses.map(status => (
                  <Option key={status.id} value={status.id}>{status.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="竞拍开始时间" className="search-item">
              <RangePicker
                value={searchParams.dateRange}
                onChange={(dates) => handleSearchParamChange('dateRange', dates)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={handleResetSearch} style={{ marginRight: 16 }}>
              重置
            </Button>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={biddingInfos}
        rowKey="id"
        className="data-table"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{
          x: 1200
        }}
      />

      <Modal
        title={editingBiddingInfo ? '编辑竞拍信息' : '添加竞拍信息'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={700}
        okText="提交"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
        >
          <Form.Item
            label="竞拍编号"
            name="code"
            rules={[{ required: true, message: '请输入竞拍编号' }]}
          >
            <Input placeholder="请输入竞拍编号" />
          </Form.Item>

          <Form.Item
            label="竞拍名称"
            name="name"
            rules={[{ required: true, message: '请输入竞拍名称' }]}
          >
            <Input placeholder="请输入竞拍名称" />
          </Form.Item>

          <Form.Item
            label="关联地块"
            name="land_id"
            rules={[{ required: true, message: '请选择关联地块' }]}
          >
            <Select placeholder="请选择关联地块">
              {lands.map(land => (
                <Option key={land.id} value={land.id}>{land.code} {land.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="起始价格(元)"
            name="start_price"
            rules={[
              { required: true, message: '请输入起始价格' },
              { type: 'number', message: '请输入数字' },
              { min: 0, message: '价格不能为负数' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入起始价格" min={0} />
          </Form.Item>

          <Form.Item
            label="加价幅度(元)"
            name="increment"
            rules={[
              { required: true, message: '请输入加价幅度' },
              { type: 'number', message: '请输入数字' },
              { min: 1, message: '加价幅度至少为1元' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入加价幅度" min={1} />
          </Form.Item>

          <Form.Item
            label="开始时间"
            name="start_time"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker
              showTime
              placeholder="请选择开始时间"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="结束时间"
            name="end_time"
            rules={[
              { required: true, message: '请选择结束时间' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('start_time')) {
                    return Promise.resolve();
                  }
                  if (value < getFieldValue('start_time')) {
                    return Promise.reject(new Error('结束时间不能早于开始时间'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              placeholder="请选择结束时间"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              {biddingStatuses.map(status => (
                <Option key={status.id} value={status.id}>{status.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="拍卖师"
            name="auctioneer_id"
            rules={[{ required: true, message: '请选择拍卖师' }]}
          >
            <Select placeholder="请选择拍卖师">
              {auctioneers.map(auctioneer => (
                <Option key={auctioneer.id} value={auctioneer.id}>{auctioneer.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <TextArea rows={4} placeholder="请输入竞拍信息描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BiddingInfoManagement;