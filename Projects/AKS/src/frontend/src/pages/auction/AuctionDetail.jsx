import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, InputNumber, message, Row, Col, Timeline, Modal, Form, Input } from 'antd';
import { DollarOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import '../styles.css';

const { TextArea } = Input;

const AuctionDetail = () => {
  const params = useParams();
  const { id } = params;
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidRecords, setBidRecords] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidForm] = Form.useForm();
  const [auctionStatuses, setAuctionStatuses] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟拍卖状态数据
    setAuctionStatuses([
      { id: '1', name: '进行中', color: '#52c41a' },
      { id: '2', name: '已结束', color: '#1890ff' },
      { id: '3', name: '未开始', color: '#faad14' },
      { id: '4', name: '已取消', color: '#ff4d4f' }
    ]);

    // 模拟获取拍卖详情
    const fetchAuctionDetail = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟拍卖详情数据
        const auctionDetail = {
          id: '1',
          code: 'AUCTION-2023-001',
          name: '阿克苏棉花农场2023年春季拍卖',
          land_id: '5',
          land_name: '阿克苏三号地块',
          land_area: 70, // 亩
          land_type: '待开发',
          soil_type: '沙土',
          land_location: '农场东部区域',
          longitude: 80.345678,
          latitude: 40.345678,
          description: '该地块位于阿克苏棉花农场东部区域，面积70亩，适合种植棉花等经济作物。\n土壤类型：沙土\n灌溉条件：有灌溉水源\n交通条件：交通便利\n周边设施：靠近仓库和主要道路\n地块特点：光照充足，排水良好\n适宜作物：棉花、小麦、玉米等',
          start_time: '2023-03-01 10:00:00',
          end_time: '2023-03-15 18:00:00',
          starting_price: 500000, // 起拍价（元）
          increment: 10000, // 加价幅度（元）
          current_price: 580000, // 当前价格（元）
          status: 1, // 1: 进行中, 2: 已结束, 3: 未开始, 4: 已取消
          create_time: '2023-02-01 00:00:00',
          update_time: '2023-03-05 14:30:00',
          create_user: '管理员',
          update_user: '管理员'
        };
        
        setAuction(auctionDetail);
        setCurrentBid(auctionDetail.current_price);
        setBidAmount(Math.max(auctionDetail.current_price, auctionDetail.starting_price) + auctionDetail.increment);
        
        // 模拟竞价记录数据
        setBidRecords([
          { id: '1', auction_id: '1', bidder_id: '1', bidder_name: '李四', price: 510000, bid_time: '2023-03-01 10:05:30' },
          { id: '2', auction_id: '1', bidder_id: '2', bidder_name: '张三', price: 520000, bid_time: '2023-03-01 10:10:45' },
          { id: '3', auction_id: '1', bidder_id: '3', bidder_name: '王五', price: 530000, bid_time: '2023-03-02 14:20:15' },
          { id: '4', auction_id: '1', bidder_id: '1', bidder_name: '李四', price: 540000, bid_time: '2023-03-03 09:30:00' },
          { id: '5', auction_id: '1', bidder_id: '2', bidder_name: '张三', price: 550000, bid_time: '2023-03-04 11:15:20' },
          { id: '6', auction_id: '1', bidder_id: '3', bidder_name: '王五', price: 560000, bid_time: '2023-03-04 15:40:10' },
          { id: '7', auction_id: '1', bidder_id: '2', bidder_name: '张三', price: 570000, bid_time: '2023-03-05 10:20:30' },
          { id: '8', auction_id: '1', bidder_id: '3', bidder_name: '王五', price: 580000, bid_time: '2023-03-05 14:30:00' }
        ]);
      } catch (error) {
        console.error('获取拍卖详情失败:', error);
        message.error('获取拍卖详情失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuctionDetail();
    }
  }, [id]);

  // 倒计时效果
  useEffect(() => {
    let interval = null;
    
    if (auction && auction.status === 1 && auction.end_time) {
      const endTime = new Date(auction.end_time).getTime();
      const calculateCountdown = () => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          setCountdown({ days, hours, minutes, seconds });
        } else {
          // 拍卖结束
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          // 实际项目中应该调用API更新拍卖状态
          console.log('拍卖已结束');
        }
      };
      
      // 立即计算一次
      calculateCountdown();
      
      // 每秒更新一次
      interval = setInterval(calculateCountdown, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [auction]);

  // 打开竞价模态框
  const showBidModal = () => {
    if (!auction || auction.status !== 1) {
      message.warning('该拍卖当前不可竞价');
      return;
    }
    bidForm.resetFields();
    setBidModalVisible(true);
  };

  // 关闭竞价模态框
  const handleBidModalCancel = () => {
    setBidModalVisible(false);
  };

  // 提交竞价
  const handleBidSubmit = async () => {
    try {
      const values = await bidForm.validateFields();
      const bidPrice = values.bid_amount;
      
      // 检查竞价价格是否有效
      if (bidPrice < Math.max(auction.current_price, auction.starting_price) + auction.increment) {
        message.error(`竞价价格必须大于当前价格 ${Math.max(auction.current_price, auction.starting_price).toLocaleString()} 元加上加价幅度 ${auction.increment.toLocaleString()} 元`);
        return;
      }
      
      // 模拟提交竞价
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新当前价格和竞价记录
      setCurrentBid(bidPrice);
      
      // 模拟获取当前登录用户信息
      const currentUser = {
        id: 'current',
        name: '当前用户'
      };
      
      const newBidRecord = {
        id: `new-${Date.now()}`,
        auction_id: auction.id,
        bidder_id: currentUser.id,
        bidder_name: currentUser.name,
        price: bidPrice,
        bid_time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
      
      setBidRecords([newBidRecord, ...bidRecords]);
      
      // 关闭模态框
      setBidModalVisible(false);
      message.success('竞价成功！');
      
      // 更新下一次竞价金额
      setBidAmount(bidPrice + auction.increment);
    } catch (error) {
      console.error('竞价失败:', error);
      message.error('竞价失败，请重试');
    }
  };

  // 格式化倒计时
  const formatCountdown = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载拍卖详情中...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="page-container">
        <div className="empty-container">
          <InfoCircleOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
          <p>未找到拍卖信息</p>
        </div>
      </div>
    );
  }

  const statusObj = auctionStatuses.find(s => s.id === auction.status.toString());
  const isAuctionActive = auction.status === 1;
  const isAuctionEnded = auction.status === 2;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">拍卖详情</h1>
        <div className="action-buttons">
          {isAuctionActive && (
            <Button
              type="primary"
              size="large"
              icon={<DollarOutlined />}
              onClick={showBidModal}
            >
              我要竞价
            </Button>
          )}
        </div>
      </div>

      {/* 拍卖基本信息卡片 */}
      <Card className="auction-basic-card">
        <div className="auction-title-section">
          <h2 className="auction-name">{auction.name}</h2>
          <Tag color={statusObj?.color || '#d9d9d9'} className="auction-status-tag">
            {statusObj?.name || '未知状态'}
          </Tag>
        </div>
        <div className="auction-code-section">
          <span className="auction-code-label">拍卖编号：</span>
          <span className="auction-code">{auction.code}</span>
        </div>
      </Card>

      {/* 拍卖价格信息 */}
      {isAuctionActive && (
        <Card className="auction-price-card">
          <div className="price-section">
            <div className="current-price">
              <div className="price-label">当前价格</div>
              <div className="price-value">
                <DollarOutlined className="price-icon" />
                <span>{currentBid.toLocaleString()}</span>
                <span className="price-unit">元</span>
              </div>
            </div>
            <div className="price-info">
              <div className="price-item">
                <div className="price-item-label">起拍价</div>
                <div className="price-item-value">{auction.starting_price.toLocaleString()} 元</div>
              </div>
              <div className="price-item">
                <div className="price-item-label">加价幅度</div>
                <div className="price-item-value">{auction.increment.toLocaleString()} 元</div>
              </div>
            </div>
          </div>
          
          {/* 倒计时 */}
          {countdown && (
            <div className="countdown-section">
              <div className="countdown-label">距离拍卖结束还有</div>
              <div className="countdown-timer">
                <div className="countdown-item">
                  <div className="countdown-number">{formatCountdown(countdown.days)}</div>
                  <div className="countdown-unit">天</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <div className="countdown-number">{formatCountdown(countdown.hours)}</div>
                  <div className="countdown-unit">时</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <div className="countdown-number">{formatCountdown(countdown.minutes)}</div>
                  <div className="countdown-unit">分</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <div className="countdown-number">{formatCountdown(countdown.seconds)}</div>
                  <div className="countdown-unit">秒</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 拍卖详情信息 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="拍卖详情" className="detail-card">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="拍卖地块">
                {auction.land_name}
              </Descriptions.Item>
              <Descriptions.Item label="地块面积">
                {auction.land_area} 亩
              </Descriptions.Item>
              <Descriptions.Item label="地块类型">
                {auction.land_type}
              </Descriptions.Item>
              <Descriptions.Item label="土壤类型">
                {auction.soil_type}
              </Descriptions.Item>
              <Descriptions.Item label="地块位置">
                <div className="location-info">
                  <EnvironmentOutlined className="location-icon" />
                  <span>{auction.land_location}</span>
                </div>
                {auction.longitude && auction.latitude && (
                  <div className="coordinates-info">
                    经度：{auction.longitude}，纬度：{auction.latitude}
                  </div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="拍卖时间">
                <div className="time-info">
                  <div className="time-item">
                    <CalendarOutlined className="time-icon" />
                    <span className="time-label">开始时间：</span>
                    <span>{auction.start_time}</span>
                  </div>
                  <div className="time-item">
                    <ClockCircleOutlined className="time-icon" />
                    <span className="time-label">结束时间：</span>
                    <span>{auction.end_time}</span>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="拍卖描述">
                <div className="description-content">
                  {auction.description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          {/* 竞价记录 */}
          <Card title="竞价记录" className="bid-records-card">
            {bidRecords.length > 0 ? (
              <Timeline
                items={bidRecords.map(record => ({
                  children: (
                    <div className="bid-record-item">
                      <div className="bid-record-header">
                        <span className="bidder-name">{record.bidder_name}</span>
                        <span className="bid-price">{record.price.toLocaleString()} 元</span>
                      </div>
                      <div className="bid-record-time">{record.bid_time}</div>
                    </div>
                  )
                }))}
              />
            ) : (
              <div className="empty-bid-records">
                <InfoCircleOutlined style={{ fontSize: 24, color: '#ccc', marginBottom: 8 }} />
                <p>暂无竞价记录</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 竞价模态框 */}
      <Modal
        title="我要竞价"
        open={bidModalVisible}
        onOk={handleBidSubmit}
        onCancel={handleBidModalCancel}
        width={500}
        okButtonProps={{ type: 'primary' }}
      >
        <Form
          form={bidForm}
          layout="vertical"
          className="bid-form"
          initialValues={{ bid_amount: bidAmount }}
        >
          <div className="bid-form-info">
            <div className="bid-form-info-item">
              <span className="bid-form-info-label">当前价格：</span>
              <span className="bid-form-info-value font-medium">{currentBid.toLocaleString()} 元</span>
            </div>
            <div className="bid-form-info-item">
              <span className="bid-form-info-label">加价幅度：</span>
              <span className="bid-form-info-value">{auction.increment.toLocaleString()} 元</span>
            </div>
            <div className="bid-form-info-item">
              <span className="bid-form-info-label">最小出价：</span>
              <span className="bid-form-info-value text-primary font-medium">
                {(Math.max(currentBid, auction.starting_price) + auction.increment).toLocaleString()} 元
              </span>
            </div>
          </div>
          
          <Form.Item
            label="我的出价（元）"
            name="bid_amount"
            rules={[
              { required: true, message: '请输入您的出价' },
              { type: 'number', message: '请输入有效数字' },
              { min: Math.max(currentBid, auction.starting_price) + auction.increment,
                message: `出价必须大于等于 ${(Math.max(currentBid, auction.starting_price) + auction.increment).toLocaleString()} 元` }
            ]}
          >
            <InputNumber 
              prefix={<DollarOutlined />}
              placeholder="请输入您的出价"
              style={{ width: '100%' }}
              step={auction.increment}
              onChange={(value) => setBidAmount(value || 0)}
            />
          </Form.Item>
          
          <Form.Item
            label="竞价备注"
            name="bid_note"
          >
            <TextArea rows={3} placeholder="选填，输入您的竞价备注信息" />
          </Form.Item>
          
          <div className="bid-form-tips">
            <InfoCircleOutlined className="tips-icon" />
            <div className="tips-content">
              <p>1. 请确认您的出价金额，一旦出价将无法撤回。</p>
              <p>2. 出价成功后，系统将自动扣减您的保证金。</p>
              <p>3. 拍卖结束后，未中标的保证金将原路退回。</p>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AuctionDetail;