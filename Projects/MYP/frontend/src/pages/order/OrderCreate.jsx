import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, message, Divider, Table, Space } from 'antd';
import { PlusOutlined, MinusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../api/order';
import { getProducts } from '../../api/product';

const { Option } = Select;

const OrderCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载产品列表
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data || []);
    } catch (error) {
      message.error('获取产品列表失败');
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  };

  // 添加订单项
  const addOrderItem = () => {
    const newItem = {
      id: Date.now(), // 临时ID
      productId: '',
      productName: '',
      price: 0,
      quantity: 1,
      subtotal: 0
    };
    setOrderItems([...orderItems, newItem]);
  };

  // 删除订单项
  const removeOrderItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  // 选择产品
  const handleProductSelect = (value, index) => {
    const product = products.find(p => p.id === value);
    if (product) {
      const newItems = [...orderItems];
      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        productName: product.name,
        price: product.price,
        subtotal: product.price * newItems[index].quantity
      };
      setOrderItems(newItems);
    }
  };

  // 更新数量
  const handleQuantityChange = (value, index) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      quantity: value,
      subtotal: newItems[index].price * value
    };
    setOrderItems(newItems);
  };

  // 计算订单总额
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // 提交订单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 验证订单项
      if (orderItems.length === 0) {
        message.error('请至少添加一个订单项');
        return;
      }
      
      if (orderItems.some(item => !item.productId || item.quantity <= 0)) {
        message.error('请检查所有订单项，确保已选择产品且数量大于0');
        return;
      }
      
      // 准备订单数据
      const orderData = {
        ...values,
        items: orderItems,
        totalAmount: calculateTotal(),
        status: 'pending'
      };
      
      // 提交订单
      await createOrder(orderData);
      message.success('订单创建成功');
      navigate('/orders');
    } catch (error) {
      message.error('订单创建失败，请重试');
      console.error('Failed to create order:', error);
    }
  };

  // 订单项表格列配置
  const itemColumns = [
    {
      title: '产品名称',
      dataIndex: 'productId',
      key: 'productId',
      render: (_, record, index) => (
        <Select
          placeholder="选择产品"
          value={record.productId || undefined}
          onChange={(value) => handleProductSelect(value, index)}
          style={{ width: 200 }}
          loading={loading}
        >
          {products.map(product => (
            <Option key={product.id} value={product.id}>{product.name} - ¥{product.price}</Option>
          ))}
        </Select>
      )
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record, index) => (
        <InputNumber
          min={1}
          defaultValue={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(value, index)}
          style={{ width: 80 }}
        />
      )
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal) => `¥${subtotal}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, __, index) => (
        <Button
          danger
          icon={<MinusOutlined />}
          onClick={() => removeOrderItem(index)}
        >
          删除
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
          style={{ marginRight: 16 }}
        >
          返回
        </Button>
        <h2>创建订单</h2>
      </div>

      <Form form={form} layout="vertical" style={{ maxWidth: 800 }}>
        <Form.Item
          name="customerName"
          label="客户名称"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <Input placeholder="请输入客户名称" />
        </Form.Item>

        <Form.Item
          name="contactPhone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>

        <Form.Item
          name="deliveryAddress"
          label="配送地址"
          rules={[{ required: true, message: '请输入配送地址' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入配送地址" />
        </Form.Item>

        <Form.Item
          name="remark"
          label="备注信息"
        >
          <Input.TextArea rows={2} placeholder="请输入备注信息" />
        </Form.Item>

        <Divider>
          <span style={{ fontWeight: 'bold' }}>订单商品</span>
        </Divider>

        <div style={{ marginBottom: '16px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addOrderItem}>
            添加商品
          </Button>
        </div>

        <Table
          columns={itemColumns}
          dataSource={orderItems}
          pagination={false}
          rowKey="id"
          size="small"
          style={{ marginBottom: '16px' }}
        />

        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <h3 style={{ color: '#1890ff' }}>订单总额: ¥{calculateTotal()}</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => navigate('/orders')}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>提交订单</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default OrderCreate;