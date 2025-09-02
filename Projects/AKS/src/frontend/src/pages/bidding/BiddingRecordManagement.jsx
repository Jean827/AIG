import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, message, Space, Popconfirm, InputNumber, Row, Col, Card } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import '../styles.css';
import { getBiddingRecords, updateBiddingRecord, deleteBiddingRecord, getBiddingRecordStatuses, getBiddingInfos, getBidders } from '../../services/biddingService';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const BiddingRecordManagement = () => {
  const [biddingRecords, setBiddingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchParams, setSearchParams] = useState({
    code: '',
    bidding_code: '',
    bidder_name: '',
    status: '',
    dateRange: null
  });
  const [biddingStatuses, setBiddingStatuses] = useState([]);
  const [biddingInfos, setBiddingInfos] = useState([]);
  const [bidders, setBidders] = useState([]);

  // 初始化数据
  useEffect(() => {
    fetchBiddingStatuses();
    fetchBiddingInfos();
    fetchBidders();
    fetchBiddingRecords();
  }, []);

  // 获取竞拍记录状态
  const fetchBiddingStatuses = async () => {
    try {
      const data = await getBiddingRecordStatuses();
      setBiddingStatuses(data);
    } catch (error) {
      console.error('获取竞拍记录状态失败:', error);
      message.error('获取竞拍记录状态失败，请重试');
    }
  };

  // 获取竞拍信息
  const fetchBiddingInfos = async () => {
    try {
      const data = await getBiddingInfos();
      // 为了适配组件需求，我们只返回需要的字段
      const formattedBiddingInfos = data.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name
      }));
      setBiddingInfos(formattedBiddingInfos);
    } catch (error) {
      console.error('获取竞拍信息失败:', error);
      message.error('获取竞拍信息失败，请重试');
    }
  };

  // 获取竞拍人信息
  const fetchBidders = async () => {
    try {
      const data = await getBidders();
      setBidders(data);
    } catch (error) {
      console.error('获取竞拍人信息失败:', error);
      message.error('获取竞拍人信息失败，请重试');
    }
  };

  // 获取竞拍记录列表
  const fetchBiddingRecords = async () => {
    try {
      setLoading(true);
      const data = await getBiddingRecords();
      setBiddingRecords(data);
    } catch (error) {
      console.error('获取竞拍记录列表失败:', error);
      message.error('获取竞拍记录列表失败，请重试');
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
    let filtered = [...biddingRecords];
    
    if (searchParams.code) {
      filtered = filtered.filter(item => item.code.includes(searchParams.code));
    }
    
    if (searchParams.bidding_code) {
      filtered = filtered.filter(item => item.bidding_code.includes(searchParams.bidding_code));
    }
    
    if (searchParams.bidder_name) {
      filtered = filtered.filter(item => item.bidder_name.includes(searchParams.bidder_name));
    }
    
    if (searchParams.status) {
      filtered = filtered.filter(item => item.status.toString() === searchParams.status);
    }
    
    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const bidTime = new Date(item.bid_time);
        return bidTime >= start && bidTime <= end;
      });
    }
    
    // 重新设置过滤后的数据
    // 注意：这里为了简化，直接使用过滤后的数据替换原数据
    // 实际项目中应该考虑分页和性能问题
    // 这里仅作为演示，实际应该调用API获取过滤后的数据
    const temp = [...biddingRecords];
    setBiddingRecords(filtered);
    
    // 延迟恢复原数据，仅作为演示
    setTimeout(() => {
      setBiddingRecords(temp);
    }, 3000);
  };

  // 重置搜索参数
  const handleResetSearch = () => {
    setSearchParams({
      code: '',
      bidding_code: '',
      bidder_name: '',
      status: '',
      dateRange: null
    });
  };

  // 查看竞拍记录详情
  const showDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  // 关闭详情模态框
  const handleDetailCancel = () => {
    setDetailVisible(false);
    setCurrentRecord(null);
  };

  // 更新竞拍记录状态
  const handleUpdateStatus = async (recordId, status) => {
    try {
      await updateBiddingRecord(recordId, { status });
      message.success('状态更新成功');
      // 重新获取竞拍记录列表
      fetchBiddingRecords();
    } catch (error) {
      console.error('更新状态失败:', error);
      message.error(error.message || '操作失败，请重试');
    }
  };

  // 删除竞拍记录
  const handleDelete = async (recordId) => {
    try {
      await deleteBiddingRecord(recordId);
      message.success('竞拍记录删除成功');
      // 重新获取竞拍记录列表
      fetchBiddingRecords();
    } catch (error) {
      console.error('删除竞拍记录失败:', error);
      message.error(error.message || '删除失败，请重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '记录编号',
      dataIndex: 'code',
      key: 'code',
      width: 150
    },
    {
      title: '所属竞拍',
      dataIndex: 'bidding_name',
      key: 'bidding_name',
      render: (_, record) => `${record.bidding_code || ''} ${record.bidding_name || ''}`
    },
    {
      title: '竞拍人',
      dataIndex: 'bidder_name',
      key: 'bidder_name'
    },
    {
      title: '竞拍价格(元)',
      dataIndex: 'bid_price',
      key: 'bid_price',
      sorter: (a, b) => a.bid_price - b.bid_price
    },
    {
      title: '竞拍时间',
      dataIndex: 'bid_time',
      key: 'bid_time',
      render: (time) => time ? format(new Date(time), 'yyyy-MM-dd HH:mm:ss') : '-',
      sorter: (a, b) => new Date(a.bid_time) - new Date(b.bid_time)
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
      title: '是否中标',
      dataIndex: 'is_winning_bid',
      key: 'is_winning_bid',
      render: (isWinning) => (
        <Tag color={isWinning ? '#52c41a' : '#d9d9d9'}>
          {isWinning ? '是' : '否'}
        </Tag>
      ),
      filters: [
        { text: '是', value: true },
        { text: '否', value: false }
      ]
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => time ? format(new Date(time), 'yyyy-MM-dd HH:mm:ss') : '-',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => showDetail(record)}
            size="small"
          >
            详情
          </Button>
          {record.status === 1 && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleUpdateStatus(record.id, 2)}
              size="small"
            >
              确认
            </Button>
          )}
          <Popconfirm
            title="确认删除"
            description="确定要删除这个竞拍记录吗？"
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
        <h1 className="page-title">竞拍记录管理</h1>
      </div>

      <Card className="search-card">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="记录编号" className="search-item">
              <Input
                placeholder="请输入记录编号"
                value={searchParams.code}
                onChange={(e) => handleSearchParamChange('code', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="竞拍编号" className="search-item">
              <Input
                placeholder="请输入竞拍编号"
                value={searchParams.bidding_code}
                onChange={(e) => handleSearchParamChange('bidding_code', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="竞拍人" className="search-item">
              <Input
                placeholder="请输入竞拍人名称"
                value={searchParams.bidder_name}
                onChange={(e) => handleSearchParamChange('bidder_name', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="记录状态" className="search-item">
              <Select
                placeholder="请选择记录状态"
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
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="竞拍时间范围" className="search-item">
              <RangePicker
                value={searchParams.dateRange}
                onChange={(dates) => handleSearchParamChange('dateRange', dates)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
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
        dataSource={biddingRecords}
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

      {/* 竞拍记录详情模态框 */}
      <Modal
        title="竞拍记录详情"
        open={detailVisible}
        onCancel={handleDetailCancel}
        footer={[
          <Button key="close" onClick={handleDetailCancel}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {currentRecord && (
          <div className="detail-container">
            <div className="detail-item">
              <span className="detail-label">记录编号：</span>
              <span className="detail-value">{currentRecord.code}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">所属竞拍：</span>
              <span className="detail-value">{currentRecord.bidding_code} {currentRecord.bidding_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">竞拍人：</span>
              <span className="detail-value">{currentRecord.bidder_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">竞拍价格：</span>
              <span className="detail-value">{currentRecord.bid_price} 元</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">竞拍时间：</span>
              <span className="detail-value">{currentRecord.bid_time ? format(new Date(currentRecord.bid_time), 'yyyy-MM-dd HH:mm:ss') : '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">状态：</span>
              <span className="detail-value">
                {(() => {
                  const statusObj = biddingStatuses.find(s => s.id === currentRecord.status.toString());
                  return statusObj ? statusObj.name : '未知';
                })()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">是否中标：</span>
              <span className="detail-value">{currentRecord.is_winning_bid ? '是' : '否'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">备注：</span>
              <span className="detail-value">{currentRecord.remark || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">创建时间：</span>
              <span className="detail-value">{currentRecord.created_at ? format(new Date(currentRecord.created_at), 'yyyy-MM-dd HH:mm:ss') : '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">更新时间：</span>
              <span className="detail-value">{currentRecord.updated_at ? format(new Date(currentRecord.updated_at), 'yyyy-MM-dd HH:mm:ss') : '-'}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BiddingRecordManagement;