import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Select, Tag, Space, message, Statistic, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FundMonitoring = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fundType: '',
    dateRange: [dayjs().subtract(30, 'day'), dayjs()],
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentChart, setCurrentChart] = useState('line'); // line, bar, pie

  // 模拟资金流水数据
  const mockData = [
    {
      id: '1',
      transactionNumber: 'TX2023001',
      transactionType: 'income',
      fundType: 'landRental',
      amount: '40,000',
      transactionDate: '2023-06-01',
      sourceOrDestination: '张三农业合作社',
      relatedContract: 'HT2023001',
      remark: '土地租金',
    },
    {
      id: '2',
      transactionNumber: 'TX2023002',
      transactionType: 'expense',
      fundType: 'maintenance',
      amount: '5,000',
      transactionDate: '2023-06-10',
      sourceOrDestination: '农田维护服务公司',
      relatedContract: '',
      remark: '农田基础设施维护',
    },
    {
      id: '3',
      transactionNumber: 'TX2023003',
      transactionType: 'income',
      fundType: 'landRental',
      amount: '44,096',
      transactionDate: '2023-07-05',
      sourceOrDestination: '李四家庭农场',
      relatedContract: 'HT2023002',
      remark: '土地租金',
    },
    {
      id: '4',
      transactionNumber: 'TX2023004',
      transactionType: 'income',
      fundType: 'landRental',
      amount: '20,000',
      transactionDate: '2023-07-20',
      sourceOrDestination: '王五农业公司',
      relatedContract: 'HT2023003',
      remark: '土地租金',
    },
    {
      id: '5',
      transactionNumber: 'TX2023005',
      transactionType: 'expense',
      fundType: 'administration',
      amount: '2,500',
      transactionDate: '2023-08-01',
      sourceOrDestination: '办公用品供应商',
      relatedContract: '',
      remark: '办公用品采购',
    },
    {
      id: '6',
      transactionNumber: 'TX2023006',
      transactionType: 'income',
      fundType: 'landRental',
      amount: '35,990',
      transactionDate: '2023-09-25',
      sourceOrDestination: '钱七家庭农场',
      relatedContract: 'HT2023005',
      remark: '土地租金',
    },
    {
      id: '7',
      transactionNumber: 'TX2023007',
      transactionType: 'income',
      fundType: 'landRental',
      amount: '15,000',
      transactionDate: '2023-10-08',
      sourceOrDestination: '周九家庭农场',
      relatedContract: 'HT2023007',
      remark: '土地租金',
    },
    {
      id: '8',
      transactionNumber: 'TX2023008',
      transactionType: 'expense',
      fundType: 'maintenance',
      amount: '8,000',
      transactionDate: '2023-10-15',
      sourceOrDestination: '农田灌溉设备供应商',
      relatedContract: '',
      remark: '灌溉设备维修',
    },
    {
      id: '9',
      transactionNumber: 'TX2023009',
      transactionType: 'income',
      fundType: 'landRental',
      amount: '28,025',
      transactionDate: '2023-11-15',
      sourceOrDestination: '张三农业合作社',
      relatedContract: 'HT2023001',
      remark: '土地租金尾款',
    },
  ];

  // 计算统计数据
  const calculateStatistics = (data) => {
    const income = data
      .filter(item => item.transactionType === 'income')
      .reduce((sum, item) => sum + parseFloat(item.amount.replace(/,/g, '')), 0);
    
    const expense = data
      .filter(item => item.transactionType === 'expense')
      .reduce((sum, item) => sum + parseFloat(item.amount.replace(/,/g, '')), 0);
    
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  // 获取资金流水数据
  const fetchFundData = () => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setDataSource(mockData);
      calculateStatistics(mockData);
      setLoading(false);
    }, 500);
  };

  // 搜索功能
  const handleSearch = (values) => {
    setFilters(values);
    // 实际项目中应该根据过滤条件调用API
    fetchFundData();
  };

  // 导出功能
  const handleExport = () => {
    message.success('导出成功');
    // 实际项目中应该实现导出逻辑
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 实际项目中应该跳转到详情页
    message.info(`查看资金流水：${record.transactionNumber}`);
  };

  // 交易类型标签
  const getTransactionTypeTag = (type) => {
    switch (type) {
      case 'income':
        return <Tag color="green">收入</Tag>;
      case 'expense':
        return <Tag color="red">支出</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 资金类型标签
  const getFundTypeTag = (type) => {
    switch (type) {
      case 'landRental':
        return <Tag color="blue">土地租金</Tag>;
      case 'maintenance':
        return <Tag color="orange">维护费用</Tag>;
      case 'administration':
        return <Tag color="purple">管理费用</Tag>;
      case 'other':
        return <Tag color="gray">其他</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 生成图表数据
  const generateChartData = () => {
    // 按日期分组的收入支出数据
    const groupedData = {};
    mockData.forEach(item => {
      const date = item.transactionDate;
      if (!groupedData[date]) {
        groupedData[date] = { date, income: 0, expense: 0 };
      }
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      if (item.transactionType === 'income') {
        groupedData[date].income += amount;
      } else {
        groupedData[date].expense += amount;
      }
    });
    
    // 转换为数组并按日期排序
    const chartData = Object.values(groupedData).sort((a, b) => 
      dayjs(a.date).unix() - dayjs(b.date).unix()
    );
    
    return chartData;
  };

  // 生成饼图数据
  const generatePieChartData = () => {
    // 按资金类型分组
    const typeData = {};
    mockData.forEach(item => {
      if (!typeData[item.fundType]) {
        typeData[item.fundType] = 0;
      }
      typeData[item.fundType] += parseFloat(item.amount.replace(/,/g, ''));
    });
    
    // 转换为饼图需要的格式
    const fundTypeLabels = {
      landRental: '土地租金',
      maintenance: '维护费用',
      administration: '管理费用',
      other: '其他'
    };
    
    return Object.entries(typeData).map(([type, value]) => ({
      type: fundTypeLabels[type] || type,
      value,
    }));
  };

  // 表格列配置
  const columns = [
    {
      title: '交易编号',
      dataIndex: 'transactionNumber',
      key: 'transactionNumber',
      width: 150,
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 80,
      render: (type) => getTransactionTypeTag(type),
    },
    {
      title: '资金类型',
      dataIndex: 'fundType',
      key: 'fundType',
      width: 100,
      render: (type) => getFundTypeTag(type),
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value, record) => (
        <span style={{ color: record.transactionType === 'income' ? 'green' : 'red' }}>
          {record.transactionType === 'income' ? '+' : '-'}{value}
        </span>
      ),
      sorter: (a, b) => {
        const amountA = parseFloat(a.amount.replace(/,/g, '')) * (a.transactionType === 'income' ? 1 : -1);
        const amountB = parseFloat(b.amount.replace(/,/g, '')) * (b.transactionType === 'income' ? 1 : -1);
        return amountA - amountB;
      },
    },
    {
      title: '交易日期',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 120,
      sorter: (a, b) => {
        return dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix();
      },
    },
    {
      title: '来源/去向',
      dataIndex: 'sourceOrDestination',
      key: 'sourceOrDestination',
      width: 150,
    },
    {
      title: '关联合同',
      dataIndex: 'relatedContract',
      key: 'relatedContract',
      width: 120,
      render: (contract) => contract || '-',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          size="small" 
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 图表配置
  const lineConfig = {
    data: generateChartData(),
    xField: 'date',
    yField: ['income', 'expense'],
    seriesField: 'type',
    point: {
      size: 5,
      shape: 'diamond',
    },
    legend: {
      position: 'top',
    },
  };

  const barConfig = {
    data: generateChartData(),
    xField: 'date',
    yField: ['income', 'expense'],
    seriesField: 'type',
    legend: {
      position: 'top',
    },
  };

  const pieConfig = {
    data: generatePieChartData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  useEffect(() => {
    fetchFundData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card title="资金流向监控">
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={8}>
            <Card>
              <Statistic 
                title="总收入" 
                value={totalIncome} 
                precision={2}
                suffix="元" 
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="总支出" 
                value={totalExpense} 
                precision={2}
                suffix="元" 
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="净收入" 
                value={totalIncome - totalExpense} 
                precision={2}
                suffix="元" 
                valueStyle={{ color: totalIncome - totalExpense > 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表展示区 */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>资金趋势分析</h3>
            <Space>
              <Button 
                type={currentChart === 'line' ? 'primary' : 'default'} 
                icon={<LineChartOutlined />} 
                onClick={() => setCurrentChart('line')}
              >
                折线图
              </Button>
              <Button 
                type={currentChart === 'bar' ? 'primary' : 'default'} 
                icon={<BarChartOutlined />} 
                onClick={() => setCurrentChart('bar')}
              >
                柱状图
              </Button>
              <Button 
                type={currentChart === 'pie' ? 'primary' : 'default'} 
                icon={<PieChartOutlined />} 
                onClick={() => setCurrentChart('pie')}
              >
                饼图
              </Button>
            </Space>
          </div>
          <div style={{ height: '400px' }}>
            {currentChart === 'line' && <Line {...lineConfig} />}
            {currentChart === 'bar' && <Bar {...barConfig} />}
            {currentChart === 'pie' && <Pie {...pieConfig} />}
          </div>
        </Card>

        {/* 搜索条件 */}
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
          <Space wrap size="middle">
            <div>
              <span style={{ marginRight: '8px' }}>资金类型：</span>
              <Select
                placeholder="请选择资金类型"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => setFilters({ ...filters, fundType: value })}
              >
                <Option value="landRental">土地租金</Option>
                <Option value="maintenance">维护费用</Option>
                <Option value="administration">管理费用</Option>
                <Option value="other">其他</Option>
              </Select>
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>交易日期：</span>
              <RangePicker 
                style={{ width: 250 }}
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => fetchFundData()}
            >
              查询
            </Button>
            <Button 
              type="primary" 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出记录
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

export default FundMonitoring;