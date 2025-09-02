import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Divider, Avatar, message } from 'antd';
import { Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getProductById } from '../../api/product';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // 加载产品详情
  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (error) {
      message.error('获取产品详情失败');
      console.error('Failed to fetch product detail:', error);
    }
    setLoading(false);
  };

  // 删除产品
  const handleDelete = () => {
    navigate(`/products`);
    // 实际项目中应该有删除确认和API调用
    message.success('产品已删除');
  };

  // 编辑产品
  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  // 返回产品列表
  const handleBack = () => {
    navigate('/products');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>产品不存在或已被删除</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: '20px' }}
      >
        返回产品列表
      </Button>

      <Card style={{ marginBottom: 16 }}>
          <div className="product-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {product.name}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                编辑
              </Button>
              <Button type="danger" icon={<DeleteOutlined />} onClick={handleDelete}>
                删除
              </Button>
            </div>
          </div>

          <Divider />

          <div className="product-info" style={{ marginBottom: '30px' }}>
            <div className="product-basic-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                  基本信息
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>产品ID:</div>
                  <div>{product.id}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>价格:</div>
                  <div style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{product.price}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>库存:</div>
                  <div>{product.stock}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>状态:</div>
                  <Tag
                    color={product.status === 'active' ? 'success' : 'error'}
                    style={{ padding: '0 10px' }}
                  >
                    {product.status === 'active' ? '在售' : '下架'}
                  </Tag>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>创建时间:</div>
                  <div>{new Date(product.createdAt || Date.now()).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                  产品描述
                </div>
                <div style={{ marginBottom: '16px' }}>
                  {product.description || '暂无产品描述'}
                </div>

                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                  产品特性
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.features && product.features.map((feature, index) => (
                    <Tag key={index} style={{ marginRight: '8px', marginBottom: '8px' }}>{feature}</Tag>
                  ))}
                  {(!product.features || product.features.length === 0) && (
                    <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>暂无特性信息</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="product-actions" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
              添加到购物车
            </Button>
            <Button type="default" size="large">
              查看评价
            </Button>
          </div>

      </Card>
    </div>
  );
};

export default ProductDetail;