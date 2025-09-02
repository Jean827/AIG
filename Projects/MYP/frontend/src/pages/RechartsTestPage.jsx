import React from 'react';
import { Card, Row, Col, Divider } from 'antd';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  LineChartOutlined, BarChartOutlined, PieChartOutlined, AreaChartOutlined
} from '@ant-design/icons';
import './RechartsTestPage.css';

const RechartsTestPage = () => {
  // 示例数据
  const lineData = [
    { name: '1月', 销量: 4000, 收入: 2400, 利润: 1800 },
    { name: '2月', 销量: 3000, 收入: 2210, 利润: 1600 },
    { name: '3月', 销量: 2000, 收入: 2290, 利润: 1500 },
    { name: '4月', 销量: 2780, 收入: 2500, 利润: 1700 },
    { name: '5月', 销量: 1890, 收入: 2181, 利润: 1400 },
    { name: '6月', 销量: 2390, 收入: 2500, 利润: 1600 },
    { name: '7月', 销量: 3490, 收入: 2100, 利润: 1900 },
  ];

  const barData = [
    { name: '苹果', A: 4000, B: 2400, C: 2400 },
    { name: '香蕉', A: 3000, B: 1398, C: 2210 },
    { name: '橙子', A: 2000, B: 9800, C: 2290 },
    { name: '葡萄', A: 2780, B: 3908, C: 2000 },
    { name: '草莓', A: 1890, B: 4800, C: 2181 },
  ];

  const pieData = [
    { name: '红色', value: 400 },
    { name: '蓝色', value: 300 },
    { name: '绿色', value: 300 },
    { name: '黄色', value: 200 },
  ];

  const areaData = [
    { name: '1月', 预测: 4000, 实际: 2400 },
    { name: '2月', 预测: 3000, 实际: 2210 },
    { name: '3月', 预测: 2000, 实际: 2290 },
    { name: '4月', 预测: 2780, 实际: 3908 },
    { name: '5月', 预测: 1890, 实际: 4800 },
    { name: '6月', 预测: 2390, 实际: 3800 },
    { name: '7月', 预测: 3490, 实际: 4300 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="recharts-test-page">
      <h1>Recharts 功能测试页面</h1>
      <Divider />
      
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {/* 折线图 */}
        <Col span={24} lg={12}>
          <Card title="折线图" extra={<LineChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="销量" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="收入" stroke="#82ca9d" />
                <Line type="monotone" dataKey="利润" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 柱状图 */}
        <Col span={24} lg={12}>
          <Card title="柱状图" extra={<BarChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="A" fill="#8884d8" />
                <Bar dataKey="B" fill="#82ca9d" />
                <Bar dataKey="C" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 饼图 */}
        <Col span={24} lg={12}>
          <Card title="饼图" extra={<PieChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 面积图 */}
        <Col span={24} lg={12}>
          <Card title="面积图" extra={<AreaChartOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="预测" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="实际" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RechartsTestPage;