import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, message, Space, Popconfirm, InputNumber, Row, Col, Card, Statistic } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import '../styles.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [searchParams, setSearchParams] = useState({
    code: '',
    name: '',
    type: '',
    status: '',
    dateRange: null
  });
  const [form] = Form.useForm();
  const [contractTypes, setContractTypes] = useState([]);
  const [contractStatuses, setContractStatuses] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [parties, setParties] = useState([]);
  const [statistics, setStatistics] = useState({
    totalContracts: 0,
    activeContracts: 0,
    pendingContracts: 0,
    completedContracts: 0
  });

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟合同类型数据
    setContractTypes([
      { id: '1', name: '土地租赁合同' },
      { id: '2', name: '土地转让合同' },
      { id: '3', name: '拍卖成交合同' },
      { id: '4', name: '服务合同' },
      { id: '5', name: '其他合同' }
    ]);

    // 模拟合同状态数据
    setContractStatuses([
      { id: '1', name: '待签署', color: '#faad14' },
      { id: '2', name: '已签署', color: '#52c41a' },
      { id: '3', name: '已生效', color: '#1890ff' },
      { id: '4', name: '已过期', color: '#8c8c8c' },
      { id: '5', name: '已解除', color: '#ff4d4f' }
    ]);

    // 模拟拍卖数据
    setAuctions([
      { id: '1', code: 'AUCTION-2023-001', name: '阿克苏棉花农场2023年春季拍卖' },
      { id: '2', code: 'AUCTION-2023-002', name: '阿克苏小麦农场2023年春季拍卖' },
      { id: '3', code: 'AUCTION-2023-003', name: '阿克苏玉米农场2023年春季拍卖' }
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

    // 模拟获取合同列表
    const fetchContracts = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟合同数据
        const mockContracts = [
          {
            id: '1',
            code: 'CONTRACT-2023-001',
            name: '阿克苏三号地块土地租赁合同',
            type: 1,
            type_name: '土地租赁合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '1',
            second_party_name: '张三',
            start_date: '2023-03-01',
            end_date: '2024-02-29',
            amount: 580000,
            currency: 'CNY',
            status: 3,
            status_name: '已生效',
            description: '张三租赁阿克苏农场有限公司所有的阿克苏三号地块，用于棉花种植，租期一年。',
            related_auction_id: '1',
            related_auction_code: 'AUCTION-2023-001',
            create_time: '2023-02-28 14:30:00',
            update_time: '2023-03-10 10:15:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: '2023-03-05',
            effective_date: '2023-03-10',
            attachments: [
              { id: '1', name: '合同正本.pdf', url: '#', size: '2.5MB' },
              { id: '2', name: '补充协议.pdf', url: '#', size: '0.8MB' }
            ]
          },
          {
            id: '2',
            code: 'CONTRACT-2023-002',
            name: '阿克苏小麦农场四号地块转让合同',
            type: 2,
            type_name: '土地转让合同',
            first_party_id: '6',
            first_party_name: '新疆棉花种植合作社',
            second_party_id: '2',
            second_party_name: '李四',
            start_date: '2023-01-01',
            end_date: '2032-12-31',
            amount: 1200000,
            currency: 'CNY',
            status: 3,
            status_name: '已生效',
            description: '新疆棉花种植合作社将阿克苏小麦农场四号地块转让给李四，用于长期农业生产。',
            related_auction_id: null,
            related_auction_code: null,
            create_time: '2023-01-15 09:45:00',
            update_time: '2023-01-20 15:30:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: '2023-01-20',
            effective_date: '2023-01-20',
            attachments: [
              { id: '3', name: '转让合同.pdf', url: '#', size: '1.8MB' },
              { id: '4', name: '土地证明文件.pdf', url: '#', size: '1.2MB' }
            ]
          },
          {
            id: '3',
            code: 'CONTRACT-2023-003',
            name: '2023年春季拍卖成交确认书',
            type: 3,
            type_name: '拍卖成交合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '3',
            second_party_name: '王五',
            start_date: '2023-04-01',
            end_date: '2023-12-31',
            amount: 750000,
            currency: 'CNY',
            status: 1,
            status_name: '待签署',
            description: '王五在2023年春季拍卖中竞得阿克苏农场有限公司的部分土地使用权。',
            related_auction_id: '2',
            related_auction_code: 'AUCTION-2023-002',
            create_time: '2023-03-15 16:20:00',
            update_time: '2023-03-15 16:20:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: null,
            effective_date: null,
            attachments: [
              { id: '5', name: '拍卖成交确认书.pdf', url: '#', size: '0.5MB' }
            ]
          },
          {
            id: '4',
            code: 'CONTRACT-2023-004',
            name: '农业技术服务合同',
            type: 4,
            type_name: '服务合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '4',
            second_party_name: '赵六',
            start_date: '2023-02-01',
            end_date: '2023-11-30',
            amount: 120000,
            currency: 'CNY',
            status: 3,
            status_name: '已生效',
            description: '赵六为阿克苏农场有限公司提供农业技术服务，包括种植指导、病虫害防治等。',
            related_auction_id: null,
            related_auction_code: null,
            create_time: '2023-01-25 11:10:00',
            update_time: '2023-02-01 14:25:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: '2023-02-01',
            effective_date: '2023-02-01',
            attachments: [
              { id: '6', name: '技术服务协议.pdf', url: '#', size: '0.9MB' }
            ]
          },
          {
            id: '5',
            code: 'CONTRACT-2022-001',
            name: '2022年棉花种植承包合同',
            type: 1,
            type_name: '土地租赁合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '2',
            second_party_name: '李四',
            start_date: '2022-03-01',
            end_date: '2023-02-28',
            amount: 520000,
            currency: 'CNY',
            status: 4,
            status_name: '已过期',
            description: '李四承包阿克苏农场有限公司的棉花种植土地，2022年度合同。',
            related_auction_id: null,
            related_auction_code: null,
            create_time: '2022-02-20 10:30:00',
            update_time: '2023-03-01 09:00:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: '2022-02-25',
            effective_date: '2022-03-01',
            attachments: [
              { id: '7', name: '2022年棉花种植承包合同.pdf', url: '#', size: '1.3MB' }
            ]
          },
          {
            id: '6',
            code: 'CONTRACT-2023-005',
            name: '阿克苏玉米种植合作协议',
            type: 5,
            type_name: '其他合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '6',
            second_party_name: '新疆棉花种植合作社',
            start_date: '2023-05-01',
            end_date: '2023-10-31',
            amount: 350000,
            currency: 'CNY',
            status: 1,
            status_name: '待签署',
            description: '阿克苏农场有限公司与新疆棉花种植合作社合作开展玉米种植项目。',
            related_auction_id: null,
            related_auction_code: null,
            create_time: '2023-04-10 14:20:00',
            update_time: '2023-04-10 14:20:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: null,
            effective_date: null,
            attachments: [
              { id: '8', name: '合作协议草案.pdf', url: '#', size: '1.1MB' }
            ]
          },
          {
            id: '7',
            code: 'CONTRACT-2023-006',
            name: '农业机械租赁合同',
            type: 5,
            type_name: '其他合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '1',
            second_party_name: '张三',
            start_date: '2023-04-01',
            end_date: '2023-07-31',
            amount: 60000,
            currency: 'CNY',
            status: 3,
            status_name: '已生效',
            description: '张三向阿克苏农场有限公司租赁农业机械设备，用于春耕播种。',
            related_auction_id: null,
            related_auction_code: null,
            create_time: '2023-03-25 16:40:00',
            update_time: '2023-04-01 10:00:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: '2023-03-30',
            effective_date: '2023-04-01',
            attachments: [
              { id: '9', name: '机械租赁合同.pdf', url: '#', size: '0.7MB' },
              { id: '10', name: '设备清单.pdf', url: '#', size: '0.4MB' }
            ]
          },
          {
            id: '8',
            code: 'CONTRACT-2023-007',
            name: '农产品收购合同',
            type: 5,
            type_name: '其他合同',
            first_party_id: '5',
            first_party_name: '阿克苏农场有限公司',
            second_party_id: '3',
            second_party_name: '王五',
            start_date: '2023-09-01',
            end_date: '2023-12-31',
            amount: 480000,
            currency: 'CNY',
            status: 1,
            status_name: '待签署',
            description: '阿克苏农场有限公司收购王五种植的农产品，包括棉花、小麦等。',
            related_auction_id: null,
            related_auction_code: null,
            create_time: '2023-04-15 11:30:00',
            update_time: '2023-04-15 11:30:00',
            create_user: '管理员',
            update_user: '管理员',
            sign_date: null,
            effective_date: null,
            attachments: [
              { id: '11', name: '农产品收购协议.pdf', url: '#', size: '0.8MB' }
            ]
          }
        ];

        setContracts(mockContracts);

        // 计算统计数据
        setStatistics({
          totalContracts: mockContracts.length,
          activeContracts: mockContracts.filter(c => c.status === 3).length,
          pendingContracts: mockContracts.filter(c => c.status === 1).length,
          completedContracts: mockContracts.filter(c => c.status === 4 || c.status === 5).length
        });
      } catch (error) {
        console.error('获取合同列表失败:', error);
        message.error('获取合同列表失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
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
      name: '',
      type: '',
      status: '',
      dateRange: null
    });
  };

  // 打开添加合同模态框
  const showAddModal = () => {
    setEditingContract(null);
    form.resetFields();
    setVisible(true);
  };

  // 打开编辑合同模态框
  const showEditModal = (record) => {
    setEditingContract(record);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      type: record.type.toString(),
      first_party_id: record.first_party_id,
      second_party_id: record.second_party_id,
      start_date: record.start_date ? new Date(record.start_date) : null,
      end_date: record.end_date ? new Date(record.end_date) : null,
      amount: record.amount,
      currency: record.currency,
      description: record.description,
      related_auction_id: record.related_auction_id || undefined
    });
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingContract(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理日期格式
      const contractData = {
        ...values,
        start_date: values.start_date ? format(values.start_date, 'yyyy-MM-dd') : null,
        end_date: values.end_date ? format(values.end_date, 'yyyy-MM-dd') : null
      };
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (editingContract) {
        // 编辑合同
        const updatedContracts = contracts.map(contract => 
          contract.id === editingContract.id ? { ...contract, ...contractData } : contract
        );
        setContracts(updatedContracts);
        message.success('合同更新成功');
      } else {
        // 添加合同
        const newContract = {
          id: `new-${Date.now()}`,
          ...contractData,
          status: 1,
          status_name: '待签署',
          type_name: contractTypes.find(t => t.id === contractData.type)?.name || '',
          first_party_name: parties.find(p => p.id === contractData.first_party_id)?.name || '',
          second_party_name: parties.find(p => p.id === contractData.second_party_id)?.name || '',
          related_auction_code: auctions.find(a => a.id === contractData.related_auction_id)?.code || null,
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
          sign_date: null,
          effective_date: null,
          attachments: []
        };
        setContracts([newContract, ...contracts]);
        message.success('合同创建成功');
      }
      
      // 关闭模态框
      setVisible(false);
      setEditingContract(null);
      form.resetFields();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('提交表单失败，请重试');
    }
  };

  // 删除合同
  const handleDelete = async (id) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 从列表中删除合同
      const updatedContracts = contracts.filter(contract => contract.id !== id);
      setContracts(updatedContracts);
      
      // 更新统计数据
      setStatistics(prev => ({
        ...prev,
        totalContracts: prev.totalContracts - 1,
        activeContracts: prev.activeContracts - (contracts.find(c => c.id === id)?.status === 3 ? 1 : 0),
        pendingContracts: prev.pendingContracts - (contracts.find(c => c.id === id)?.status === 1 ? 1 : 0),
        completedContracts: prev.completedContracts - (contracts.find(c => c.id === id)?.status === 4 || contracts.find(c => c.id === id)?.status === 5 ? 1 : 0)
      }));
      
      message.success('合同删除成功');
    } catch (error) {
      console.error('删除合同失败:', error);
      message.error('删除合同失败，请重试');
    }
  };

  // 切换合同状态
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新合同状态
      const updatedContracts = contracts.map(contract => {
        if (contract.id === id) {
          const statusObj = contractStatuses.find(s => s.id === newStatus.toString());
          return {
            ...contract,
            status: parseInt(newStatus),
            status_name: statusObj?.name || '',
            update_time: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }),
            update_user: '当前用户',
            sign_date: (newStatus === '2' || newStatus === '3') && !contract.sign_date ? format(new Date(), 'yyyy-MM-dd') : contract.sign_date,
            effective_date: newStatus === '3' && !contract.effective_date ? format(new Date(), 'yyyy-MM-dd') : contract.effective_date
          };
        }
        return contract;
      });
      
      setContracts(updatedContracts);
      
      // 更新统计数据
      const contract = contracts.find(c => c.id === id);
      const oldStatus = contract.status;
      setStatistics(prev => {
        const newStats = { ...prev };
        
        // 更新旧状态计数
        if (oldStatus === 1) newStats.pendingContracts--;
        else if (oldStatus === 3) newStats.activeContracts--;
        else if (oldStatus === 4 || oldStatus === 5) newStats.completedContracts--;
        
        // 更新新状态计数
        const newStatusNum = parseInt(newStatus);
        if (newStatusNum === 1) newStats.pendingContracts++;
        else if (newStatusNum === 3) newStats.activeContracts++;
        else if (newStatusNum === 4 || newStatusNum === 5) newStats.completedContracts++;
        
        return newStats;
      });
      
      message.success('合同状态更新成功');
    } catch (error) {
      console.error('更新合同状态失败:', error);
      message.error('更新合同状态失败，请重试');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '合同编号',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
      ellipsis: true,
      fixed: 'left',
      width: 160
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true
    },
    {
      title: '合同类型',
      dataIndex: 'type_name',
      key: 'type_name',
      filters: contractTypes.map(type => ({
        text: type.name,
        value: type.name
      })),
      onFilter: (value, record) => record.type_name === value,
      ellipsis: true
    },
    {
      title: '甲方',
      dataIndex: 'first_party_name',
      key: 'first_party_name',
      sorter: (a, b) => a.first_party_name.localeCompare(b.first_party_name),
      ellipsis: true
    },
    {
      title: '乙方',
      dataIndex: 'second_party_name',
      key: 'second_party_name',
      sorter: (a, b) => a.second_party_name.localeCompare(b.second_party_name),
      ellipsis: true
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, record) => (
        <span>{amount.toLocaleString()} {record.currency}</span>
      )
    },
    {
      title: '开始日期',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date)
    },
    {
      title: '结束日期',
      dataIndex: 'end_date',
      key: 'end_date',
      sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: contractStatuses.map(status => ({
        text: status.name,
        value: status.id
      })),
      onFilter: (value, record) => record.status.toString() === value,
      render: (status) => {
        const statusObj = contractStatuses.find(s => s.id === status.toString());
        return (
          <Tag color={statusObj?.color || '#d9d9d9'}>
            {statusObj?.name || '未知状态'}
          </Tag>
        );
      }
    },
    {
      title: '相关拍卖',
      dataIndex: 'related_auction_code',
      key: 'related_auction_code',
      ellipsis: true,
      render: (code) => code || '-'
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
              // 实际项目中应该跳转到合同详情页面
              console.log('查看合同详情:', record.id);
              message.info('查看合同详情功能待实现');
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
            {contractStatuses.map(status => (
              <Option key={status.id} value={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>
          <Popconfirm
            title="确定要删除这个合同吗？"
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
        <h1 className="page-title">合同管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          >
            添加合同
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="合同总数"
              value={statistics.totalContracts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="有效合同"
              value={statistics.activeContracts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待签署合同"
              value={statistics.pendingContracts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已完成合同"
              value={statistics.completedContracts}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索条件 */}
      <Card className="search-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="合同编号" colon={false}>
              <Input
                placeholder="请输入合同编号"
                value={searchParams.code}
                onChange={(e) => setSearchParams({ ...searchParams, code: e.target.value })}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="合同名称" colon={false}>
              <Input
                placeholder="请输入合同名称"
                value={searchParams.name}
                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="合同类型" colon={false}>
              <Select
                placeholder="请选择合同类型"
                value={searchParams.type}
                onChange={(value) => setSearchParams({ ...searchParams, type: value })}
                allowClear
              >
                {contractTypes.map(type => (
                  <Option key={type.id} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="合同状态" colon={false}>
              <Select
                placeholder="请选择合同状态"
                value={searchParams.status}
                onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                allowClear
              >
                {contractStatuses.map(status => (
                  <Option key={status.id} value={status.id}>
                    {status.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="合同期间" colon={false}>
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

      {/* 合同列表 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={contracts}
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
                  <span className="expanded-label">合同描述：</span>
                  <span className="expanded-value">{record.description || '-'}</span>
                </div>
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

      {/* 添加/编辑合同模态框 */}
      <Modal
        title={editingContract ? "编辑合同" : "添加合同"}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
        okButtonProps={{ type: 'primary' }}
      >
        <Form
          form={form}
          layout="vertical"
          className="contract-form"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="合同编号"
                name="code"
                rules={[
                  { required: true, message: '请输入合同编号' },
                  { max: 50, message: '合同编号不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入合同编号" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="合同名称"
                name="name"
                rules={[
                  { required: true, message: '请输入合同名称' },
                  { max: 100, message: '合同名称不能超过100个字符' }
                ]}
              >
                <Input placeholder="请输入合同名称" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="合同类型"
                name="type"
                rules={[
                  { required: true, message: '请选择合同类型' }
                ]}
              >
                <Select placeholder="请选择合同类型">
                  {contractTypes.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="相关拍卖"
                name="related_auction_id"
              >
                <Select placeholder="请选择相关拍卖（可选）" allowClear>
                  {auctions.map(auction => (
                    <Option key={auction.id} value={auction.id}>
                      {auction.code} - {auction.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="甲方"
                name="first_party_id"
                rules={[
                  { required: true, message: '请选择甲方' }
                ]}
              >
                <Select placeholder="请选择甲方">
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
                label="乙方"
                name="second_party_id"
                rules={[
                  { required: true, message: '请选择乙方' }
                ]}
              >
                <Select placeholder="请选择乙方">
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
                label="开始日期"
                name="start_date"
                rules={[
                  { required: true, message: '请选择开始日期' }
                ]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择开始日期" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="结束日期"
                name="end_date"
                rules={[
                  { required: true, message: '请选择结束日期' }
                ]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择结束日期" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="合同金额"
                name="amount"
                rules={[
                  { required: true, message: '请输入合同金额' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0, message: '金额不能小于0' }
                ]}
              >
                <InputNumber 
                  placeholder="请输入合同金额"
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
            <Col xs={24}>
              <Form.Item
                label="合同描述"
                name="description"
                rules={[
                  { max: 500, message: '合同描述不能超过500个字符' }
                ]}
              >
                <TextArea rows={4} placeholder="请输入合同描述（可选）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractList;