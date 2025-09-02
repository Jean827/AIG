import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Input, Select, Tag, Space, message } from 'antd';
import { SearchOutlined, PlusOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const AuctionRecord = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    auctionName: '',
    status: '',
    dateRange: [],
  });

  // 模拟数据
  const mockData = [
    {
      id: '1',
      auctionName: '2023年度第一批次农田竞拍',
      landId: 'LD2023001',
      landArea: '50.5',
      basePrice: '1200',
      finalPrice: '1350',
      winner: '张三农业合作社',
      auctionDate: '2023-05-15',
      status: 'completed',
    },
    {
      id: '2',
      auctionName: '2023年度第二批次农田竞拍',
      landId: 'LD2023002',
      landArea: '35.2',
      basePrice: '1100',
      finalPrice: '1280',
      winner: '李四家庭农场',
      auctionDate: '2023-06-20',
      status: 'completed',
    },
    {
      id: '3',
      auctionName: '2023年度第三批次农田竞拍',
      landId: 'LD2023003',
      landArea: '42.8',
      basePrice: '1150',
      finalPrice: '1250',
      winner: '王五农业公司',
      auctionDate: '2023-07-10',
      status: 'completed',
    },
    {
      id: '4',
      auctionName: '2023年度第四批次农田竞拍',
      landId: 'LD2023004',
      landArea: '60.1',
      basePrice: '1300',
      finalPrice: '1450',
      winner: '赵六农业合作社',
      auctionDate: '2023-08-05',
      status: 'completed',
    },
    {
      id: '5',
      auctionName: '2023年度第五批次农田竞拍',
      landId: 'LD2023005',
      landArea: '30.5',
      basePrice: '1050',
      finalPrice: '1180',
      winner: '钱七家庭农场',
      auctionDate: '2023-09-12',
      status: 'completed',
    },
  ];

  // 获取竞拍记录数据
  const fetchAuctionRecords = () => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  };

  // 搜索功能
  const handleSearch = (values) => {
    setFilters(values);
    // 实际项目中应该根据过滤条件调用API
    fetchAuctionRecords();
  };

  // 导出功能
  const handleExport = () => {
    message.success('导出成功');
    // 实际项目中应该实现导出逻辑
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 实际项目中应该跳转到详情页
    message.info(`查看竞拍记录：${record.auctionName}`);
  };

  // 状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="green">已完成</Tag>;
      case 'ongoing':
        return <Tag color="blue">进行中</Tag>;
      case 'cancelled':
        return <Tag color="red">已取消</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '竞拍名称',
      dataIndex: 'auctionName',
      key: 'auctionName',
      width: 200,
    },
    {
      title: '土地编号',
      dataIndex: 'landId',
      key: 'landId',
      width: 120,
    },
    {
      title: '土地面积(亩)',
      dataIndex: 'landArea',
      key: 'landArea',
      width: 100,
    },
    {
      title: '起拍价(元/亩)',
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 120,
    },
    {
      title: '成交价(元/亩)',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      width: 120,
    },
    {
      title: '中标方',
      dataIndex: 'winner',
      key: 'winner',
      width: 150,
    },
    {
      title: '竞拍日期',
      dataIndex: 'auctionDate',
      key: 'auctionDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchAuctionRecords();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title="竞拍记录管理" 
        extra={
          <Space>
            <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        }
      >
        {/* 搜索条件 */}
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
          <Space wrap size="middle">
            <div>
              <span style={{ marginRight: '8px' }}>竞拍名称：</span>
              <Search
                placeholder="请输入竞拍名称"
                allowClear
                style={{ width: 200 }}
                onSearch={(value) => handleSearch({ ...filters, auctionName: value })}
                onChange={(e) => setFilters({ ...filters, auctionName: e.target.value })}
              />
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>状态：</span>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: 120 }}
                onChange={(value) => setFilters({ ...filters, status: value })}
              >
                <Option value="completed">已完成</Option>
                <Option value="ongoing">进行中</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>竞拍日期：</span>
              <RangePicker 
                style={{ width: 250 }}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => fetchAuctionRecords()}
            >
              搜索
            </Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default AuctionRecord;