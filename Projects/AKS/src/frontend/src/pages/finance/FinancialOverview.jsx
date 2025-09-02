import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Select, Button, Input, Tag, message, Tabs, Progress, Avatar } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined, CalendarOutlined, FilterOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import '../styles.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinancialOverview = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year, custom
  const [dateRange, setDateRange] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date())
  ]);
  const [organization, setOrganization] = useState('');
  const [financialStats, setFinancialStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0,
    incomeGrowth: 0,
    expenseGrowth: 0
  });
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [financialHealth, setFinancialHealth] = useState({ score: 0, status: '' });
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [orgOptions, setOrgOptions] = useState([]);
  const [activeTabKey, setActiveTabKey] = '1';

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟组织数据
    setOrgOptions([
      { id: 'all', name: '全部组织' },
      { id: '1', name: '阿克苏农场有限公司' },
      { id: '2', name: '新疆棉花种植合作社' },
      { id: '3', name: '阿克苏小麦农场' }
    ]);

    // 模拟获取财务数据
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟财务统计数据
        const stats = {
          totalIncome: 1850000,
          totalExpense: 920000,
          netIncome: 930000,
          incomeGrowth: 15.3,
          expenseGrowth: 8.7
        };
        setFinancialStats(stats);

        // 模拟收入分类数据
        setIncomeCategories([
          { name: '土地租金', value: 850000, percentage: 45.95 },
          { name: '农产品销售收入', value: 420000, percentage: 22.7 },
          { name: '农业服务收入', value: 280000, percentage: 15.14 },
          { name: '政府补贴', value: 180000, percentage: 9.73 },
          { name: '其他收入', value: 120000, percentage: 6.48 }
        ]);

        // 模拟支出分类数据
        setExpenseCategories([
          { name: '土地成本', value: 320000, percentage: 34.78 },
          { name: '生产成本', value: 280000, percentage: 30.43 },
          { name: '人员工资', value: 180000, percentage: 19.57 },
          { name: '管理费用', value: 80000, percentage: 8.7 },
          { name: '其他支出', value: 60000, percentage: 6.52 }
        ]);

        // 模拟最近交易记录
        setRecentTransactions([
          {
            id: '1',
            type: '收入',
            category: '土地租金',
            amount: 580000,
            date: '2023-03-05',
            description: '阿克苏三号地块土地租赁合同租金',
            relatedParty: '张三',
            status: '已完成',
            documentType: '收据',
            documentNumber: 'REC-2023-001'
          },
          {
            id: '2',
            type: '支出',
            category: '生产成本',
            amount: 150000,
            date: '2023-03-02',
            description: '购买化肥农药',
            relatedParty: '农资供应商',
            status: '已完成',
            documentType: '发票',
            documentNumber: 'INV-2023-001'
          },
          {
            id: '3',
            type: '收入',
            category: '农产品销售收入',
            amount: 220000,
            date: '2023-02-28',
            description: '2023年冬季农产品销售收入',
            relatedParty: '农产品经销商',
            status: '已完成',
            documentType: '收据',
            documentNumber: 'REC-2023-002'
          },
          {
            id: '4',
            type: '支出',
            category: '人员工资',
            amount: 90000,
            date: '2023-02-25',
            description: '2月份员工工资',
            relatedParty: '员工工资账户',
            status: '已完成',
            documentType: '工资单',
            documentNumber: 'PAY-2023-002'
          },
          {
            id: '5',
            type: '收入',
            category: '政府补贴',
            amount: 180000,
            date: '2023-02-20',
            description: '2023年农业补贴',
            relatedParty: '阿克苏农业局',
            status: '已完成',
            documentType: '补贴凭证',
            documentNumber: 'SUB-2023-001'
          },
          {
            id: '6',
            type: '支出',
            category: '管理费用',
            amount: 40000,
            date: '2023-02-15',
            description: '办公室租金及水电费',
            relatedParty: '物业公司',
            status: '已完成',
            documentType: '发票',
            documentNumber: 'INV-2023-002'
          },
          {
            id: '7',
            type: '支出',
            category: '土地成本',
            amount: 160000,
            date: '2023-02-10',
            description: '土地使用权转让费',
            relatedParty: '土地管理部门',
            status: '已完成',
            documentType: '收据',
            documentNumber: 'REC-2023-003'
          },
          {
            id: '8',
            type: '收入',
            category: '农业服务收入',
            amount: 120000,
            date: '2023-02-05',
            description: '农业技术咨询服务收入',
            relatedParty: '当地农户',
            status: '进行中',
            documentType: '服务协议',
            documentNumber: 'SVC-2023-001'
          }
        ]);

        // 模拟财务健康状况
        const healthScore = 85;
        let healthStatus = '';
        if (healthScore >= 80) {
          healthStatus = '健康';
        } else if (healthScore >= 60) {
          healthStatus = '良好';
        } else if (healthScore >= 40) {
          healthStatus = '一般';
        } else {
          healthStatus = '需关注';
        }
        setFinancialHealth({ score: healthScore, status: healthStatus });

        // 模拟时间序列数据（近6个月）
        const monthsData = [];
        for (let i = 5; i >= 0; i--) {
          const monthDate = subMonths(new Date(), i);
          const monthName = format(monthDate, 'yyyy年MM月', { locale: zhCN });
          
          // 模拟月度数据
          const income = Math.floor(150000 + Math.random() * 800000);
          const expense = Math.floor(100000 + Math.random() * 500000);
          
          monthsData.push({
            month: monthName,
            income,
            expense,
            profit: income - expense
          });
        }
        setTimeSeriesData(monthsData);
      } catch (error) {
        console.error('获取财务数据失败:', error);
        message.error('获取财务数据失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [timeRange, dateRange, organization]);

  // 处理时间范围变更
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    let newDateRange = [];
    
    switch (value) {
      case 'month':
        newDateRange = [startOfMonth(new Date()), endOfMonth(new Date())];
        break;
      case 'quarter':
        // 获取当前季度的开始和结束日期
        const currentMonth = new Date().getMonth();
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        const quarterStart = new Date(new Date().getFullYear(), quarterStartMonth, 1);
        const quarterEnd = new Date(new Date().getFullYear(), quarterStartMonth + 3, 0);
        newDateRange = [quarterStart, quarterEnd];
        break;
      case 'year':
        newDateRange = [
          new Date(new Date().getFullYear(), 0, 1),
          new Date(new Date().getFullYear(), 11, 31)
        ];
        break;
      case 'custom':
        // 保持当前自定义日期范围
        return;
      default:
        newDateRange = [startOfMonth(new Date()), endOfMonth(new Date())];
    }
    
    setDateRange(newDateRange);
  };

  // 处理自定义日期范围变更
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setTimeRange('custom');
    }
  };

  // 处理组织变更
  const handleOrganizationChange = (value) => {
    setOrganization(value);
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    // 重新获取数据
    setTimeout(() => {
      // 这里应该重新调用API获取数据
      message.success('数据刷新成功');
      setLoading(false);
    }, 800);
  };

  // 导出数据
  const handleExport = () => {
    message.success('数据导出成功');
  };

  // 表格列定义
  const transactionColumns = [
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => (
        <Tag color={type === '收入' ? '#52c41a' : '#faad14'}>
          {type}
        </Tag>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount, record) => (
        <span style={{ color: record.type === '收入' ? '#52c41a' : '#faad14' }}>
          {record.type === '收入' ? '+' : '-'}{amount.toLocaleString()}
        </span>
      )
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120
    },
    {
      title: '摘要',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '对方单位',
      dataIndex: 'relatedParty',
      key: 'relatedParty',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === '已完成' ? '#1890ff' : '#fa8c16'}>
          {status}
        </Tag>
      )
    },
    {
      title: '单据信息',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width: 150,
      render: (number, record) => (
        <span>
          {record.documentType}：{number}
        </span>
      )
    }
  ];

  // 获取统计项的增长趋势图标
  const getGrowthIcon = (growthRate) => {
    if (growthRate > 0) {
      return <ArrowUpOutlined className="up-icon" />;
    } else if (growthRate < 0) {
      return <ArrowDownOutlined className="down-icon" />;
    }
    return null;
  };

  // 获取财务健康状态颜色
  const getHealthStatusColor = (status) => {
    switch (status) {
      case '健康':
        return '#52c41a';
      case '良好':
        return '#1890ff';
      case '一般':
        return '#faad14';
      case '需关注':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">财务总览</h1>
        <div className="action-buttons">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出报表
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 12 }}
            icon={<SearchOutlined />}
            onClick={handleRefresh}
          >
            刷新数据
          </Button>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card className="filter-card">
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={8} md={4}>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="month">本月</Option>
              <Option value="quarter">本季度</Option>
              <Option value="year">本年度</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Col>
          {(timeRange === 'custom') && (
            <Col xs={24} sm={16} md={10}>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ width: '100%' }}
              />
            </Col>
          )}
          <Col xs={24} sm={8} md={4} offset={timeRange === 'custom' ? 0 : 6}>
            <Select
              value={organization}
              onChange={handleOrganizationChange}
              style={{ width: '100%' }}
              placeholder="选择组织"
            >
              {orgOptions.map(option => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 关键指标 */}
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总收入"
              value={financialStats.totalIncome}
              prefix={<DollarOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => value.toLocaleString()}
              extra={
                <div className="growth-info">
                  {getGrowthIcon(financialStats.incomeGrowth)}
                  <span className={financialStats.incomeGrowth >= 0 ? 'up-text' : 'down-text'}>
                    {Math.abs(financialStats.incomeGrowth)}%
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总支出"
              value={financialStats.totalExpense}
              prefix={<DollarOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => value.toLocaleString()}
              extra={
                <div className="growth-info">
                  {getGrowthIcon(financialStats.expenseGrowth)}
                  <span className={financialStats.expenseGrowth >= 0 ? 'up-text' : 'down-text'}>
                    {Math.abs(financialStats.expenseGrowth)}%
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="净利润"
              value={financialStats.netIncome}
              prefix={<DollarOutlined />}
              suffix=" 元"
              valueStyle={{ color: financialStats.netIncome >= 0 ? '#1890ff' : '#ff4d4f' }}
              formatter={(value) => value.toLocaleString()}
              extra={
                <div className="profit-margin">
                  利润率: {financialStats.totalIncome > 0 ? 
                    ((financialStats.netIncome / financialStats.totalIncome) * 100).toFixed(1) : 0}%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="财务健康度"
              value={financialHealth.score}
              suffix=" 分"
              valueStyle={{ color: getHealthStatusColor(financialHealth.status) }}
              extra={
                <div>
                  <Progress
                    percent={financialHealth.score}
                    strokeColor={getHealthStatusColor(financialHealth.status)}
                    size="small"
                    showInfo={false}
                  />
                  <div className="health-status" style={{ color: getHealthStatusColor(financialHealth.status) }}>
                    {financialHealth.status}
                  </div>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={[
          {
            key: '1',
            label: '收支趋势',
            icon: <LineChartOutlined />
          },
          {
            key: '2',
            label: '收支分类',
            icon: <PieChartOutlined />
          },
          {
            key: '3',
            label: '最近交易',
            icon: <BarChartOutlined />
          }
        ]}
      >
        {/* 收支趋势图表 */}
        <div className="chart-container">
          {activeTabKey === '1' && (
            <Card className="chart-card">
              <div className="chart-placeholder">
                <div className="chart-title">收支趋势分析</div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#1890ff' }}></span>
                    <span className="legend-text">收入</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#faad14' }}></span>
                    <span className="legend-text">支出</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#52c41a' }}></span>
                    <span className="legend-text">利润</span>
                  </div>
                </div>
                <div className="chart-content">
                  {/* 这里应该是实际的图表组件 */}
                  {/* 为了演示，使用模拟数据创建简单的条形图 */}
                  <div className="mock-chart">
                    {timeSeriesData.map((item, index) => (
                      <div key={index} className="chart-bar-group">
                        <div className="chart-bar-label">{item.month}</div>
                        <div className="chart-bars">
                          <div 
                            className="chart-bar income"
                            style={{ height: `${Math.min(item.income / 10000, 100)}%` }}
                            title={`收入: ${item.income.toLocaleString()} 元`}
                          >
                            {item.income.toLocaleString()}
                          </div>
                          <div 
                            className="chart-bar expense"
                            style={{ height: `${Math.min(item.expense / 10000, 100)}%` }}
                            title={`支出: ${item.expense.toLocaleString()} 元`}
                          >
                            {item.expense.toLocaleString()}
                          </div>
                          <div 
                            className="chart-bar profit"
                            style={{ height: `${Math.min(item.profit / 10000, 100)}%` }}
                            title={`利润: ${item.profit.toLocaleString()} 元`}
                          >
                            {item.profit.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 收支分类图表 */}
          {activeTabKey === '2' && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card className="chart-card">
                  <div className="chart-placeholder">
                    <div className="chart-title">收入分类</div>
                    <div className="pie-chart-placeholder">
                      {/* 实际项目中应该使用真实的饼图组件 */}
                      <div className="pie-chart-simulated income-pie">
                        {incomeCategories.map((category, index) => (
                          <div 
                            key={index} 
                            className="pie-slice"
                            style={{ 
                              transform: `rotate(${index > 0 ? 
                                incomeCategories.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0) * 3.6 : 0}deg)`,
                              background: `hsl(${index * 60}, 70%, 60%)`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="chart-legend">
                      {incomeCategories.map((category, index) => (
                        <div key={index} className="legend-item">
                          <span 
                            className="legend-color" 
                            style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                          ></span>
                          <span className="legend-text">{category.name}</span>
                          <span className="legend-value">{category.value.toLocaleString()}元 ({category.percentage.toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card className="chart-card">
                  <div className="chart-placeholder">
                    <div className="chart-title">支出分类</div>
                    <div className="pie-chart-placeholder">
                      {/* 实际项目中应该使用真实的饼图组件 */}
                      <div className="pie-chart-simulated expense-pie">
                        {expenseCategories.map((category, index) => (
                          <div 
                            key={index} 
                            className="pie-slice"
                            style={{ 
                              transform: `rotate(${index > 0 ? 
                                expenseCategories.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0) * 3.6 : 0}deg)`,
                              background: `hsl(${(index * 60) + 180}, 70%, 60%)`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="chart-legend">
                      {expenseCategories.map((category, index) => (
                        <div key={index} className="legend-item">
                          <span 
                            className="legend-color" 
                            style={{ backgroundColor: `hsl(${(index * 60) + 180}, 70%, 60%)` }}
                          ></span>
                          <span className="legend-text">{category.name}</span>
                          <span className="legend-value">{category.value.toLocaleString()}元 ({category.percentage.toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          )}

          {/* 最近交易表格 */}
          {activeTabKey === '3' && (
            <Card className="table-card">
              <Table
                columns={transactionColumns}
                dataSource={recentTransactions}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条交易记录`,
                  size: 'middle'
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          )}
        </div>
      </Tabs>

      {/* 财务预警和建议 */}
      <Card className="insights-card">
        <h2 className="card-title">财务洞察与建议</h2>
        <div className="insights-content">
          <div className="insight-item">
            <div className="insight-icon">
              <LineChartOutlined className="icon" />
            </div>
            <div className="insight-content">
              <h3 className="insight-title">收入增长趋势良好</h3>
              <p className="insight-text">与上月相比，本月收入增长了{financialStats.incomeGrowth}%，主要来自土地租金和农产品销售收入的增长。</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon">
              <BarChartOutlined className="icon" />
            </div>
            <div className="insight-content">
              <h3 className="insight-title">成本控制有效</h3>
              <p className="insight-text">支出增长率{financialStats.expenseGrowth}%低于收入增长率，净利润率达到{financialStats.totalIncome > 0 ? 
                ((financialStats.netIncome / financialStats.totalIncome) * 100).toFixed(1) : 0}%，处于健康水平。</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon">
              <PieChartOutlined className="icon" />
            </div>
            <div className="insight-content">
              <h3 className="insight-title">收入结构优化建议</h3>
              <p className="insight-text">当前收入过度依赖土地租金（占比{incomeCategories[0]?.percentage || 0}%），建议多元化收入来源，增加农业服务收入占比。</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialOverview;