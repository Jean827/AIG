import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Input, Select, Tag, Space, message, Progress } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const ContractExecution = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    contractNumber: '',
    status: '',
    dateRange: [],
  });

  // 模拟数据
  const mockData = [
    {
      id: '1',
      contractNumber: 'HT2023001',
      auctionName: '2023年度第一批次农田竞拍',
      contractor: '张三农业合作社',
      landId: 'LD2023001',
      landArea: '50.5',
      contractAmount: '68,025',
      paymentStatus: 'partiallyPaid',
      executionStatus: 'inProgress',
      progress: 60,
      startDate: '2023-05-20',
      endDate: '2024-05-19',
    },
    {
      id: '2',
      contractNumber: 'HT2023002',
      auctionName: '2023年度第二批次农田竞拍',
      contractor: '李四家庭农场',
      landId: 'LD2023002',
      landArea: '35.2',
      contractAmount: '44,096',
      paymentStatus: 'fullyPaid',
      executionStatus: 'completed',
      progress: 100,
      startDate: '2023-06-25',
      endDate: '2024-06-24',
    },
    {
      id: '3',
      contractNumber: 'HT2023003',
      auctionName: '2023年度第三批次农田竞拍',
      contractor: '王五农业公司',
      landId: 'LD2023003',
      landArea: '42.8',
      contractAmount: '53,500',
      paymentStatus: 'partiallyPaid',
      executionStatus: 'inProgress',
      progress: 45,
      startDate: '2023-07-15',
      endDate: '2024-07-14',
    },
    {
      id: '4',
      contractNumber: 'HT2023004',
      auctionName: '2023年度第四批次农田竞拍',
      contractor: '赵六农业合作社',
      landId: 'LD2023004',
      landArea: '60.1',
      contractAmount: '87,145',
      paymentStatus: 'unpaid',
      executionStatus: 'notStarted',
      progress: 0,
      startDate: '2023-08-10',
      endDate: '2024-08-09',
    },
    {
      id: '5',
      contractNumber: 'HT2023005',
      auctionName: '2023年度第五批次农田竞拍',
      contractor: '钱七家庭农场',
      landId: 'LD2023005',
      landArea: '30.5',
      contractAmount: '35,990',
      paymentStatus: 'fullyPaid',
      executionStatus: 'inProgress',
      progress: 75,
      startDate: '2023-09-17',
      endDate: '2024-09-16',
    },
  ];

  // 获取合同执行数据
  const fetchContractExecutions = () => {
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
    fetchContractExecutions();
  };

  // 导出功能
  const handleExport = () => {
    message.success('导出成功');
    // 实际项目中应该实现导出逻辑
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 实际项目中应该跳转到详情页
    message.info(`查看合同执行：${record.contractNumber}`);
  };

  // 更新进度
  const handleUpdateProgress = (record) => {
    // 实际项目中应该打开更新进度的弹窗
    message.info(`更新合同进度：${record.contractNumber}`);
  };

  // 支付状态标签
  const getPaymentStatusTag = (status) => {
    switch (status) {
      case 'fullyPaid':
        return <Tag color="green">已付清</Tag>;
      case 'partiallyPaid':
        return <Tag color="orange">部分支付</Tag>;
      case 'unpaid':
        return <Tag color="red">未支付</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 执行状态标签
  const getExecutionStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="green">已完成</Tag>;
      case 'inProgress':
        return <Tag color="blue">进行中</Tag>;
      case 'notStarted':
        return <Tag color="gray">未开始</Tag>;
      case 'delayed':
        return <Tag color="red">已延迟</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      width: 150,
    },
    {
      title: '竞拍名称',
      dataIndex: 'auctionName',
      key: 'auctionName',
      width: 200,
    },
    {
      title: '承包人',
      dataIndex: 'contractor',
      key: 'contractor',
      width: 150,
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
      title: '合同金额(元)',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      width: 120,
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status) => getPaymentStatusTag(status),
    },
    {
      title: '执行状态',
      dataIndex: 'executionStatus',
      key: 'executionStatus',
      width: 100,
      render: (status) => getExecutionStatusTag(status),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress) => (
        <div>
          <Progress percent={progress} showInfo />
        </div>
      ),
    },
    {
      title: '合同期限',
      key: 'contractTerm',
      width: 180,
      render: (_, record) => `${record.startDate} ~ ${record.endDate}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleUpdateProgress(record)}
          >
            更新进度
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchContractExecutions();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title="合同执行管理" 
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
              <span style={{ marginRight: '8px' }}>合同编号：</span>
              <Search
                placeholder="请输入合同编号"
                allowClear
                style={{ width: 200 }}
                onSearch={(value) => handleSearch({ ...filters, contractNumber: value })}
                onChange={(e) => setFilters({ ...filters, contractNumber: e.target.value })}
              />
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>执行状态：</span>
              <Select
                placeholder="请选择执行状态"
                allowClear
                style={{ width: 120 }}
                onChange={(value) => setFilters({ ...filters, status: value })}
              >
                <Option value="completed">已完成</Option>
                <Option value="inProgress">进行中</Option>
                <Option value="notStarted">未开始</Option>
                <Option value="delayed">已延迟</Option>
              </Select>
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>合同期限：</span>
              <RangePicker 
                style={{ width: 250 }}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => fetchContractExecutions()}
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
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
};

export default ContractExecution;