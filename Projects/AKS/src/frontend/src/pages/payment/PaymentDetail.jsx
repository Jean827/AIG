import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, InputNumber, Timeline, Modal, Form, Row, Col, message, Space, Statistic } from 'antd';
import { FileTextOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, UserOutlined, CalendarOutlined, BankOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import '../styles.css';

const PaymentDetail = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [relatedContracts, setRelatedContracts] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [paymentProofModalVisible, setPaymentProofModalVisible] = useState(false);
  const [paymentProofForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [steps] = useState([
    { title: '支付创建', description: '支付记录创建完成' },
    { title: '支付处理', description: '支付正在处理中' },
    { title: '支付完成', description: '支付已成功完成' },
    { title: '对账确认', description: '财务对账确认完成' }
  ]);

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

    // 模拟获取支付详情
    const fetchPaymentDetail = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟支付详情数据
        const mockPayment = {
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
        };

        setPayment(mockPayment);

        // 根据支付状态设置当前步骤
        if (mockPayment.status === 3) {
          setCurrentStep(3);
        } else if (mockPayment.status === 2) {
          setCurrentStep(2);
        } else if (mockPayment.status === 1) {
          setCurrentStep(1);
        }

        // 模拟支付历史记录
        setPaymentHistory([
          {
            id: '1',
            time: '2023-03-05 16:30:00',
            action: '支付完成',
            description: '系统确认收款，支付状态更新为已支付',
            operator: '系统'
          },
          {
            id: '2',
            time: '2023-03-05 12:15:00',
            action: '提交支付凭证',
            description: '用户上传了银行转账凭证',
            operator: '张三'
          },
          {
            id: '3',
            time: '2023-02-28 15:30:00',
            action: '创建支付记录',
            description: '创建了新的支付记录',
            operator: '管理员'
          }
        ]);

        // 模拟相关合同信息
        setRelatedContracts([
          {
            id: '1',
            code: 'CONTRACT-2023-001',
            name: '阿克苏三号地块土地租赁合同',
            type: '土地租赁',
            start_date: '2023-03-01',
            end_date: '2024-02-29',
            status: '生效中'
          }
        ]);

        // 设置表单初始值
        form.setFieldsValue({
          amount: mockPayment.amount,
          paid_amount: mockPayment.paid_amount,
          currency: mockPayment.currency,
          payment_method: mockPayment.payment_method.toString(),
          due_date: mockPayment.due_date ? new Date(mockPayment.due_date) : null,
          description: mockPayment.description,
          payment_details: mockPayment.payment_details,
          status: mockPayment.status.toString()
        });

        paymentProofForm.setFieldsValue({
          amount: mockPayment.paid_amount,
          transaction_id: mockPayment.transaction_id,
          payment_date: mockPayment.payment_date ? new Date(mockPayment.payment_date) : null
        });
      } catch (error) {
        console.error('获取支付详情失败:', error);
        message.error('获取支付详情失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetail();
  }, [form, paymentProofForm]);

  // 更新支付信息
  const handleUpdatePayment = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理日期格式
      const updatedPaymentData = {
        ...values,
        due_date: values.due_date ? format(values.due_date, 'yyyy-MM-dd') : null
      };
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新支付信息
      setPayment(prev => ({
        ...prev,
        ...updatedPaymentData,
        status: parseInt(values.status),
        payment_method: parseInt(values.payment_method),
        update_time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        update_user: '当前用户'
      }));
      
      // 添加操作历史
      const newHistory = {
        id: `new-${Date.now()}`,
        time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        action: '更新支付信息',
        description: '更新了支付金额、状态等信息',
        operator: '当前用户'
      };
      setPaymentHistory([newHistory, ...paymentHistory]);
      
      message.success('支付信息更新成功');
      setUpdateModalVisible(false);
    } catch (error) {
      console.error('更新支付信息失败:', error);
      message.error('更新支付信息失败，请重试');
    }
  };

  // 提交支付凭证
  const handleSubmitPaymentProof = async () => {
    try {
      const values = await paymentProofForm.validateFields();
      
      // 处理日期格式
      const proofData = {
        ...values,
        payment_date: values.payment_date ? format(values.payment_date, 'yyyy-MM-dd') : null
      };
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新支付状态和交易信息
      setPayment(prev => ({
        ...prev,
        transaction_id: proofData.transaction_id,
        payment_date: proofData.payment_date,
        paid_amount: proofData.amount,
        status: 2, // 设置为部分支付
        status_name: '部分支付',
        update_time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        update_user: '当前用户'
      }));
      
      // 添加操作历史
      const newHistory = {
        id: `new-${Date.now()}`,
        time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        action: '提交支付凭证',
        description: '用户上传了支付凭证，金额：' + proofData.amount + ' ' + payment?.currency,
        operator: '当前用户'
      };
      setPaymentHistory([newHistory, ...paymentHistory]);
      
      message.success('支付凭证提交成功');
      setPaymentProofModalVisible(false);
    } catch (error) {
      console.error('提交支付凭证失败:', error);
      message.error('提交支付凭证失败，请重试');
    }
  };

  // 确认支付完成
  const handleConfirmPayment = async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新支付状态为已支付
      setPayment(prev => ({
        ...prev,
        status: 3,
        status_name: '已支付',
        paid_amount: prev.amount,
        update_time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        update_user: '当前用户'
      }));
      
      // 更新当前步骤
      setCurrentStep(3);
      
      // 添加操作历史
      const newHistory = {
        id: `new-${Date.now()}`,
        time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        action: '确认支付完成',
        description: '财务确认收款完成，支付状态更新为已支付',
        operator: '当前用户'
      };
      setPaymentHistory([newHistory, ...paymentHistory]);
      
      message.success('支付确认成功');
    } catch (error) {
      console.error('确认支付失败:', error);
      message.error('确认支付失败，请重试');
    }
  };

  // 下载附件
  const handleDownloadAttachment = (attachment) => {
    // 实际项目中应该处理文件下载逻辑
    console.log('下载附件:', attachment.name);
    message.success(`开始下载: ${attachment.name}`);
  };

  // 查看关联合同
  const handleViewContract = (contractId) => {
    // 实际项目中应该跳转到合同详情页面
    console.log('查看合同详情:', contractId);
    message.info('查看合同详情功能待实现');
  };

  if (loading || !payment) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">支付详情</h1>
        </div>
        <Card className="loading-card">加载中...</Card>
      </div>
    );
  }

  // 获取状态标签颜色
  const getStatusColor = (statusId) => {
    const status = paymentStatuses.find(s => s.id === statusId.toString());
    return status?.color || '#d9d9d9';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">支付详情</h1>
        <div className="action-buttons">
          <Button
            icon={<EditOutlined />}
            onClick={() => setUpdateModalVisible(true)}
          >
            编辑支付信息
          </Button>
          {payment.status === 1 && (
            <Button
              type="primary"
              style={{ marginLeft: 12 }}
              onClick={() => setPaymentProofModalVisible(true)}
            >
              提交支付凭证
            </Button>
          )}
          {payment.status === 2 && (
            <Button
              type="primary"
              style={{ marginLeft: 12 }}
              onClick={handleConfirmPayment}
            >
              确认支付完成
            </Button>
          )}
        </div>
      </div>

      {/* 支付进度 */}
      <Card className="progress-card">
        <div className="payment-progress">
          <div className="progress-header">
            <h3>支付进度</h3>
            <Tag color={getStatusColor(payment.status)}>
              {payment.status_name}
            </Tag>
          </div>
          <Timeline
            current={currentStep - 1}
            items={steps.map((step, index) => ({
              color: index < currentStep ? 'green' : '#d9d9d9',
              children: (
                <div className="timeline-item">
                  <div className="timeline-title">{step.title}</div>
                  <div className="timeline-description">{step.description}</div>
                </div>
              )
            }))}
          />
        </div>
      </Card>

      {/* 支付概览统计 */}
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="总金额"
              value={payment.amount}
              prefix={<DollarOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="已付金额"
              value={payment.paid_amount}
              prefix={<CheckCircleOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="待付金额"
              value={payment.amount - payment.paid_amount}
              prefix={<ClockCircleOutlined />}
              suffix=" 元"
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* 支付基本信息 */}
      <Card className="detail-card">
        <h2 className="card-title">基本信息</h2>
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="支付编号" span={1}>
            {payment.code}
          </Descriptions.Item>
          <Descriptions.Item label="交易编号" span={1}>
            {payment.transaction_id || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="付款方" span={1}>
            <span className="user-info">
              <UserOutlined className="user-icon" /> {payment.payer_name}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="收款方" span={1}>
            <span className="user-info">
              <UserOutlined className="user-icon" /> {payment.payee_name}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="支付方式" span={1}>
            {payment.payment_method_name}
          </Descriptions.Item>
          <Descriptions.Item label="支付日期" span={1}>
            {payment.payment_date || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="到期日期" span={1}>
            {payment.due_date}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {payment.create_time}
          </Descriptions.Item>
          <Descriptions.Item label="创建人" span={1}>
            {payment.create_user}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间" span={1}>
            {payment.update_time}
          </Descriptions.Item>
          <Descriptions.Item label="更新人" span={1}>
            {payment.update_user}
          </Descriptions.Item>
          <Descriptions.Item label="支付描述" span={2}>
            {payment.description || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="支付详情" span={2}>
            {payment.payment_details || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 银行信息 */}
      {payment.bank_info && (
        <Card className="detail-card">
          <h2 className="card-title">银行信息</h2>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label="银行名称" span={1}>
              {payment.bank_info.bank_name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="账户名称" span={1}>
              {payment.bank_info.account_name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="账号" span={1}>
              {payment.bank_info.account_number || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="支行名称" span={1}>
              {payment.bank_info.branch_name || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* 附件信息 */}
      {payment.attachments && payment.attachments.length > 0 && (
        <Card className="detail-card">
          <h2 className="card-title">附件信息</h2>
          <div className="attachments-container">
            {payment.attachments.map(attachment => (
              <div key={attachment.id} className="attachment-item">
                <div className="attachment-info">
                  <FileTextOutlined className="attachment-icon" />
                  <span className="attachment-name">{attachment.name}</span>
                  <span className="attachment-size">{attachment.size}</span>
                </div>
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadAttachment(attachment)}
                >
                  下载
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 相关合同信息 */}
      {relatedContracts && relatedContracts.length > 0 && (
        <Card className="detail-card">
          <h2 className="card-title">相关合同信息</h2>
          <div className="contracts-container">
            {relatedContracts.map(contract => (
              <div key={contract.id} className="contract-item">
                <div className="contract-header">
                  <span className="contract-code">{contract.code}</span>
                  <Button
                    type="link"
                    icon={<SearchOutlined />}
                    onClick={() => handleViewContract(contract.id)}
                  >
                    查看详情
                  </Button>
                </div>
                <div className="contract-info">
                  <p className="contract-name">{contract.name}</p>
                  <div className="contract-meta">
                    <span className="contract-type">类型：{contract.type}</span>
                    <span className="contract-date">有效期：{contract.start_date} - {contract.end_date}</span>
                    <Tag>{contract.status}</Tag>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 操作历史 */}
      <Card className="detail-card">
        <h2 className="card-title">操作历史</h2>
        <div className="history-container">
          {paymentHistory.map(history => (
            <div key={history.id} className="history-item">
              <div className="history-header">
                <span className="history-action">{history.action}</span>
                <span className="history-time">{history.time}</span>
              </div>
              <div className="history-content">
                <p className="history-description">{history.description}</p>
                <p className="history-operator">操作人：{history.operator}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 编辑支付信息模态框 */}
      <Modal
        title="编辑支付信息"
        open={updateModalVisible}
        onOk={handleUpdatePayment}
        onCancel={() => setUpdateModalVisible(false)}
        width={700}
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
                <Input.TextArea rows={2} placeholder="请输入支付描述" />
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
                <Input.TextArea rows={3} placeholder="请输入支付详情（如支付计划、分期信息等）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 提交支付凭证模态框 */}
      <Modal
        title="提交支付凭证"
        open={paymentProofModalVisible}
        onOk={handleSubmitPaymentProof}
        onCancel={() => setPaymentProofModalVisible(false)}
        width={600}
        okButtonProps={{ type: 'primary' }}
      >
        <Form
          form={paymentProofForm}
          layout="vertical"
          className="payment-form"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="支付金额"
                name="amount"
                rules={[
                  { required: true, message: '请输入支付金额' },
                  { type: 'number', message: '请输入有效数字' },
                  { min: 0, message: '金额不能小于0' },
                  { max: payment.amount, message: `支付金额不能超过总金额${payment.amount}元` }
                ]}
              >
                <InputNumber 
                  prefix={<DollarOutlined />}
                  placeholder="请输入支付金额"
                  style={{ width: '100%' }}
                  min={0}
                  max={payment.amount}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="交易编号"
                name="transaction_id"
                rules={[
                  { required: true, message: '请输入交易编号' },
                  { max: 100, message: '交易编号不能超过100个字符' }
                ]}
              >
                <Input placeholder="请输入交易编号" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="支付日期"
                name="payment_date"
                rules={[
                  { required: true, message: '请选择支付日期' }
                ]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择支付日期" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="支付凭证上传"
                name="proof_file"
                rules={[
                  { required: true, message: '请上传支付凭证' }
                ]}
              >
                <div className="upload-container">
                  <Button>点击上传凭证</Button>
                  <p className="upload-hint">支持 PDF、JPG、PNG 格式，文件大小不超过 10MB</p>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentDetail;