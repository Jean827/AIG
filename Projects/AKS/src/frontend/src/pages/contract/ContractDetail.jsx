import React, { useState, useEffect } from 'react';
import { Descriptions, Card, Button, Tag, Row, Col, Timeline, List, Space, Divider, message, Modal, Upload, Badge } from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles.css';

const { TextArea } = Upload;

const ContractDetail = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationHistory, setOperationHistory] = useState([]);
  const [contractStatuses, setContractStatuses] = useState([]);
  const [relatedAuctions, setRelatedAuctions] = useState([]);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟合同状态数据
    setContractStatuses([
      { id: '1', name: '待签署', color: '#faad14' },
      { id: '2', name: '已签署', color: '#52c41a' },
      { id: '3', name: '已生效', color: '#1890ff' },
      { id: '4', name: '已过期', color: '#8c8c8c' },
      { id: '5', name: '已解除', color: '#ff4d4f' }
    ]);

    // 模拟获取合同详情
    const fetchContractDetail = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟合同详情数据
        const contractDetail = {
          id: '1',
          code: 'CONTRACT-2023-001',
          name: '阿克苏三号地块土地租赁合同',
          type: 1,
          type_name: '土地租赁合同',
          first_party_id: '5',
          first_party_name: '阿克苏农场有限公司',
          first_party_contact: '张经理',
          first_party_phone: '13800138001',
          first_party_address: '新疆阿克苏地区阿克苏市',
          first_party_legal_person: '李总',
          second_party_id: '1',
          second_party_name: '张三',
          second_party_contact: '张三',
          second_party_phone: '13900139001',
          second_party_address: '新疆阿克苏地区温宿县',
          second_party_legal_person: '张三',
          start_date: '2023-03-01',
          end_date: '2024-02-29',
          amount: 580000,
          currency: 'CNY',
          payment_method: '分期支付',
          payment_terms: '合同生效后3日内支付30%，2023年6月1日前支付40%，2023年9月1日前支付30%',
          status: 3,
          status_name: '已生效',
          description: '张三租赁阿克苏农场有限公司所有的阿克苏三号地块，用于棉花种植，租期一年。',
          terms_conditions: [
            '租赁期限：自2023年3月1日起至2024年2月29日止，共计壹年。',
            '租赁用途：仅限于棉花种植，不得擅自改变土地用途。',
            '租金及支付方式：租金总额为人民币580,000元，分三次支付。',
            '甲方权利与义务：提供符合种植条件的土地，协助乙方办理相关手续，定期检查土地使用情况。',
            '乙方权利与义务：按合同约定支付租金，合理使用土地，遵守国家法律法规及甲方相关规定。',
            '违约责任：任何一方违反合同约定，应承担违约责任，并赔偿对方因此遭受的损失。',
            '合同争议解决：如发生争议，双方应协商解决；协商不成的，可向合同签订地人民法院提起诉讼。',
            '其他约定事项：本合同未尽事宜，可由双方另行签订补充协议，补充协议与本合同具有同等法律效力。'
          ],
          related_auction_id: '1',
          related_auction_code: 'AUCTION-2023-001',
          related_auction_name: '阿克苏棉花农场2023年春季拍卖',
          sign_date: '2023-03-05',
          effective_date: '2023-03-10',
          create_time: '2023-02-28 14:30:00',
          update_time: '2023-03-10 10:15:00',
          create_user: '管理员',
          update_user: '管理员',
          attachments: [
            { id: '1', name: '合同正本.pdf', url: '#', size: '2.5MB', type: 'pdf' },
            { id: '2', name: '补充协议.pdf', url: '#', size: '0.8MB', type: 'pdf' },
            { id: '3', name: '土地权属证明.jpg', url: '#', size: '1.2MB', type: 'image' },
            { id: '4', name: '地块平面图.png', url: '#', size: '1.5MB', type: 'image' }
          ],
          signatures: [
            {
              party_id: '5',
              party_name: '阿克苏农场有限公司',
              signature_file: '#',
              sign_date: '2023-03-05'
            },
            {
              party_id: '1',
              party_name: '张三',
              signature_file: '#',
              sign_date: '2023-03-05'
            }
          ]
        };
        
        setContract(contractDetail);
        
        // 模拟操作历史数据
        setOperationHistory([
          {
            id: '1',
            operation_type: '创建合同',
            operation_desc: '管理员创建了合同',
            operator: '管理员',
            operation_time: '2023-02-28 14:30:00'
          },
          {
            id: '2',
            operation_type: '合同审核',
            operation_desc: '系统管理员审核通过了合同',
            operator: '系统管理员',
            operation_time: '2023-03-01 10:15:00'
          },
          {
            id: '3',
            operation_type: '签署合同',
            operation_desc: '阿克苏农场有限公司签署了合同',
            operator: '系统自动操作',
            operation_time: '2023-03-05 09:30:00'
          },
          {
            id: '4',
            operation_type: '签署合同',
            operation_desc: '张三签署了合同',
            operator: '系统自动操作',
            operation_time: '2023-03-05 14:20:00'
          },
          {
            id: '5',
            operation_type: '更新状态',
            operation_desc: '将合同状态从"已签署"更新为"已生效"',
            operator: '管理员',
            operation_time: '2023-03-10 10:15:00'
          },
          {
            id: '6',
            operation_type: '上传附件',
            operation_desc: '上传了附件：补充协议.pdf',
            operator: '管理员',
            operation_time: '2023-03-10 10:30:00'
          }
        ]);
        
        // 模拟相关拍卖数据
        setRelatedAuctions([
          {
            id: '1',
            code: 'AUCTION-2023-001',
            name: '阿克苏棉花农场2023年春季拍卖',
            start_time: '2023-03-01 10:00:00',
            end_time: '2023-03-15 18:00:00',
            status: '已结束'
          }
        ]);
      } catch (error) {
        console.error('获取合同详情失败:', error);
        message.error('获取合同详情失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContractDetail();
    }
  }, [id]);

  // 下载附件
  const handleDownload = (attachment) => {
    // 实际项目中应该调用API下载附件
    console.log('下载附件:', attachment);
    message.success(`正在下载附件：${attachment.name}`);
  };

  // 预览附件
  const handlePreview = (attachment) => {
    // 实际项目中应该根据附件类型进行预览
    console.log('预览附件:', attachment);
    setPreviewFile(attachment);
    setPreviewModalVisible(true);
  };

  // 打印合同
  const handlePrint = () => {
    // 实际项目中应该调用打印功能
    console.log('打印合同:', contract?.id);
    message.success('正在准备打印合同...');
  };

  // 关闭预览模态框
  const handlePreviewModalCancel = () => {
    setPreviewModalVisible(false);
    setPreviewFile(null);
  };

  // 返回列表
  const handleBack = () => {
    navigate('/contract/list');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载合同详情中...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="page-container">
        <div className="empty-container">
          <FileTextOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
          <p>未找到合同信息</p>
          <Button type="primary" onClick={handleBack} style={{ marginTop: 16 }}>
            返回列表
          </Button>
        </div>
      </div>
    );
  }

  const statusObj = contractStatuses.find(s => s.id === contract.status.toString());

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">合同详情</h1>
        <div className="action-buttons">
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            打印合同
          </Button>
          <Button
            type="primary"
            onClick={handleBack}
            style={{ marginLeft: 12 }}
          >
            返回列表
          </Button>
        </div>
      </div>

      {/* 合同基本信息卡片 */}
      <Card className="contract-basic-card">
        <div className="contract-title-section">
          <h2 className="contract-name">{contract.name}</h2>
          <div className="contract-meta">
            <span className="contract-code">{contract.code}</span>
            <Tag color={statusObj?.color || '#d9d9d9'} className="contract-status-tag">
              {statusObj?.name || '未知状态'}
            </Tag>
          </div>
        </div>
        <Divider />
        <Descriptions column={3} bordered>
          <Descriptions.Item label="合同类型">{contract.type_name}</Descriptions.Item>
          <Descriptions.Item label="合同金额">{contract.amount.toLocaleString()} {contract.currency}</Descriptions.Item>
          <Descriptions.Item label="支付方式">{contract.payment_method}</Descriptions.Item>
          <Descriptions.Item label="签订日期">{contract.sign_date || '-'}</Descriptions.Item>
          <Descriptions.Item label="生效日期">{contract.effective_date || '-'}</Descriptions.Item>
          <Descriptions.Item label="结束日期">{contract.end_date || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 合同双方信息 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="甲方信息" className="party-card">
            <Descriptions column={1}>
              <Descriptions.Item label="名称">{contract.first_party_name}</Descriptions.Item>
              <Descriptions.Item label="联系人">{contract.first_party_contact}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{contract.first_party_phone}</Descriptions.Item>
              <Descriptions.Item label="地址">{contract.first_party_address}</Descriptions.Item>
              <Descriptions.Item label="法定代表人">{contract.first_party_legal_person}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="乙方信息" className="party-card">
            <Descriptions column={1}>
              <Descriptions.Item label="名称">{contract.second_party_name}</Descriptions.Item>
              <Descriptions.Item label="联系人">{contract.second_party_contact}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{contract.second_party_phone}</Descriptions.Item>
              <Descriptions.Item label="地址">{contract.second_party_address}</Descriptions.Item>
              <Descriptions.Item label="法定代表人">{contract.second_party_legal_person}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* 合同描述和条款 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="合同描述" className="description-card">
            <div className="description-content">
              {contract.description}
            </div>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="合同条款" className="terms-card">
            <List
              itemLayout="horizontal"
              dataSource={contract.terms_conditions}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    title={<span className="term-number">条款 {index + 1}</span>}
                    description={<span className="term-content">{item}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="支付条款" className="payment-card">
            <div className="payment-content">
              {contract.payment_terms}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 相关信息 */}
      <Row gutter={[16, 16]}>
        {/* 相关拍卖信息 */}
        {contract.related_auction_id && (
          <Col xs={24} md={12}>
            <Card title="相关拍卖" className="related-info-card">
              <div className="related-auction-item">
                <LinkOutlined className="related-icon" />
                <div className="related-content">
                  <div className="related-title">{contract.related_auction_name}</div>
                  <div className="related-code">{contract.related_auction_code}</div>
                </div>
              </div>
            </Card>
          </Col>
        )}

        {/* 合同签署信息 */}
        <Col xs={24} md={contract.related_auction_id ? 12 : 24}>
          <Card title="合同签署信息" className="signature-card">
            <Timeline
              items={contract.signatures.map(signature => ({
                children: (
                  <div className="signature-item">
                    <div className="signature-party">{signature.party_name}</div>
                    <div className="signature-date">签署日期：{signature.sign_date}</div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 附件列表 */}
      {contract.attachments && contract.attachments.length > 0 && (
        <Card title="附件列表" className="attachments-card">
          <List
            itemLayout="horizontal"
            dataSource={contract.attachments}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<FileTextOutlined />}
                    onClick={() => handlePreview(item)}
                  >
                    预览
                  </Button>,
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(item)}
                  >
                    下载
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={item.type === 'image' ? 1 : 0} showZero>
                      <FileTextOutlined className={`file-icon file-icon-${item.type}`} />
                    </Badge>
                  }
                  title={
                    <div className="attachment-title">
                      {item.name}
                      <Tag color="blue" className="attachment-size">
                        {item.size}
                      </Tag>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* 操作历史 */}
      <Card title="操作历史" className="history-card">
        <Timeline
          items={operationHistory.map(history => ({
            children: (
              <div className="history-item">
                <div className="history-header">
                  <span className="history-type">{history.operation_type}</span>
                  <span className="history-time">{history.operation_time}</span>
                </div>
                <div className="history-content">{history.operation_desc}</div>
                <div className="history-operator">
                  <UserOutlined className="operator-icon" />
                  <span>{history.operator}</span>
                </div>
              </div>
            )
          }))}
        />
      </Card>

      {/* 附件预览模态框 */}
      <Modal
        title={previewFile?.name}
        open={previewModalVisible}
        onCancel={handlePreviewModalCancel}
        width={800}
        footer={[
          <Button key="download" onClick={() => handleDownload(previewFile)}>
            <DownloadOutlined /> 下载
          </Button>,
          <Button key="close" onClick={handlePreviewModalCancel}>
            关闭
          </Button>
        ]}
      >
        {previewFile && (
          <div className="preview-content">
            {previewFile.type === 'image' ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="preview-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 100 100%22%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominantBaseline%3D%22middle%22 textAnchor%3D%22middle%22%3E图片预览不可用%3C%2Ftext%3E%3C%2Fsvg%3E';
                }}
              />
            ) : (
              <div className="preview-file">
                <FileTextOutlined className="preview-file-icon" />
                <div className="preview-file-info">
                  <div className="preview-file-name">{previewFile.name}</div>
                  <div className="preview-file-size">{previewFile.size}</div>
                  <p className="preview-file-tip">此文件无法在线预览，请下载后查看</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractDetail;