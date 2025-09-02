import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import { BarChartOutlined, PieChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  // 图表数据
  const [tenantGrowthData, setTenantGrowthData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  // 颜色配置
  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];

  useEffect(() => {
    // 模拟租户增长数据（最近6个月）
    setTenantGrowthData([
      { month: '1月', count: 12 },
      { month: '2月', count: 19 },
      { month: '3月', count: 25 },
      { month: '4月', count: 32 },
      { month: '5月', count: 45 },
      { month: '6月', count: 58 },
    ]);

    // 模拟产品类别数据
    setProductCategoryData([
      { name: '电子设备', value: 45 },
      { name: '办公用品', value: 25 },
      { name: '家具', value: 15 },
      { name: '服装', value: 10 },
      { name: '其他', value: 5 },
    ]);

    // 模拟订单状态数据
    setOrderStatusData([
      { name: '已完成', value: 65 },
      { name: '处理中', value: 20 },
      { name: '已取消', value: 10 },
      { name: '待支付', value: 5 },
    ]);
  }, []);

  return (
    <div className="dashboard">
      <h1>仪表盘</h1>

      {/* 数据可视化区域 */}
      <Row gutter={16} className="dashboard-charts" style={{ marginBottom: '24px' }}>
        {/* 租户增长趋势图 */}
        <Col xs={24} lg={12} xl={8}>
          <Card title="租户增长趋势" className="chart-card" extra={<LineChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tenantGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#1890ff" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 产品类别分布图 */}
        <Col xs={24} lg={12} xl={8}>
          <Card title="产品类别分布" className="chart-card" extra={<PieChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 订单状态统计图 */}
        <Col xs={24} lg={12} xl={8}>
          <Card title="订单状态统计" className="chart-card" extra={<BarChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="数量">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;