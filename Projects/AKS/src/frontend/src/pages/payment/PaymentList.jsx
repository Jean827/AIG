import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, message, Space, Popconfirm, InputNumber, Row, Col, Card, Statistic } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DollarOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import '../styles.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchParams, setSearchParams] = useState({
    code: '',
    contract_code: '',
    payer_name: '',
    status: '',
    dateRange: null
  });
  const [form] = Form.useForm();
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [parties, setParties] = useState([]);
  const [statistics, setStatistics] = useState({
    totalPayments: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  });

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟支付状态数据
    setPaymentStatuses([
      { id: '1', name: '待支付', color: '#faad14' },
      { id: '2', name: '部分支付', color: '#fa8c16' },
      { id: '3', name: '已支付', color: '#52c41a' },
      { id: '4', name: '已取消', color: '#8c8c8c' },
      { id: '5', name: '支付失败', color: '#ff4d4f' }
    ]);

    // 模拟支付方式数据
    setPaymentMethods([
      { id: '1', name: '银行转账' },
      { id: '2', name: '现金支付' },
      { id: '3', name: '支票支付' },
      { id: '4', name: '电子支付' },
      { id: '5', name: '其他方式' }
    ]);

    // 模拟合同数据
    setContracts([
      { id: '1', code: 'CONTRACT-2023-001', name: '阿克苏三号地块土地租赁合同' },
      { id: '2', code: 'CONTRACT-2023-002', name: '阿克苏小麦农场四号地块转让合同' },
      { id: '3', code: 'CONTRACT-2023-003', name: '2023年春季拍卖成交确认书' },
      { id: '4', code: 'CONTRACT-2023-004', name: '农业技术服务合同' },
      { id: '5', code: 'CONTRACT-2023-006', name: '农业机械租赁合同' }
    ]);

    // 模拟合同方数据
    setParties([
      { id: '1', name: '张三' },
      { id: '2', name: '李四' },
      { id: '3', name: '王五' },
      { id: '4', name: '赵六' },
      { id: '5', name: '阿克苏农场有限公司' },
      { id: '6', name: '新疆棉花种植合作社' }
    ]);

    // 模拟获取支付列表
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟支付数据
        const mockPayments = [
          {
            id: '1',
            code: 'PAY-2023-001',
            contract_id: '1',
            contract_code: 'CONTRACT-2023-001',
            contract_name: '阿克苏三号地块土地租赁合同',
            payer_id: '1',
            payer_name: '张三',
            payee_id: '5',
            payee_name: '阿克苏农场有限公司',
            amount: 580000,
            paid_amount: 580000,
            currency: 'CNY',
            payment_method: 1,
            payment_method_name: '银行转账',
            payment_date: '2023-03-05',
            due_date: '2023-03-05',
            status: 3,
            status_name: '已支付',
            description: '土地租赁合同第一期租金',
            payment_details: '合同生效后3日内支付30%',
            transaction_id: 'TRX-20230305-001',
            bank_info: {
              bank_name: '中国农业银行',
              account_name: '阿克苏农场有限公司',
              account_number: '622848XXXXXXXXXXXX123',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-02-28 15:00:00',
            update_time: '2023-03-05 16:30:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: [
              { id: '1', name: '银行转账凭证.pdf', url: '#', size: '1.2MB' },
              { id: '2', name: '收据.pdf', url: '#', size: '0.5MB' }
            ]
          },
          {
            id: '2',
            code: 'PAY-2023-002',
            contract_id: '2',
            contract_code: 'CONTRACT-2023-002',
            contract_name: '阿克苏小麦农场四号地块转让合同',
            payer_id: '2',
            payer_name: '李四',
            payee_id: '6',
            payee_name: '新疆棉花种植合作社',
            amount: 1200000,
            paid_amount: 600000,
            currency: 'CNY',
            payment_method: 1,
            payment_method_name: '银行转账',
            payment_date: '2023-01-20',
            due_date: '2023-01-20',
            status: 2,
            status_name: '部分支付',
            description: '土地转让合同首付款',
            payment_details: '合同签订后支付50%，剩余款项在过户完成后支付',
            transaction_id: 'TRX-20230120-001',
            bank_info: {
              bank_name: '中国工商银行',
              account_name: '新疆棉花种植合作社',
              account_number: '622202XXXXXXXXXXXX456',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-01-15 10:00:00',
            update_time: '2023-01-20 16:00:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: [
              { id: '3', name: '转账凭证.pdf', url: '#', size: '1.0MB' }
            ]
          },
          {
            id: '3',
            code: 'PAY-2023-003',
            contract_id: '3',
            contract_code: 'CONTRACT-2023-003',
            contract_name: '2023年春季拍卖成交确认书',
            payer_id: '3',
            payer_name: '王五',
            payee_id: '5',
            payee_name: '阿克苏农场有限公司',
            amount: 750000,
            paid_amount: 0,
            currency: 'CNY',
            payment_method: 1,
            payment_method_name: '银行转账',
            payment_date: null,
            due_date: '2023-03-20',
            status: 1,
            status_name: '待支付',
            description: '拍卖成交款',
            payment_details: '拍卖成交后15日内支付全部款项',
            transaction_id: null,
            bank_info: {
              bank_name: '中国农业银行',
              account_name: '阿克苏农场有限公司',
              account_number: '622848XXXXXXXXXXXX123',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-03-15 16:30:00',
            update_time: '2023-03-15 16:30:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: []
          },
          {
            id: '4',
            code: 'PAY-2023-004',
            contract_id: '4',
            contract_code: 'CONTRACT-2023-004',
            contract_name: '农业技术服务合同',
            payer_id: '5',
            payer_name: '阿克苏农场有限公司',
            payee_id: '4',
            payee_name: '赵六',
            amount: 120000,
            paid_amount: 60000,
            currency: 'CNY',
            payment_method: 1,
            payment_method_name: '银行转账',
            payment_date: '2023-02-01',
            due_date: '2023-02-01',
            status: 2,
            status_name: '部分支付',
            description: '技术服务费预付款',
            payment_details: '合同生效后支付50%，服务结束后支付剩余50%',
            transaction_id: 'TRX-20230201-001',
            bank_info: {
              bank_name: '中国建设银行',
              account_name: '赵六',
              account_number: '621700XXXXXXXXXXXX789',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-01-25 11:30:00',
            update_time: '2023-02-01 14:30:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: [
              { id: '4', name: '转账凭证.pdf', url: '#', size: '0.8MB' }
            ]
          },
          {
            id: '5',
            code: 'PAY-2023-005',
            contract_id: '5',
            contract_code: 'CONTRACT-2023-006',
            contract_name: '农业机械租赁合同',
            payer_id: '1',
            payer_name: '张三',
            payee_id: '5',
            payee_name: '阿克苏农场有限公司',
            amount: 60000,
            paid_amount: 60000,
            currency: 'CNY',
            payment_method: 3,
            payment_method_name: '支票支付',
            payment_date: '2023-03-30',
            due_date: '2023-03-30',
            status: 3,
            status_name: '已支付',
            description: '农业机械租赁费',
            payment_details: '合同签订时一次性支付全部租金',
            transaction_id: 'CHK-20230330-001',
            bank_info: {
              bank_name: '中国农业银行',
              account_name: '阿克苏农场有限公司',
              account_number: '622848XXXXXXXXXXXX123',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-03-25 16:50:00',
            update_time: '2023-03-30 11:00:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: [
              { id: '5', name: '支票扫描件.pdf', url: '#', size: '0.9MB' },
              { id: '6', name: '收据.pdf', url: '#', size: '0.4MB' }
            ]
          },
          {
            id: '6',
            code: 'PAY-2023-006',
            contract_id: '1',
            contract_code: 'CONTRACT-2023-001',
            contract_name: '阿克苏三号地块土地租赁合同',
            payer_id: '1',
            payer_name: '张三',
            payee_id: '5',
            payee_name: '阿克苏农场有限公司',
            amount: 10000,
            paid_amount: 10000,
            currency: 'CNY',
            payment_method: 2,
            payment_method_name: '现金支付',
            payment_date: '2023-03-01',
            due_date: '2023-03-01',
            status: 3,
            status_name: '已支付',
            description: '合同保证金',
            payment_details: '合同签订时支付保证金',
            transaction_id: 'CASH-20230301-001',
            bank_info: null,
            create_time: '2023-02-28 15:30:00',
            update_time: '2023-03-01 10:00:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: [
              { id: '7', name: '保证金收据.pdf', url: '#', size: '0.3MB' }
            ]
          },
          {
            id: '7',
            code: 'PAY-2023-007',
            contract_id: '2',
            contract_code: 'CONTRACT-2023-002',
            contract_name: '阿克苏小麦农场四号地块转让合同',
            payer_id: '2',
            payer_name: '李四',
            payee_id: '6',
            payee_name: '新疆棉花种植合作社',
            amount: 600000,
            paid_amount: 0,
            currency: 'CNY',
            payment_method: 1,
            payment_method_name: '银行转账',
            payment_date: null,
            due_date: '2023-04-20',
            status: 1,
            status_name: '待支付',
            description: '土地转让合同尾款',
            payment_details: '过户完成后支付剩余50%',
            transaction_id: null,
            bank_info: {
              bank_name: '中国工商银行',
              account_name: '新疆棉花种植合作社',
              account_number: '622202XXXXXXXXXXXX456',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-01-20 16:30:00',
            update_time: '2023-01-20 16:30:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: []
          },
          {
            id: '8',
            code: 'PAY-2023-008',
            contract_id: '4',
            contract_code: 'CONTRACT-2023-004',
            contract_name: '农业技术服务合同',
            payer_id: '5',
            payer_name: '阿克苏农场有限公司',
            payee_id: '4',
            payee_name: '赵六',
            amount: 60000,
            paid_amount: 0,
            currency: 'CNY',
            payment_method: 1,
            payment_method_name: '银行转账',
            payment_date: null,
            due_date: '2023-11-30',
            status: 1,
            status_name: '待支付',
            description: '技术服务费尾款',
            payment_details: '服务结束后支付剩余50%',
            transaction_id: null,
            bank_info: {
              bank_name: '中国建设银行',
              account_name: '赵六',
              account_number: '621700XXXXXXXXXXXX789',
              branch_name: '阿克苏分行'
            },
            create_time: '2023-01-25 11:40:00',
            update_time: '2023-01-25 11:40:00',
            create_user: '管理员',
            update_user: '管理员',
            attachments: []
          }
        ];

        setPayments(mockPayments);

        // 计算统计数据
        const totalAmount = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const paidAmount = mockPayments.reduce((sum, payment) => sum + payment.paid_amount, 0);
        const pendingAmount = totalAmount - paidAmount;
        
        setStatistics({
          totalPayments: mockPayments.length,
          totalAmount,
          paidAmount,
          pendingAmount
        });
      } catch (error) {
        console.error('获取支付列表失败:', error);
        message.error('获取支付列表失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // 搜索处理
  const handleSearch = () => {
    // 实际项目中应该调用API进行搜索
    console.log('搜索参数:', searchParams);
    message.success('搜索成功');
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      code: '',
      contract_code: '',
      payer_name: '',
      status: '',
      dateRange: null
    });
  };

  // 打开添加支付模态框
  const showAddModal = () => {
    setEditingPayment(null);
    form.resetFields();
    setVisible(true);
  };

  // 打开编辑支付模态框
  const showEditModal = (record) => {
    setEditingPayment(record);
    form.setFieldsValue({
      code: record.code,
      contract_id: record.contract_id,
      payer_id: record.payer_id,
      payee_id: record.payee_id,
      amount: record.amount,
      paid_amount: record.paid_amount,
      currency: record.currency,
      payment_method: record.payment_method.toString(),
      due_date: record.due_date ? new Date(record.due_date) : null,
      description: record.description,
      payment_details: record.payment_details,
      status: record.status.toString()
    });
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingPayment(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理日期格式
      const paymentData = {
        ...values,
        due_date: values.due_date ? format(values.due_date, 'yyyy-MM-dd') : null
      };
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (editingPayment) {
        // 编辑支付
        const updatedPayments = payments.map(payment => 
          payment.id === editingPayment.id ? { ...payment, ...paymentData } : payment
        );
        setPayments(updatedPayments);
        message.success('支付记录更新成功');
      } else {
        // 添加支付
        const contract = contracts.find(c => c.id === paymentData.contract_id);
        const payer = parties.find(p => p.id === paymentData.payer_id);
        const payee = parties.find(p => p.id === paymentData.payee_id);
        const paymentMethod = paymentMethods.find(m => m.id === paymentData.payment_method);
        const status = paymentStatuses.find(s => s.id === paymentData.status);
        
        const newPayment = {
          id: `new-${Date.now()}`,
          ...paymentData,
          contract_code: contract?.code || '',
          contract_name: contract?.name || '',
          payer_name: payer?.name || '',
          payee_name: payee?.name || '',
          payment_method_name: paymentMethod?.name || '',
          status_name: status?.name || '',
          payment_date: paymentData.status === '3' ? format(new Date(), 'yyyy-MM-dd') : null,
          transaction_id: paymentData.status === '3' ? `TRX-${Date.now()}` : null,
          bank_info: null, // 实际项目中应该根据支付方式填写银行信息
          create_time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          update_time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          create_user: '当前用户',
          update_user: '当前用户',
          attachments: []
        };
        setPayments([newPayment, ...payments]);
        message.success('支付记录创建成功');
      }
      
      // 关闭模态框
      setVisible(false);
      setEditingPayment(null);
      form.resetFields();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('提交表单失败，请重试');
    }
  };

  // 删除支付
  const handleDelete = async (id) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 从列表中删除支付
      const updatedPayments = payments.filter(payment => payment.id !== id);
      setPayments(updatedPayments);
      
      // 更新统计数据
      const payment = payments.find(p => p.id === id);
      setStatistics(prev => ({
        ...prev,
        totalPayments: prev.totalPayments - 1,
        totalAmount: prev.totalAmount - payment.amount,
        paidAmount: prev.paidAmount - payment.paid_amount,
        pendingAmount: prev.pendingAmount - (payment.amount - payment.paid_amount)
      }));
      
      message.success('支付记录删除成功');
    } catch (error) {
      console.error('删除支付记录失败:', error);
      message.error('删除支付记录失败，请重试');
    }
  };

  // 切换支付状态
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新支付状态
      const updatedPayments = payments.map(payment => {
        if (payment.id === id) {
          const statusObj = paymentStatuses.find(s => s.id === newStatus.toString());
          const isPaid = newStatus === '3';
          const isPartiallyPaid = newStatus === '2';
          
          return {
            ...payment,
            status: parseInt(newStatus),
            status_name: statusObj?.name || '',
            payment_date: isPaid ? format(new Date(), 'yyyy-MM-dd') : payment.payment_date,
            paid_amount: isPaid ? payment.amount : (isPartiallyPaid ? payment.paid_amount || payment.amount * 0.5 : payment.paid_amount),
            transaction_id: isPaid && !payment.transaction_id ? `TRX-${Date.now()}` : payment.transaction_id,
            update_time: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }),
            update_user: '当前用户'
          };
        }
        return payment;
      });
      
      setPayments(updatedPayments);
      
      // 更新统计数据
      const payment = payments.find(p => p.id === id);
      const oldPaidAmount = payment.paid_amount;
      const newPaidAmount = parseInt(newStatus) === 3 ? payment.amount : 
                           (parseInt(newStatus) === 2 ? (payment.paid_amount || payment.amount * 0.5) : payment.paid_amount);
      
      setStatistics(prev => ({
        ...prev,
        paidAmount: prev.paidAmount - oldPaidAmount + newPaidAmount,
        pendingAmount: prev.pendingAmount + oldPaidAmount - newPaidAmount
      }));
      
      message.success('支付状态更新成功');
    } catch (error) {
      console.error('更新支付状态失败:', error);
      message.error('更新支付状态失败，请重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '支付编号',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
      ellipsis: true,
      fixed: 'left',
      width: 160
    },
    {
      title: '合同编号',
      dataIndex: 'contract_code',
      key: 'contract_code',
      sorter: (a, b) => a.contract_code.localeCompare(b.contract_code),
      ellipsis: true
    },
    {
      title: '付款方',
      dataIndex: 'payer_name',
      key: 'payer_name',
      sorter: (a, b) => a.payer_name.localeCompare(b.payer_name),
      ellipsis: true
    },
    {
      title: '收款方',
      dataIndex: 'payee_name',
      key: 'payee_name',
      sorter: (a, b) => a.payee_name.localeCompare(b.payee_name),
      ellipsis: true
    },
    {
      title: '总金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, record) => (
        <span>{amount.toLocaleString()} {record.currency}</span>
      )
    },
    {
      title: '已付金额',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      sorter: (a, b) => a.paid_amount - b.paid_amount,
      render: (amount, record) => (
        <span>{amount.toLocaleString()} {record.currency}</span>
      )
    },
    {
      title: '支付方式',
      dataIndex: 'payment_method_name',
      key: 'payment_method_name',
      filters: paymentMethods.map(method => ({
        text: method.name,
        value: method.name
      })),
      onFilter: (value, record) => record.payment_method_name === value,
      ellipsis: true
    },
    {
      title: '支付日期',
      dataIndex: 'payment_date',
      key: 'payment_date',
      sorter: (a, b) => new Date(a.payment_date || '9999-12-31') - new Date(b.payment_date || '9999-12-31'),
      render: (date) => date || '-'
    },
    {
      title: '到期日期',
      dataIndex: 'due_date',
      key: 'due_date',
      sorter: (a, b) => new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: paymentStatuses.map(status => ({
        text: status.name,
        value: status.id
      })),
      onFilter: (value, record) => record.status.toString() === value,
      render: (status) => {
        const statusObj = paymentStatuses.find(s => s.id === status.toString());
        return (
          <Tag color={statusObj?.color || '#d9d9d9'}>
            {statusObj?.name || '未知状态'}
          </Tag>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => {
              // 实际项目中应该跳转到支付详情页面
              console.log('查看支付详情:', record.id);
              message.info('查看支付详情功能待实现');
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Select
            value={record.status.toString()}
            style={{ width: 100 }}
            size="small"
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            {paymentStatuses.map(status => (
              <Option key={status.id} value={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>
          <Popconfirm
            title="确定要删除这个支付记录吗？"
            description="删除后将无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
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
        <h1 className="page-title">支付管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          >
            添加支付记录
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="支付记录总数"
              value={statistics.totalPayments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总金额"
              value={statistics.totalAmount}
              prefix={<DollarOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已支付金额"
              value={statistics.paidAmount}
              prefix={<CheckCircleOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待支付金额"
              value={statistics.pendingAmount}
              prefix={<ClockCircleOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索条件 */}
      <Card className="search-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="支付编号" colon={false}>
              <Input
                placeholder="请输入支付编号"
                value={searchParams.code}
                onChange={(e) => setSearchParams({ ...searchParams, code: e.target.value })}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="合同编号" colon={false}>
              <Input
                placeholder="请输入合同编号"
                value={searchParams.contract_code}
                onChange={(e) => setSearchParams({ ...searchParams, contract_code: e.target.value })}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="付款方" colon={false}>
              <Input
                placeholder="请输入付款方名称"
                value={searchParams.payer_name}
                onChange={(e) => setSearchParams({ ...searchParams, payer_name: e.target.value })}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="支付状态" colon={false}>
              <Select
                placeholder="请选择支付状态"
                value={searchParams.status}
                onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                allowClear
              >
                {paymentStatuses.map(status => (
                  <Option key={status.id} value={status.id}>
                    {status.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="支付期间" colon={false}>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                value={searchParams.dateRange}
                onChange={(dates) => setSearchParams({ ...searchParams, dateRange: dates })}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="search-actions">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button
            style={{ marginLeft: 12 }}
            onClick={handleReset}
          >
            重置
          </Button>
        </div>
      </Card>

      {/* 支付列表 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
            size: 'middle'
          }}
          scroll={{ x: 1500 }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="expanded-content">
                <div className="expanded-item">
                  <span className="expanded-label">支付描述：</span>
                  <span className="expanded-value">{record.description || '-'}</span>
                </div>
                <div className="expanded-item">
                  <span className="expanded-label">支付详情：</span>
                  <span className="expanded-value">{record.payment_details || '-'}</span>
                </div>
                {record.transaction_id && (
                  <div className="expanded-item">
                    <span className="expanded-label">交易编号：</span>
                    <span className="expanded-value">{record.transaction_id}</span>
                  </div>
                )}
                {record.bank_info && (
                  <div className="expanded-item">
                    <span className="expanded-label">银行信息：</span>
                    <div className="bank-info">
                      <p>银行名称：{record.bank_info.bank_name || '-'}</p>
                      <p>账户名称：{record.bank_info.account_name || '-'}</p>
                      <p>账号：{record.bank_info.account_number || '-'}</p>
                      <p>支行名称：{record.bank_info.branch_name || '-'}</p>
                    </div>
                  </div>
                )}
                {record.attachments && record.attachments.length > 0 && (
                  <div className="expanded-item">
                    <span className="expanded-label">附件：</span>
                    <div className="attachments-list">
                      {record.attachments.map(attachment => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          <FileTextOutlined /> {attachment.name} ({attachment.size})
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          }}
        />
      </Card>

      {/* 添加/编辑支付模态框 */}
      <Modal
        title={editingPayment ? "编辑支付记录" : "添加支付记录"}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
        okButtonProps={{ type: 'primary' }}
      >
        <Form
          form={form}
          layout="vertical"
          className="payment-form"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="支付编号"
                name="code"
                rules={[
                  { required: true, message: '请输入支付编号' },
                  { max: 50, message: '支付编号不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入支付编号" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="关联合同"
                name="contract_id"
                rules={[
                  { required: true, message: '请选择关联合同' }
                ]}
              >
                <Select placeholder="请选择关联合同">
                  {contracts.map(contract => (
                    <Option key={contract.id} value={contract.id}>
                      {contract.code} - {contract.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="付款方"
                name="payer_id"
                rules={[
                  { required: true, message: '请选择付款方' }
                ]}
              >
                <Select placeholder="请选择付款方">
                  {parties.map(party => (
                    <Option key={party.id} value={party.id}>
                      {party.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="收款方"
                name="payee_id"
                rules={[
                  { required: true, message: '请选择收款方' }
                ]}
              >
                <Select placeholder="请选择收款方">
                  {parties.map(party => (
                    <Option key={party.id} value={party.id}>
                      {party.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="支付金额"
                name="amount"
                rules={[
                  { required: true, message: '请输入支付金额' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0, message: '金额不能小于0' }
                ]}
              >
                <InputNumber 
                  prefix={<DollarOutlined />}
                  placeholder="请输入支付金额"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="已付金额"
                name="paid_amount"
                rules={[
                  { required: true, message: '请输入已付金额' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0, message: '金额不能小于0' }
                ]}
              >
                <InputNumber 
                  prefix={<DollarOutlined />}
                  placeholder="请输入已付金额"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="货币类型"
                name="currency"
                initialValue="CNY"
                rules={[
                  { required: true, message: '请选择货币类型' }
                ]}
              >
                <Select placeholder="请选择货币类型">
                  <Option value="CNY">人民币</Option>
                  <Option value="USD">美元</Option>
                  <Option value="EUR">欧元</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="支付方式"
                name="payment_method"
                rules={[
                  { required: true, message: '请选择支付方式' }
                ]}
              >
                <Select placeholder="请选择支付方式">
                  {paymentMethods.map(method => (
                    <Option key={method.id} value={method.id}>
                      {method.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="到期日期"
                name="due_date"
                rules={[
                  { required: true, message: '请选择到期日期' }
                ]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择到期日期" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="支付状态"
                name="status"
                rules={[
                  { required: true, message: '请选择支付状态' }
                ]}
              >
                <Select placeholder="请选择支付状态">
                  {paymentStatuses.map(status => (
                    <Option key={status.id} value={status.id}>
                      {status.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="支付描述"
                name="description"
                rules={[
                  { max: 200, message: '支付描述不能超过200个字符' }
                ]}
              >
                <TextArea rows={2} placeholder="请输入支付描述" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="支付详情"
                name="payment_details"
                rules={[
                  { max: 500, message: '支付详情不能超过500个字符' }
                ]}
              >
                <TextArea rows={3} placeholder="请输入支付详情（如支付计划、分期信息等）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentList;