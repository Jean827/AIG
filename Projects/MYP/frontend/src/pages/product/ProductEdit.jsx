import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, message, Card } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { getProductById, updateProduct, createProduct } from '../../api/product';
import { getCategories } from '../../api/category';


const { Option } = Select;

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState(id === 'new' ? { status: 'active', features: [], categoryId: null } : null);

  // 状态选项
  const statusOptions = [
    { value: 'active', label: '在售' },
    { value: 'inactive', label: '下架' },
  ];

  // 加载分类数据
  useEffect(() => {
    fetchCategories();
  }, []);

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

  // 加载产品数据
  useEffect(() => {
    if (id !== 'new') {
      fetchProductData();
    } else {
      setInitialValues({ status: 'active', features: [] });
      form.setFieldsValue({ status: 'active', features: [] });
      setLoading(false);
    }
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await getProductById(id);
      const productData = response.data;
      setInitialValues(productData);
      form.setFieldsValue(productData);
    } catch (error) {
      message.error('获取产品数据失败');
      console.error('Failed to fetch product data:', error);
    }
    setLoading(false);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (id === 'new') {
        await createProduct(values);
        message.success('产品创建成功');
        navigate('/products');
      } else {
        await updateProduct(id, values);
        message.success('产品更新成功');
        navigate(`/products/${id}`);
      }
    } catch (error) {
      message.error(id === 'new' ? '创建产品失败，请重试' : '更新产品失败，请重试');
      console.error('Failed to submit product:', error);
    } finally {
      setLoading(false);
    }
  };

  // 返回产品列表
  const handleBack = () => {
    navigate('/products');
  };

  if (loading && !initialValues) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>;
  }

  if (!initialValues) {
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

        <Card style={{ marginBottom: 16 }} title={id === 'new' ? '创建产品' : '编辑产品'}>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
          >
            <Form.Item
              name="name"
              label="产品名称"
              rules={[{ required: true, message: '请输入产品名称' }]}
            >
              <Input placeholder="请输入产品名称" />
            </Form.Item>

            <Form.Item
              name="price"
              label="价格"
              rules={[{ required: true, message: '请输入产品价格' }]}
            >
              <InputNumber
                placeholder="请输入产品价格"
                min={0}
                step={0.01}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="stock"
              label="库存"
              rules={[{ required: true, message: '请输入产品库存' }]}
            >
              <InputNumber
                placeholder="请输入产品库存"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择产品状态' }]}
            >
              <Select placeholder="请选择产品状态">
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="产品分类"
              rules={[{ required: true, message: '请选择产品分类' }]}
            >
              <Select placeholder="请选择产品分类" loading={categoryLoading}>
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="产品描述"
            >
              <Input.TextArea rows={4} placeholder="请输入产品描述" />
            </Form.Item>

            <Form.Item
              name="features"
              label="产品特性"
            >
              <div>
                <Input
                  placeholder="请输入产品特性，多个特性用逗号分隔"
                  onChange={(e) => {
                    const value = e.target.value;
                    form.setFieldsValue({
                      features: value ? value.split(',').map(item => item.trim()) : [],
                    });
                  }}
                  value={initialValues.features && initialValues.features.join(', ')}
                />
                <div style={{ display: 'block', marginTop: '5px', color: 'rgba(0, 0, 0, 0.5)' }}>
                  多个特性请用逗号分隔
                </div>
              </div>
            </Form.Item>

            <Form.Item style={{ marginTop: '30px' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                htmlType="submit"
                style={{ width: '100%' }}
              >
                {id === 'new' ? '创建产品' : '保存修改'}
              </Button>
              </Form.Item>
            </Form>
        </Card>
    </div>
  );
};

export default ProductEdit;