import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Space,
  Divider,
  Row,
  Col,
  Card,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  KeyOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  SolutionOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getRoles,
  getOrganizations,
} from "../../services/systemService";
import "../styles.css";

const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    roleId: "",
    organizationId: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 从API获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取用户数据
      const usersData = await getUsers();
      // 转换数据格式以匹配组件需求
      setUsers(
        usersData.map((user) => ({
          id: user.id,
          username: user.username,
          real_name: user.name,
          email: user.email,
          phone: user.phone,
          role_id: user.role_id,
          role_name: user.role_name,
          organization_id: user.organization_id,
          organization_name: user.organization_name,
          status: user.status,
          create_time: new Date(user.create_time).toLocaleString(),
          update_time: new Date(user.update_time).toLocaleString(),
        })),
      );

      // 获取角色数据
      const rolesData = await getRoles();
      setRoles(rolesData);

      // 获取组织机构数据
      const orgsData = await getOrganizations();
      setOrganizations(orgsData);
    } catch (error) {
      console.error("获取数据失败:", error);
      message.error("获取数据失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 搜索和筛选功能
  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1); // 重置为第一页
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      keyword: "",
      roleId: "",
      organizationId: "",
      status: "",
    });
    setCurrentPage(1); // 重置为第一页
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchData();
  };

  // 过滤用户数据
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 关键词搜索（用户名、姓名、邮箱、电话）
      const keywordMatch =
        searchParams.keyword === "" ||
        user.username
          .toLowerCase()
          .includes(searchParams.keyword.toLowerCase()) ||
        user.real_name
          .toLowerCase()
          .includes(searchParams.keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        user.phone.includes(searchParams.keyword);

      // 角色筛选
      const roleMatch =
        searchParams.roleId === "" || user.role_id === searchParams.roleId;

      // 组织机构筛选
      const orgMatch =
        searchParams.organizationId === "" ||
        user.organization_id === searchParams.organizationId;

      // 状态筛选
      const statusMatch =
        searchParams.status === "" ||
        user.status.toString() === searchParams.status;

      return keywordMatch && roleMatch && orgMatch && statusMatch;
    });
  }, [users, searchParams]);

  // 分页逻辑
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  // 打开添加/编辑用户模态框
  const showModal = (user = null) => {
    setCurrentUser(user);
    if (user) {
      // 编辑模式，填充表单数据
      form.setFieldsValue({
        username: user.username,
        real_name: user.real_name,
        email: user.email,
        phone: user.phone,
        role_id: user.role_id,
        organization_id: user.organization_id,
        status: user.status,
      });
    } else {
      // 添加模式，重置表单
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  // 处理表单提交
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setFormSubmitting(true);
      if (currentUser) {
        // 更新用户
        await updateUser(currentUser.id, {
          ...values,
          name: values.real_name, // 调整字段名称以匹配API需求
        });
        message.success("用户更新成功");
      } else {
        // 添加用户
        await createUser({
          ...values,
          name: values.real_name, // 调整字段名称以匹配API需求
        });
        message.success("用户添加成功");
      }
      handleCancel();
      fetchData();
    } catch (error) {
      console.error("用户操作失败:", error);
      message.error("用户操作失败");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 删除用户
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      message.success("用户删除成功");
    } catch (error) {
      console.error("删除用户失败:", error);
      message.error(error.message || "删除用户失败，请重试");
    }
  };

  // 重置密码
  const handleResetPassword = async (userId) => {
    try {
      await resetPassword(userId);
      message.success("密码已重置为123456");
    } catch (error) {
      console.error("重置密码失败:", error);
      message.error("重置密码失败，请重试");
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: "姓名",
      dataIndex: "real_name",
      key: "real_name",
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true,
      render: (text) => <a href={`tel:${text}`}>{text}</a>,
    },
    {
      title: "角色",
      dataIndex: "role_name",
      key: "role_name",
      ellipsis: true,
    },
    {
      title: "所属机构",
      dataIndex: "organization_name",
      key: "organization_name",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === 1 ? "#52c41a" : "#d9d9d9" }}>
          {status === 1 ? "启用" : "禁用"}
        </span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record.id)}
            size="small"
          >
            重置密码
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个用户吗？"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">用户管理</h1>
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            size="middle"
          >
            添加用户
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
            size="middle"
            style={{ marginLeft: 8 }}
          >
            刷新
          </Button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <Card className="search-container" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8} xl={6}>
            <Search
              placeholder="搜索用户名、姓名、邮箱、电话"
              allowClear
              enterButton="搜索"
              size="middle"
              value={searchParams.keyword}
              onChange={(e) =>
                setSearchParams({ ...searchParams, keyword: e.target.value })
              }
              onSearch={(value) =>
                handleSearch({ ...searchParams, keyword: value })
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <Select
              placeholder="选择角色"
              allowClear
              style={{ width: "100%" }}
              size="middle"
              value={searchParams.roleId}
              onChange={(value) =>
                setSearchParams({ ...searchParams, roleId: value })
              }
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <Select
              placeholder="选择所属机构"
              allowClear
              style={{ width: "100%" }}
              size="middle"
              value={searchParams.organizationId}
              onChange={(value) =>
                setSearchParams({ ...searchParams, organizationId: value })
              }
            >
              {organizations.map((org) => (
                <Option key={org.id} value={org.id}>
                  {org.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={6}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Select
                  placeholder="选择状态"
                  allowClear
                  style={{ width: "100%" }}
                  size="middle"
                  value={searchParams.status}
                  onChange={(value) =>
                    setSearchParams({ ...searchParams, status: value })
                  }
                >
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  onClick={handleReset}
                  style={{ width: "100%" }}
                  size="middle"
                >
                  重置筛选
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 用户数据表格 */}
      <Spin spinning={loading}>
        {filteredUsers.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">
              <SearchOutlined />
            </div>
            <div className="empty-text">暂无匹配的用户数据</div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={paginatedUsers}
            rowKey="id"
            className="data-table"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredUsers.length,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: (page) => setCurrentPage(page),
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setCurrentPage(1);
              },
            }}
            scroll={{ x: 1200 }}
            rowClassName="hover-row"
            loading={loading}
          />
        )}
      </Spin>

      <Modal
        title={currentUser ? "编辑用户" : "添加用户"}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        width={700}
        maskClosable={false}
        keyboard={true}
        className="user-modal"
        okButtonProps={{ size: "middle" }}
        cancelButtonProps={{ size: "middle" }}
      >
        <Form
          form={form}
          layout="vertical"
          className="form-container"
          initialValues={{
            status: 1,
          }}
          validateMessages={{
            required: "${label}不能为空",
            types: {
              email: "请输入有效的${label}",
            },
            number: {
              min: "${label}不能小于${min}",
            },
          }}
          onValuesChange={(changedValues, allValues) => {
            // 实时验证表单输入
            if (changedValues.username) {
              form.validateFields(["username"]);
            }
            if (changedValues.email) {
              form.validateFields(["email"]);
            }
            if (changedValues.phone) {
              form.validateFields(["phone"]);
            }
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="username"
                label="用户名"
                tooltip="用户名只能包含字母、数字和下划线，长度为4-20位"
                rules={[
                  { required: true, message: "请输入用户名" },
                  {
                    pattern: /^[a-zA-Z0-9_]{4,20}$/,
                    message: "用户名只能包含字母、数字和下划线，长度为4-20位",
                  },
                ]}
              >
                <Input
                  placeholder="请输入用户名"
                  showCount
                  maxLength={20}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="real_name"
                label="姓名"
                rules={[{ required: true, message: "请输入姓名" }]}
              >
                <Input
                  placeholder="请输入姓名"
                  showCount
                  maxLength={50}
                  prefix={<SolutionOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: "请输入邮箱" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input
                  placeholder="请输入邮箱"
                  showCount
                  maxLength={100}
                  prefix={<MailOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[
                  { required: true, message: "请输入电话" },
                  { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码" },
                ]}
              >
                <Input
                  placeholder="请输入电话"
                  showCount
                  maxLength={11}
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="role_id"
                label="角色"
                rules={[{ required: true, message: "请选择角色" }]}
              >
                <Select
                  placeholder="请选择角色"
                  size="middle"
                  showSearch
                  optionFilterProp="children"
                >
                  {roles.map((role) => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="organization_id"
                label="所属机构"
                rules={[{ required: true, message: "请选择所属机构" }]}
              >
                <Select
                  placeholder="请选择所属机构"
                  size="middle"
                  showSearch
                  optionFilterProp="children"
                >
                  {organizations.map((org) => (
                    <Option key={org.id} value={org.id}>
                      {org.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="status"
                label="状态"
                className="form-item-status"
              >
                <Select placeholder="请选择状态" size="middle">
                  <Option value={1}>启用</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!currentUser && (
            <Form.Item
              name="password"
              label="初始密码"
              tooltip="密码至少8位，包含大小写字母、数字和特殊字符"
              rules={[
                { required: true, message: "请输入初始密码" },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "密码至少8位，包含大小写字母、数字和特殊字符",
                },
              ]}
            >
              <Input.Password
                placeholder="请输入初始密码"
                visibilityToggle
                showCount
                maxLength={20}
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
