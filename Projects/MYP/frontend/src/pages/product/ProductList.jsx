import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space, Select, Modal, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductOrderCount } from '../../api/product';
import { getCategories } from '../../api/category';

const { Option } = Select;

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  

  // 加载产品列表
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 筛选产品
  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchText]);

  // 获取分类数据
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      message.error('获取分类数据失败');
      console.error('Failed to fetch categories:', error);
    }
    setCategoryLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      const productList = response.data || [];
      
      // 为每个产品获取订单数量
      const productsWithOrderCount = await Promise.all(
        productList.map(async product => {
          try {
            const countResponse = await getProductOrderCount(product.id);
            return {
              ...product,
              orderCount: countResponse
            };
          } catch (error) {
            console.error(`Failed to fetch order count for product ${product.id}:`, error);
            return {
              ...product,
              orderCount: 0
            };
          }
        })
      );
      
      setProducts(productsWithOrderCount);
    } catch (error) {
      message.error('获取产品列表失败');
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  };

    // 删除产品
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个产品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success('产品删除成功');
          fetchProducts(); // 重新加载产品列表
        } catch (error) {
          message.error('产品删除失败');
          console.error('Failed to delete product:', error);
        }
      },
    });
  };

  // 搜索产品
  const handleSearch = () => {
    filterProducts();
  };

  // 筛选产品
  const filterProducts = () => {
    let result = [...products];
    
    // 按分类筛选
    if (selectedCategory !== 'all' && selectedCategory) {
      result = result.filter(product => product.categoryId === selectedCategory);
    }
    
    // 按关键词搜索
    if (searchText) {
      result = result.filter(product => 
        product.name.includes(searchText) || 
        product.id.toString().includes(searchText)
      );
    }
    
    setFilteredProducts(result);
  };

  // 按分类筛选
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };
  
  // 刷新订单数量数据
  const refreshOrderCounts = async () => {
    setLoading(true);
    try {
      const updatedProducts = await Promise.all(
        products.map(async product => {
          try {
            const countResponse = await getProductOrderCount(product.id);
            return { 
              ...product,
              orderCount: countResponse
            };
          } catch (error) {
            console.error(`Failed to refresh order count for product ${product.id}:`, error);
            return product;
          }
        })
      );
      setProducts(updatedProducts);
      message.success('订单数量已更新');
    } catch (error) {
      message.error('更新订单数量失败');
    }
    setLoading(false);
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchText('');
    setSelectedCategory('all');
    fetchProducts();
  };

  // 表格列配置
  const columns = [
    { title: '产品ID', dataIndex: 'id', key: 'id' },
    { title: '产品名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price', render: (value) => `¥${value}` },
    { title: '库存', dataIndex: 'stock', key: 'stock' },
    { 
      title: '分类', 
      dataIndex: 'categoryId', 
      key: 'categoryId',
      render: (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : '未分类';
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? '在售' : '下架'}
        </span>
      )
    },
    { 
      title: '订单数量', 
      dataIndex: 'orderCount', 
      key: 'orderCount',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.orderCount - b.orderCount
    },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => navigate(`/products/edit/${record.id}`)}
            >
              编辑
            </Button>
            <Button 
              type="danger" 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>产品管理</h2>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <Select
            placeholder="选择产品分类"
            style={{ width: 150, marginRight: 8 }}
            loading={categoryLoading}
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <Option value="all">全部分类</Option>
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="搜索产品名称或ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button 
            type="default" 
            onClick={resetFilters} 
            style={{ marginLeft: 8 }}
          >
            重置筛选
          </Button>
          <Button 
            type="default" 
            onClick={refreshOrderCounts} 
            style={{ marginLeft: 8 }}
          >
            刷新订单数量
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/products/edit/new')} style={{ marginLeft: 8 }}
          >
            添加产品
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: loading ? '加载中...' : '暂无产品数据'
        }}
      />

      
    </div>
  );
};

export default ProductList;