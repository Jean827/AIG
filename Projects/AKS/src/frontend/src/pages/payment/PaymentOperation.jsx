import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Input, Select, Tag, Space, message, Modal, Form, InputNumber } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, DollarOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const PaymentOperation = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    contractNumber: '',
    contractor: '',
    paymentStatus: '',
    dateRange: [],
  });
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);
  const [paymentForm] = Form.useForm();

  // 模拟数据 - 待缴费合同列表
  const mockData = [
    {
      id: '1',
      contractNumber: 'HT2023001',
      contractor: '张三农业合作社',
      landId: 'LD2023001',
      landArea: '50.5',
      totalAmount: '68,025',
      paidAmount: '40,000',
      remainingAmount: '28,025',
      paymentStatus: 'partiallyPaid',
      dueDate: '2023-12-31',
    },
    {
      id: '2',
      contractNumber: 'HT2023003',
      contractor: '王五农业公司',
      landId: 'LD2023003',
      landArea: '42.8',
      totalAmount: '53,500',
      paidAmount: '20,000',
      remainingAmount: '33,500',
      paymentStatus: 'partiallyPaid',
      dueDate: '2023-12-15',
    },
    {
      id: '3',
      contractNumber: 'HT2023004',
      contractor: '赵六农业合作社',
      landId: 'LD2023004',
      landArea: '60.1',
      totalAmount: '87,145',
      paidAmount: '0',
      remainingAmount: '87,145',
      paymentStatus: 'unpaid',
      dueDate: '2023-11-30',
    },
    {
      id: '4',
      contractNumber: 'HT2023006',
      contractor: '孙八农业集团',
      landId: 'LD2023006',
      landArea: '45.3',
      totalAmount: '56,625',
      paidAmount: '0',
      remainingAmount: '56,625',
      paymentStatus: 'unpaid',
      dueDate: '2023-12-20',
    },
    {
      id: '5',
      contractNumber: 'HT2023007',
      contractor: '周九家庭农场',
      landId: 'LD2023007',
      landArea: '28.7',
      totalAmount: '33,005',
      paidAmount: '15,000',
      remainingAmount: '18,005',
      paymentStatus: 'partiallyPaid',
      dueDate: '2023-11-25',
    },
  ];

  // 获取待缴费合同数据
  const fetchContracts = () => {
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
    fetchContracts();
  };

  // 导出功能
  const handleExport = () => {
    message.success('导出成功');
    // 实际项目中应该实现导出逻辑
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 实际项目中应该跳转到详情页
    message.info(`查看合同详情：${record.contractNumber}`);
  };

  // 打开缴费弹窗
  const handleOpenPaymentModal = (record) => {
    setCurrentContract(record);
    paymentForm.setFieldsValue({
      contractNumber: record.contractNumber,
      contractor: record.contractor,
      paymentAmount: 0,
      paymentMethod: '',
      paymentDate: dayjs(),
      remark: '',
    });
    setPaymentModalVisible(true);
  };

  // 关闭缴费弹窗
  const handleClosePaymentModal = () => {
    setPaymentModalVisible(false);
    paymentForm.resetFields();
  };

  // 提交缴费信息
  const handleSubmitPayment = () => {
    paymentForm.validateFields()
      .then(values => {
        // 模拟API请求
        setLoading(true);
        setTimeout(() => {
          message.success('缴费成功');
          setPaymentModalVisible(false);
          paymentForm.resetFields();
          fetchContracts(); // 重新获取数据
          setLoading(false);
        }, 500);
      })
      .catch(info => {
        message.error('表单验证失败');
      });
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

  // 表格列配置
  const columns = [
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
      title: '合同总金额(元)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
    },
    {
      title: '已支付金额(元)',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
    },
    {
      title: '待支付金额(元)',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      width: 120,
      render: (value, record) => (
        <span style={{ color: record.paymentStatus === 'unpaid' ? 'red' : '' }}>
          {value}
        </span>
      ),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status) => getPaymentStatusTag(status),
    },
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date) => {
        const dueDate = dayjs(date);
        const today = dayjs();
        const isOverdue = dueDate.isBefore(today, 'day');
        return (
          <span style={{ color: isOverdue ? 'red' : '' }}>
            {date}
            {isOverdue && ' (已逾期)'.replace(/\s+/g, '\u00A0')}
          </span>
        );
      },
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
            type="primary" 
            icon={<DollarOutlined />} 
            size="small" 
            onClick={() => handleOpenPaymentModal(record)}
          >
            缴费
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title="缴费操作" 
        extra={
          <Space>
            <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
              导出待缴费列表
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
              <span style={{ marginRight: '8px' }}>支付状态：</span>
              <Select
                placeholder="请选择支付状态"
                allowClear
                style={{ width: 120 }}
                onChange={(value) => setFilters({ ...filters, paymentStatus: value })}
              >
                <Option value="unpaid">未支付</Option>
                <Option value="partiallyPaid">部分支付</Option>
              </Select>
            </div>
            <div>
              <span style={{ marginRight: '8px' }}>到期日期：</span>
              <RangePicker 
                style={{ width: 250 }}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => fetchContracts()}
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
          scroll={{ x: 1400 }}
        />

        {/* 缴费弹窗 */}
        <Modal
          title="缴费操作"
          open={paymentModalVisible}
          onOk={handleSubmitPayment}
          onCancel={handleClosePaymentModal}
          okText="确认缴费"
          cancelText="取消"
          confirmLoading={loading}
          width={600}
        >
          <Form
            form={paymentForm}
            layout="vertical"
            initialValues={{
              paymentDate: dayjs(),
            }}
          >
            <Form.Item
              name="contractNumber"
              label="合同编号"
              rules={[{ required: true, message: '请输入合同编号' }]}
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item
              name="contractor"
              label="承包人"
              rules={[{ required: true, message: '请输入承包人' }]}
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item
              name="totalAmount"
              label="合同总金额"
            >
              <Input 
                disabled 
                value={currentContract ? `${currentContract.totalAmount} 元` : ''}
              />
            </Form.Item>
            
            <Form.Item
              name="paidAmount"
              label="已支付金额"
            >
              <Input 
                disabled 
                value={currentContract ? `${currentContract.paidAmount} 元` : ''}
              />
            </Form.Item>
            
            <Form.Item
              name="remainingAmount"
              label="待支付金额"
            >
              <Input 
                disabled 
                value={currentContract ? `${currentContract.remainingAmount} 元` : ''}
                style={{ color: currentContract && currentContract.paymentStatus === 'unpaid' ? 'red' : '' }}
              />
            </Form.Item>
            
            <Form.Item
              name="paymentAmount"
              label="本次缴费金额"
              rules={[
                { required: true, message: '请输入本次缴费金额' },
                { type: 'number', min: 1, message: '缴费金额必须大于0' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !currentContract) {
                      return Promise.resolve();
                    }
                    const remainingAmount = parseFloat(currentContract.remainingAmount.replace(/,/g, ''));
                    if (value > remainingAmount) {
                      return Promise.reject(new Error(`缴费金额不能超过待支付金额 ${currentContract.remainingAmount} 元`));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="元"
                min={0}
              />
            </Form.Item>
            
            <Form.Item
              name="paymentMethod"
              label="支付方式"
              rules={[{ required: true, message: '请选择支付方式' }]}
            >
              <Select placeholder="请选择支付方式">
                <Option value="bankTransfer">银行转账</Option>
                <Option value="onlinePayment">在线支付</Option>
                <Option value="cash">现金</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="paymentDate"
              label="缴费日期"
              rules={[{ required: true, message: '请选择缴费日期' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                icon={<CalendarOutlined />}
              />
            </Form.Item>
            
            <Form.Item
              name="remark"
              label="备注"
            >
              <TextArea rows={3} placeholder="请输入备注信息（可选）" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PaymentOperation;