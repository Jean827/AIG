import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Input, Select, Tag, Space, message } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const PaymentHistory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    paymentNumber: '',
    contractNumber: '',
    contractor: '',
    paymentMethod: '',
    dateRange: [],
  });

  // 模拟数据
  const mockData = [
    {
      id: '1',
      paymentNumber: 'PY2023001',
      contractNumber: 'HT2023001',
      contractor: '张三农业合作社',
      paymentAmount: '40,000',
      paymentMethod: 'bankTransfer',
      paymentDate: '2023-06-01',
      operator: '管理员',
      remark: '首次付款',
    },
    {
      id: '2',
      paymentNumber: 'PY2023002',
      contractNumber: 'HT2023002',
      contractor: '李四家庭农场',
      paymentAmount: '44,096',
      paymentMethod: 'onlinePayment',
      paymentDate: '2023-07-05',
      operator: '管理员',
      remark: '一次性付清',
    },
    {
      id: '3',
      paymentNumber: 'PY2023003',
      contractNumber: 'HT2023003',
      contractor: '王五农业公司',
      paymentAmount: '20,000',
      paymentMethod: 'bankTransfer',
      paymentDate: '2023-07-20',
      operator: '管理员',
      remark: '首付',
    },
    {
      id: '4',
      paymentNumber: 'PY2023004',
      contractNumber: 'HT2023005',
      contractor: '钱七家庭农场',
      paymentAmount: '35,990',
      paymentMethod: 'onlinePayment',
      paymentDate: '2023-09-25',
      operator: '管理员',
      remark: '一次性付清',
    },
    {
      id: '5',
      paymentNumber: 'PY2023005',
      contractNumber: 'HT2023007',
      contractor: '周九家庭农场',
      paymentAmount: '15,000',
      paymentMethod: 'cash',
      paymentDate: '2023-10-08',
      operator: '管理员',
      remark: '首付',
    },
    {
      id: '6',
      paymentNumber: 'PY2023006',
      contractNumber: 'HT2023001',
      contractor: '张三农业合作社',
      paymentAmount: '28,025',
      paymentMethod: 'bankTransfer',
      paymentDate: '2023-11-15',
      operator: '管理员',
      remark: '尾款',
    },
  ];

  // 获取缴费历史数据
  const fetchPaymentHistory = () => {
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
    fetchPaymentHistory();
  };

  // 导出功能
  const handleExport = () => {
    message.success('导出成功');
    // 实际项目中应该实现导出逻辑
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 实际项目中应该跳转到详情页
    message.info(`查看缴费记录：${record.paymentNumber}`);
  };

  // 下载凭证
  const handleDownloadReceipt = (record) => {
    // 实际项目中应该实现下载逻辑
    message.success(`下载缴费凭证：${record.paymentNumber}`);
  };

  // 支付方式标签
  const getPaymentMethodTag = (method) => {
    switch (method) {
      case 'bankTransfer':
        return <Tag color="blue">银行转账</Tag>;
      case 'onlinePayment':
        return <Tag color="green">在线支付</Tag>;
      case 'cash':
        return <Tag color="orange">现金</Tag>;
      case 'other':
        return <Tag color="purple">其他</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '缴费编号',
      dataIndex: 'paymentNumber',
      key: 'paymentNumber',
      width: 150,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      width: 150,
    },
    {
      title: '承包人',
      dataIndex: 'contractor',
      key: 'contractor',
      width: 150,
    },
    {
      title: '缴费金额(元)',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      width: 120,
      sorter: (a, b) => {
        return parseFloat(a.paymentAmount.replace(/,/g, '')) - parseFloat(b.paymentAmount.replace(/,/g, ''));
      },
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method) => getPaymentMethodTag(method),
    },
    {
      title: '缴费日期',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      sorter: (a, b) => {
        return dayjs(a.paymentDate).unix() - dayjs(b.paymentDate).unix();
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
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
            icon={<DownloadOutlined />} 
            size="small" 
            onClick={() => handleDownloadReceipt(record)}
          >
            下载凭证
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title="已缴费信息查询" 
        extra={
          <Space>
            <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
              导出记录
            </Button>
          </Space>
        }
      >
        {/* 搜索条件 */}
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
          <Space wrap size="middle">
            <div>
              <span style={{ marginRight: '8px' }}>缴费编号：</span>
              <Search
                placeholder="请输入缴费编号"
                allowClear
                style={{ width: 200 }}
                onSearch={(value) => handleSearch({ ...filters, paymentNumber: value })}
                onChange={(e) => setFilters({ ...filters, paymentNumber: e.target.value })}
              />
            </div>
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
              <span style={{ marginRight: '8px' }}>承包人：</span>
              <Search
                placeholder="请输入承包人"
                allowClear
                style={{ width: 200 }}
                onSearch={(value) => handleSearch({ ...filters, contractor: value })}
                onChange={(e) => setFilters({ ...filters, contractor: e.target.value })}
              />
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>支付方式：</span>
              <Select
                placeholder="请选择支付方式"
                allowClear
                style={{ width: 120 }}
                onChange={(value) => setFilters({ ...filters, paymentMethod: value })}
              >
                <Option value="bankTransfer">银行转账</Option>
                <Option value="onlinePayment">在线支付</Option>
                <Option value="cash">现金</Option>
                <Option value="other">其他</Option>
              </Select>
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>缴费日期：</span>
              <RangePicker 
                style={{ width: 250 }}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => fetchPaymentHistory()}
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

export default PaymentHistory;