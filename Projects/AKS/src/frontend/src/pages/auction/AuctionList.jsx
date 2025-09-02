import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Tag, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import '../styles.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [landList, setLandList] = useState([]);
  const [auctionStatuses, setAuctionStatuses] = useState([]);
  const [bidRecords, setBidRecords] = useState({});

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟拍卖数据
    setAuctions([
      {
        id: '1',
        code: 'AUCTION-2023-001',
        name: '阿克苏棉花农场2023年春季拍卖',
        land_id: '5',
        land_name: '阿克苏三号地块',
        description: '该地块位于阿克苏棉花农场东部区域，面积70亩，适合种植棉花等经济作物。\n土壤类型：沙土\n灌溉条件：有灌溉水源\n交通条件：交通便利',
        start_time: '2023-03-01 10:00:00',
        end_time: '2023-03-15 18:00:00',
        starting_price: 500000, // 起拍价（元）
        increment: 10000, // 加价幅度（元）
        current_price: 580000, // 当前价格（元）
        status: 1, // 1: 进行中, 2: 已结束, 3: 未开始, 4: 已取消
        create_time: '2023-02-01 00:00:00',
        update_time: '2023-03-05 14:30:00'
      },
      {
        id: '2',
        code: 'AUCTION-2023-002',
        name: '喀什小麦农场优质地块拍卖',
        land_id: '3',
        land_name: '喀什一号地块',
        description: '该地块位于喀什小麦农场中部区域，面积60亩，适合种植小麦等粮食作物。\n土壤类型：粘土\n灌溉条件：完善的灌溉系统\n交通条件：紧邻主干道',
        start_time: '2023-02-15 10:00:00',
        end_time: '2023-02-28 18:00:00',
        starting_price: 600000, // 起拍价（元）
        increment: 20000, // 加价幅度（元）
        current_price: 780000, // 当前价格（元）
        status: 2, // 已结束
        winner_id: '2',
        winner_name: '张三',
        create_time: '2023-01-15 00:00:00',
        update_time: '2023-02-28 18:05:00'
      },
      {
        id: '3',
        code: 'AUCTION-2023-003',
        name: '和田玉米农场2023年第一期拍卖',
        land_id: '4',
        land_name: '和田一号地块',
        description: '该地块位于和田玉米农场南部区域，面积40亩，适合种植玉米等作物。\n土壤类型：沙壤土\n灌溉条件：滴灌系统\n交通条件：农场道路覆盖',
        start_time: '2023-03-20 10:00:00',
        end_time: '2023-04-05 18:00:00',
        starting_price: 400000, // 起拍价（元）
        increment: 10000, // 加价幅度（元）
        current_price: 400000, // 当前价格（元）
        status: 3, // 未开始
        create_time: '2023-02-20 00:00:00',
        update_time: '2023-02-20 00:00:00'
      }
    ]);

    // 模拟地块数据
    setLandList([
      { id: '1', name: '阿克苏一号地块' },
      { id: '2', name: '阿克苏二号地块' },
      { id: '3', name: '喀什一号地块' },
      { id: '4', name: '和田一号地块' },
      { id: '5', name: '阿克苏三号地块' }
    ]);

    // 模拟拍卖状态数据
    setAuctionStatuses([
      { id: '1', name: '进行中', color: '#52c41a' },
      { id: '2', name: '已结束', color: '#1890ff' },
      { id: '3', name: '未开始', color: '#faad14' },
      { id: '4', name: '已取消', color: '#ff4d4f' }
    ]);

    // 模拟竞价记录数据
    setBidRecords({
      '1': [
        { id: '1', auction_id: '1', bidder_id: '1', bidder_name: '李四', price: 510000, bid_time: '2023-03-01 10:05:30' },
        { id: '2', auction_id: '1', bidder_id: '2', bidder_name: '张三', price: 520000, bid_time: '2023-03-01 10:10:45' },
        { id: '3', auction_id: '1', bidder_id: '3', bidder_name: '王五', price: 530000, bid_time: '2023-03-02 14:20:15' },
        { id: '4', auction_id: '1', bidder_id: '1', bidder_name: '李四', price: 540000, bid_time: '2023-03-03 09:30:00' },
        { id: '5', auction_id: '1', bidder_id: '2', bidder_name: '张三', price: 550000, bid_time: '2023-03-04 11:15:20' },
        { id: '6', auction_id: '1', bidder_id: '3', bidder_name: '王五', price: 560000, bid_time: '2023-03-04 15:40:10' },
        { id: '7', auction_id: '1', bidder_id: '2', bidder_name: '张三', price: 570000, bid_time: '2023-03-05 10:20:30' },
        { id: '8', auction_id: '1', bidder_id: '3', bidder_name: '王五', price: 580000, bid_time: '2023-03-05 14:30:00' }
      ],
      '2': [
        { id: '1', auction_id: '2', bidder_id: '2', bidder_name: '张三', price: 620000, bid_time: '2023-02-15 10:30:00' },
        { id: '2', auction_id: '2', bidder_id: '4', bidder_name: '赵六', price: 640000, bid_time: '2023-02-16 11:15:00' },
        { id: '3', auction_id: '2', bidder_id: '2', bidder_name: '张三', price: 660000, bid_time: '2023-02-17 14:45:00' },
        { id: '4', auction_id: '2', bidder_id: '4', bidder_name: '赵六', price: 680000, bid_time: '2023-02-18 09:20:00' },
        { id: '5', auction_id: '2', bidder_id: '2', bidder_name: '张三', price: 700000, bid_time: '2023-02-20 15:30:00' },
        { id: '6', auction_id: '2', bidder_id: '4', bidder_name: '赵六', price: 720000, bid_time: '2023-02-22 11:45:00' },
        { id: '7', auction_id: '2', bidder_id: '2', bidder_name: '张三', price: 740000, bid_time: '2023-02-25 14:20:00' },
        { id: '8', auction_id: '2', bidder_id: '4', bidder_name: '赵六', price: 760000, bid_time: '2023-02-27 10:15:00' },
        { id: '9', auction_id: '2', bidder_id: '2', bidder_name: '张三', price: 780000, bid_time: '2023-02-28 18:00:00' }
      ]
    });
  }, []);

  // 打开添加/编辑拍卖模态框
  const showModal = (auction = null) => {
    setEditingAuction(auction);
    if (auction) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        code: auction.code,
        name: auction.name,
        land_id: auction.land_id,
        description: auction.description,
        start_time: auction.start_time ? new Date(auction.start_time) : null,
        end_time: auction.end_time ? new Date(auction.end_time) : null,
        starting_price: auction.starting_price,
        increment: auction.increment,
        status: auction.status
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
    setEditingAuction(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 查找关联的数据名称
      const land = landList.find(l => l.id === values.land_id);
      
      // 处理时间格式
      const formattedValues = {
        ...values,
        start_time: values.start_time ? format(values.start_time, 'yyyy-MM-dd HH:mm:ss') : null,
        end_time: values.end_time ? format(values.end_time, 'yyyy-MM-dd HH:mm:ss') : null
      };
      
      if (editingAuction) {
        // 更新拍卖
        setAuctions(auctions.map(a => 
          a.id === editingAuction.id 
            ? { 
                ...a, 
                ...formattedValues,
                land_name: land?.name || '',
                update_time: new Date().toLocaleString() 
              } 
            : a
        ));
        message.success('拍卖更新成功');
      } else {
        // 添加拍卖
        const newAuction = {
          id: `new-${Date.now()}`,
          ...formattedValues,
          land_name: land?.name || '',
          current_price: formattedValues.starting_price, // 初始价格为起拍价
          create_time: new Date().toLocaleString(),
          update_time: new Date().toLocaleString()
        };
        setAuctions([...auctions, newAuction]);
        message.success('拍卖添加成功');
      }
      
      // 关闭模态框
      handleCancel();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 删除拍卖
  const handleDelete = (auctionId) => {
    setAuctions(auctions.filter(a => a.id !== auctionId));
    message.success('拍卖删除成功');
  };

  // 取消拍卖
  const handleCancelAuction = (auctionId) => {
    setAuctions(auctions.map(a => 
      a.id === auctionId 
        ? { ...a, status: 4, update_time: new Date().toLocaleString() } 
        : a
    ));
    message.success('拍卖已取消');
  };

  // 搜索功能
  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      // 实际项目中应该调用API进行搜索
      console.log('搜索条件:', values);
      message.success('搜索成功');
      // 这里仅做演示，不实现实际搜索逻辑
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败，请重试');
    }
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 表格列定义
  const columns = [
    {
      title: '拍卖编号',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '拍卖名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-primary font-medium">{text}</span>
    },
    {
      title: '拍卖地块',
      dataIndex: 'land_name',
      key: 'land_name'
    },
    {
      title: '起拍价(元)',
      dataIndex: 'starting_price',
      key: 'starting_price',
      render: (price) => (
        <span className="font-medium">{price.toLocaleString()}</span>
      )
    },
    {
      title: '当前价格(元)',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price) => (
        <span className="font-medium text-primary">{price.toLocaleString()}</span>
      )
    },
    {
      title: '拍卖状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusObj = auctionStatuses.find(s => s.id === status.toString());
        return (
          <Tag color={statusObj?.color || '#d9d9d9'}>
            {statusObj?.name || '未知'}
          </Tag>
        );
      }
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (time) => {
        if (!time) return '-';
        return (
          <div>
            <div className="date-time-row">
              <CalendarOutlined className="icon-small" /> {format(new Date(time), 'yyyy-MM-dd')}
            </div>
            <div className="date-time-row">
              <ClockCircleOutlined className="icon-small" /> {format(new Date(time), 'HH:mm:ss')}
            </div>
          </div>
        );
      }
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (time) => {
        if (!time) return '-';
        return (
          <div>
            <div className="date-time-row">
              <CalendarOutlined className="icon-small" /> {format(new Date(time), 'yyyy-MM-dd')}
            </div>
            <div className="date-time-row">
              <ClockCircleOutlined className="icon-small" /> {format(new Date(time), 'HH:mm:ss')}
            </div>
          </div>
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
            disabled={record.status === 2} // 已结束的拍卖不可编辑
          >
            编辑
          </Button>
          {record.status !== 4 && (
            <Popconfirm
              title="确认取消"
              description="确定要取消这个拍卖吗？取消后将无法恢复。"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => handleCancelAuction(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger>
                取消
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确认删除"
            description="确定要删除这个拍卖吗？删除后将无法恢复。"
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
        <h1 className="page-title">土地拍卖管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            创建拍卖
          </Button>
        </div>
      </div>

      {/* 搜索区域 */}
      <div className="search-container">
        <Form
          form={searchForm}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item
            label="拍卖编号"
            name="code"
          >
            <Input placeholder="请输入拍卖编号" className="search-input" />
          </Form.Item>
          <Form.Item
            label="拍卖名称"
            name="name"
          >
            <Input placeholder="请输入拍卖名称" className="search-input" />
          </Form.Item>
          <Form.Item
            label="拍卖状态"
            name="status"
          >
            <Select placeholder="请选择拍卖状态">
              <Option value="">全部</Option>
              {auctionStatuses.map(status => (
                <Option key={status.id} value={status.id}>{status.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="拍卖时间"
            name="time_range"
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        columns={columns}
        dataSource={auctions}
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
                <h4>拍卖详情</h4>
                <div className="detail-row">
                  <span className="detail-label">加价幅度：</span>
                  <span className="detail-value">{record.increment?.toLocaleString()} 元</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">创建时间：</span>
                  <span className="detail-value">{record.create_time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">更新时间：</span>
                  <span className="detail-value">{record.update_time}</span>
                </div>
                {record.winner_name && (
                  <div className="detail-row">
                    <span className="detail-label">中标人：</span>
                    <span className="detail-value text-primary font-medium">{record.winner_name}</span>
                  </div>
                )}
              </div>
              
              <div className="expand-section">
                <h4>拍卖描述</h4>
                <div className="description-content">
                  {record.description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
              
              {bidRecords[record.id] && bidRecords[record.id].length > 0 && (
                <div className="expand-section">
                  <h4>竞价记录</h4>
                  <Table
                    columns={[
                      {
                        title: '竞价人',
                        dataIndex: 'bidder_name',
                        key: 'bidder_name'
                      },
                      {
                        title: '竞价价格(元)',
                        dataIndex: 'price',
                        key: 'price',
                        render: (price) => price.toLocaleString()
                      },
                      {
                        title: '竞价时间',
                        dataIndex: 'bid_time',
                        key: 'bid_time'
                      }
                    ]}
                    dataSource={bidRecords[record.id]}
                    rowKey="id"
                    pagination={{
                      pageSize: 5
                    }}
                    className="bid-records-table"
                  />
                </div>
              )}
            </div>
          ),
        }}
      />

      <Modal
        title={editingAuction ? '编辑拍卖' : '创建拍卖'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
        >
          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="拍卖编号"
                name="code"
                rules={[{ required: true, message: '请输入拍卖编号' }]}
              >
                <Input placeholder="请输入拍卖编号" />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="拍卖名称"
                name="name"
                rules={[{ required: true, message: '请输入拍卖名称' }]}
              >
                <Input placeholder="请输入拍卖名称" />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="拍卖地块"
                name="land_id"
                rules={[{ required: true, message: '请选择拍卖地块' }]}
              >
                <Select placeholder="请选择拍卖地块">
                  {landList.map(land => (
                    <Option key={land.id} value={land.id}>{land.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="拍卖状态"
                name="status"
                initialValue="3"
              >
                <Select placeholder="请选择拍卖状态">
                  {auctionStatuses.map(status => (
                    <Option key={status.id} value={status.id}>{status.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Form.Item
                label="起拍价（元）"
                name="starting_price"
                rules={[
                  { required: true, message: '请输入起拍价' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0, message: '起拍价必须大于等于0' }
                ]}
              >
                <InputNumber 
                  prefix={<DollarOutlined />}
                  placeholder="请输入起拍价" 
                  style={{ width: '100%' }}
                  step={1000}
                />
              </Form.Item>
            </div>
            <div className="form-col">
              <Form.Item
                label="加价幅度（元）"
                name="increment"
                rules={[
                  { required: true, message: '请输入加价幅度' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 100, message: '加价幅度必须大于等于100' }
                ]}
              >
                <InputNumber 
                  prefix={<DollarOutlined />}
                  placeholder="请输入加价幅度" 
                  style={{ width: '100%' }}
                  step={1000}
                />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
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
            </div>
            <div className="form-col">
              <Form.Item
                label="结束时间"
                name="end_time"
                rules={[
                  { required: true, message: '请选择结束时间' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || !getFieldValue('start_time')) {
                        return Promise.resolve();
                      }
                      if (value < getFieldValue('start_time')) {
                        return Promise.reject('结束时间不能早于开始时间');
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
            </div>
          </div>

          <Form.Item
            label="拍卖描述"
            name="description"
            rules={[{ required: true, message: '请输入拍卖描述' }]}
          >
            <TextArea rows={6} placeholder="请输入拍卖描述，包括地块位置、土壤类型、灌溉条件等信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuctionList;