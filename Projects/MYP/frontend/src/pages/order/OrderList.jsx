import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Select, DatePicker, Input, Modal } from 'antd';
import { SearchOutlined, FilterOutlined, SyncOutlined, EyeOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getOrders, getOrderById, updateOrder, cancelOrder } from '../../api/order';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // 订单状态选项
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待付款' },
    { value: 'paid', label: '已付款' },
    { value: 'shipped', label: '已发货' },
    { value: 'delivered', label: '已送达' },
    { value: 'cancelled', label: '已取消' },
  ];

  // 加载订单列表
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (error) {
      message.error('获取订单列表失败');
      console.error('Failed to fetch orders:', error);
    }
    setLoading(false);
  };

  // 获取订单详情
  const fetchOrderDetail = async (id) => {
    try {
      const response = await getOrderById(id);
      setCurrentOrder(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取订单详情失败');
      console.error('Failed to fetch order detail:', error);
    }
  };

  // 取消订单
  const handleCancelOrder = (id) => {
    Modal.confirm({
      title: '确认取消订单',
      content: '确定要取消这个订单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await cancelOrder(id);
          message.success('订单已取消');
          fetchOrders(); // 重新加载订单列表
        } catch (error) {
          message.error('取消订单失败');
          console.error('Failed to cancel order:', error);
        }
      },
    });
  };

  // 搜索和筛选订单
  const filterOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // 搜索文本
      if (searchText) {
        params.query = searchText;
      }
      
      // 状态筛选
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      // 日期范围筛选
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await getOrders(params);
      setOrders(response.data || []);
    } catch (error) {
      message.error('筛选订单失败');
      console.error('Failed to filter orders:', error);
    }
    setLoading(false);
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setDateRange([]);
    fetchOrders();
  };

  // 表格列配置
  const columns = [
    { title: '订单ID', dataIndex: 'id', key: 'id' },
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName' },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (value) => `¥${value}` },
    { 
      title: '订单状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';

        switch (status) {
          case 'pending':
            color = 'orange';
            text = '待付款';
            break;
          case 'paid':
            color = 'blue';
            text = '已付款';
            break;
          case 'shipped':
            color = 'purple';
            text = '已发货';
            break;
          case 'delivered':
            color = 'green';
            text = '已送达';
            break;
          case 'cancelled':
            color = 'red';
            text = '已取消';
            break;
          default:
            color = 'black';
            text = status;
        }

        return <span style={{ color }}>{text}</span>;
      }
    },
    { title: '下单日期', dataIndex: 'orderDate', key: 'orderDate' },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => fetchOrderDetail(record.id)}
          >
            查看详情
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => navigate(`/orders/edit/${record.id}`)}
            disabled={record.status === 'cancelled'}
          >
            编辑
          </Button>
          <Button 
            type="danger" 
            icon={<CloseOutlined />} 
            size="small" 
            onClick={() => handleCancelOrder(record.id)}
            disabled={record.status === 'delivered' || record.status === 'cancelled'}
          >
            取消订单
          </Button>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>订单管理</h2>
        <Button type="primary" onClick={() => navigate('/orders/create')}>创建订单</Button>
      </div>

      <div style={{ display: 'flex', marginBottom: '16px', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="搜索订单号或客户名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={filterOrders}>搜索</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>状态:</span>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 120, marginRight: 8 }}
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>日期范围:</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ marginRight: 8 }}
          />
          <Button type="default" icon={<FilterOutlined />} onClick={filterOrders}>筛选</Button>
        </div>

        <Button type="default" icon={<SyncOutlined />} onClick={resetFilters}>重置/刷新</Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentOrder && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>基本信息</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>订单编号: {currentOrder.orderNo}</div>
                <div>客户名称: {currentOrder.customerName}</div>
                <div>订单金额: ¥{currentOrder.totalAmount}</div>
                <div>下单日期: {currentOrder.orderDate}</div>
                <div>订单状态: 
                  <span style={{ 
                    color: currentOrder.status === 'pending' ? 'orange' : 
                           currentOrder.status === 'paid' ? 'blue' :
                           currentOrder.status === 'shipped' ? 'purple' :
                           currentOrder.status === 'delivered' ? 'green' :
                           currentOrder.status === 'cancelled' ? 'red' : 'black'
                  }}>
                    {currentOrder.status === 'pending' ? '待付款' :
                     currentOrder.status === 'paid' ? '已付款' :
                     currentOrder.status === 'shipped' ? '已发货' :
                     currentOrder.status === 'delivered' ? '已送达' :
                     currentOrder.status === 'cancelled' ? '已取消' : currentOrder.status}
                  </span>
                </div>
              </div>
            </div>
            
            {currentOrder.items && (
              <div>
                <h3>订单商品</h3>
                <Table
                  columns={[
                    { title: '商品名称', dataIndex: 'productName', key: 'productName' },
                    { title: '单价', dataIndex: 'price', key: 'price', render: (value) => `¥${value}` },
                    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                    { title: '小计', dataIndex: 'subtotal', key: 'subtotal', render: (value) => `¥${value}` },
                  ]}
                  dataSource={currentOrder.items}
                  pagination={false}
                  rowKey="id"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;