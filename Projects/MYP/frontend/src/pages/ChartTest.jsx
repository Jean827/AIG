import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'antd';

const data = [
  { name: '1月', 销量: 4000 },
  { name: '2月', 销量: 3000 },
  { name: '3月', 销量: 2000 },
  { name: '4月', 销量: 2780 },
  { name: '5月', 销量: 1890 },
  { name: '6月', 销量: 2390 },
];

const ChartTest = () => {
  return (
    <Card title="图表测试">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="销量" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ChartTest;