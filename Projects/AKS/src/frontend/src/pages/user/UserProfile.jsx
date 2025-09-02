import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Form, Input, Select, DatePicker, Radio, Avatar, Button, Upload, message, Tabs, Tag, Badge, Popconfirm, Modal, Switch } from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  FileTextOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  LockOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  SmileOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { format, parseISO } from 'date-fns';
import '../styles.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [editing, setEditing] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [orgOptions, setOrgOptions] = useState([]);
  const [userSettings, setUserSettings] = useState({});
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [workLog, setWorkLog] = useState([]);

  // 模拟数据加载
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟用户基本信息数据
        const mockUserInfo = {
          id: '1',
          username: 'zhang_san',
          name: '张三',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang_san',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          organization: '阿克苏农场有限公司',
          organizationId: '1',
          department: '运营部',
          position: '农场管理员',
          role: '农场管理员',
          roleId: '3',
          idNumber: '110101199001011234',
          gender: '男',
          birthDate: '1990-01-01',
          hireDate: '2020-03-15',
          status: 'active',
          address: '新疆维吾尔自治区阿克苏市',
          emergencyContact: '李四',
          emergencyPhone: '13900139000',
          education: '本科',
          major: '农业管理',
          skills: ['农场管理', '作物种植', '病虫害防治'],
          introduction: '具有5年农场管理经验，熟悉棉花、小麦等作物种植技术。',
          lastLogin: '2023-03-10 15:30:45',
          createTime: '2020-03-15 09:00:00'
        };
        setUserInfo(mockUserInfo);
        
        // 初始化表单数据
        profileForm.setFieldsValue({
          ...mockUserInfo,
          birthDate: mockUserInfo.birthDate ? parseISO(mockUserInfo.birthDate) : null,
          hireDate: mockUserInfo.hireDate ? parseISO(mockUserInfo.hireDate) : null
        });
        
        // 模拟角色选项
        setRoleOptions([
          { id: '1', name: '超级管理员' },
          { id: '2', name: '系统管理员' },
          { id: '3', name: '农场管理员' },
          { id: '4', name: '普通用户' },
          { id: '5', name: '游客' }
        ]);
        
        // 模拟组织选项
        setOrgOptions([
          { id: '1', name: '阿克苏农场有限公司' },
          { id: '2', name: '新疆棉花种植合作社' },
          { id: '3', name: '阿克苏小麦农场' }
        ]);
        
        // 模拟用户权限列表
        setPermissions([
          { id: '1', name: '用户管理', permission: 'user:manage', status: true },
          { id: '2', name: '角色管理', permission: 'role:manage', status: true },
          { id: '3', name: '组织管理', permission: 'org:manage', status: true },
          { id: '4', name: '农场管理', permission: 'farm:manage', status: true },
          { id: '5', name: '土地管理', permission: 'land:manage', status: true },
          { id: '6', name: '基础设施管理', permission: 'infrastructure:manage', status: true },
          { id: '7', name: '拍卖管理', permission: 'auction:manage', status: true },
          { id: '8', name: '合同管理', permission: 'contract:manage', status: true },
          { id: '9', name: '支付管理', permission: 'payment:manage', status: true },
          { id: '10', name: '财务管理', permission: 'finance:manage', status: false },
          { id: '11', name: '数据字典管理', permission: 'dict:manage', status: false },
          { id: '12', name: '菜单管理', permission: 'menu:manage', status: false }
        ]);
        
        // 模拟通知列表
        setNotifications([
          {
            id: '1',
            title: '系统更新通知',
            content: '系统将于2023年3月15日凌晨2:00-4:00进行例行维护，请提前做好准备。',
            type: 'system',
            isRead: true,
            createTime: '2023-03-10 09:30:00'
          },
          {
            id: '2',
            title: '新合同待签署',
            content: '您有一份新的土地租赁合同待签署，请及时处理。',
            type: 'contract',
            isRead: false,
            createTime: '2023-03-09 16:45:00'
          },
          {
            id: '3',
            title: '拍卖即将开始',
            content: '编号为AKS20230301的土地拍卖将于3月12日上午10点开始，请关注。',
            type: 'auction',
            isRead: false,
            createTime: '2023-03-08 14:20:00'
          },
          {
            id: '4',
            title: '月度报表生成',
            content: '2023年2月份财务报表已生成，请查看。',
            type: 'finance',
            isRead: true,
            createTime: '2023-03-05 10:15:00'
          },
          {
            id: '5',
            title: '账户安全提醒',
            content: '您的账户于2023年3月3日在新设备上登录，如非本人操作，请及时修改密码。',
            type: 'security',
            isRead: true,
            createTime: '2023-03-03 08:50:00'
          }
        ]);
        
        // 模拟用户设置
        setUserSettings({
          language: 'zh_CN',
          theme: 'light',
          notificationEnabled: true,
          emailNotification: true,
          smsNotification: false,
          autoLogin: true,
          pageSize: 20,
          timeFormat: '24h',
          dateFormat: 'YYYY-MM-DD'
        });
        
        // 模拟工作日志
        setWorkLog([
          {
            id: '1',
            date: '2023-03-10',
            content: '完成了阿克苏三号地块的春耕准备工作，检查了灌溉系统运行情况。',
            status: 'completed',
            hours: 8
          },
          {
            id: '2',
            date: '2023-03-09',
            content: '参加了农场管理会议，讨论了本年度作物种植计划。',
            status: 'completed',
            hours: 3
          },
          {
            id: '3',
            date: '2023-03-08',
            content: '监督了化肥和农药的采购和发放工作。',
            status: 'completed',
            hours: 6
          },
          {
            id: '4',
            date: '2023-03-07',
            content: '接待了上级农业部门的检查工作。',
            status: 'completed',
            hours: 5
          },
          {
            id: '5',
            date: '2023-03-06',
            content: '制定了本周的农场工作计划和人员安排。',
            status: 'completed',
            hours: 4
          }
        ]);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 处理编辑模式切换
  const handleEditToggle = () => {
    if (editing) {
      // 取消编辑，恢复原始数据
      profileForm.setFieldsValue({
        ...userInfo,
        birthDate: userInfo.birthDate ? parseISO(userInfo.birthDate) : null,
        hireDate: userInfo.hireDate ? parseISO(userInfo.hireDate) : null
      });
    }
    setEditing(!editing);
  };

  // 处理表单提交
  const handleProfileSubmit = async (values) => {
    try {
      setLoading(true);
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 更新用户信息
      const updatedUserInfo = {
        ...userInfo,
        ...values,
        birthDate: values.birthDate ? format(values.birthDate, 'yyyy-MM-dd') : '',
        hireDate: values.hireDate ? format(values.hireDate, 'yyyy-MM-dd') : '',
        organization: orgOptions.find(option => option.id === values.organizationId)?.name || userInfo.organization,
        role: roleOptions.find(option => option.id === values.roleId)?.name || userInfo.role
      };
      
      setUserInfo(updatedUserInfo);
      setEditing(false);
      message.success('个人信息更新成功');
    } catch (error) {
      console.error('更新个人信息失败:', error);
      message.error('更新个人信息失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理密码修改
  const handlePasswordSubmit = async (values) => {
    try {
      setLoading(true);
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟密码修改成功
      message.success('密码修改成功，请重新登录');
      setShowPasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理上传头像
  const handleAvatarUpload = ({ file, onSuccess }) => {
    // 模拟上传成功
    setTimeout(() => {
      onSuccess('ok');
      const updatedUserInfo = {
        ...userInfo,
        avatar: file.originFileObj ? URL.createObjectURL(file.originFileObj) : userInfo.avatar
      };
      setUserInfo(updatedUserInfo);
      profileForm.setFieldsValue({ avatar: updatedUserInfo.avatar });
      message.success('头像上传成功');
    }, 800);
  };

  // 处理通知点击
  const handleNotificationClick = (notification) => {
    // 标记为已读
    if (!notification.isRead) {
      const updatedNotifications = notifications.map(item => 
        item.id === notification.id ? { ...item, isRead: true } : item
      );
      setNotifications(updatedNotifications);
    }
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
  };

  // 处理用户设置变更
  const handleSettingChange = (changedValues, allValues) => {
    setUserSettings(allValues);
  };

  // 获取通知类型图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system':
        return <AlertOutlined className="system-icon" />;
      case 'contract':
        return <FileTextOutlined className="contract-icon" />;
      case 'auction':
        return <SmileOutlined className="auction-icon" />;
      case 'finance':
        return <ClockCircleOutlined className="finance-icon" />;
      case 'security':
        return <LockOutlined className="security-icon" />;
      default:
        return <AlertOutlined className="default-icon" />;
    }
  };

  // 获取通知类型颜色
  const getNotificationColor = (type) => {
    switch (type) {
      case 'system':
        return '#1890ff';
      case 'contract':
        return '#52c41a';
      case 'auction':
        return '#faad14';
      case 'finance':
        return '#722ed1';
      case 'security':
        return '#f5222d';
      default:
        return '#d9d9d9';
    }
  };

  // 获取用户状态文本和颜色
  const getUserStatus = (status) => {
    switch (status) {
      case 'active':
        return { text: '在职', color: '#52c41a' };
      case 'leave':
        return { text: '请假', color: '#faad14' };
      case 'resigned':
        return { text: '已离职', color: '#ff4d4f' };
      case 'probation':
        return { text: '试用期', color: '#1890ff' };
      default:
        return { text: '未知', color: '#d9d9d9' };
    }
  };

  // 上传组件配置
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  const userStatus = getUserStatus(userInfo.status);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">个人中心</h1>
        <div className="action-buttons">
          <Button
            type={editing ? "default" : "primary"}
            icon={editing ? <CloseOutlined /> : <EditOutlined />}
            onClick={handleEditToggle}
            style={{ marginRight: 12 }}
          >
            {editing ? '取消' : '编辑'}
          </Button>
          <Button
            onClick={() => setShowPasswordModal(true)}
            icon={<LockOutlined />}
          >
            修改密码
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={[
          {
            key: '1',
            label: '基本信息',
            icon: <UserOutlined />
          },
          {
            key: '2',
            label: '我的权限',
            icon: <LockOutlined />
          },
          {
            key: '3',
            label: '通知中心',
            icon: <AlertOutlined />,
            badge: {
              count: notifications.filter(n => !n.isRead).length,
              style: { backgroundColor: '#f5222d' }
            }
          },
          {
            key: '4',
            label: '工作日志',
            icon: <ClockCircleOutlined />
          },
          {
            key: '5',
            label: '账户设置',
            icon: <TeamOutlined />
          }
        ]}
      >
        {/* 基本信息标签页 */}
        {activeTabKey === '1' && (
          <div className="profile-content">
            <Card className="profile-card">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={6} className="profile-avatar-col">
                  <div className="profile-avatar-wrapper">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      customRequest={handleAvatarUpload}
                      disabled={!editing}
                    >
                      {userInfo.avatar ? (
                        <Avatar
                          size={160}
                          src={userInfo.avatar}
                          icon={<UserOutlined />}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                    <div className="avatar-tip">点击上传头像（支持JPG、PNG格式，文件大小不超过2MB）</div>
                  </div>
                </Col>
                <Col xs={24} md={18}>
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileSubmit}
                    size="large"
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="username"
                          label="用户名"
                          rules={[{ required: true, message: '请输入用户名' }]}
                        >
                          <Input disabled={!editing} placeholder="请输入用户名" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="name"
                          label="姓名"
                          rules={[{ required: true, message: '请输入姓名' }]}
                        >
                          <Input disabled={!editing} placeholder="请输入姓名" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="gender"
                          label="性别"
                        >
                          {editing ? (
                            <Radio.Group>
                              <Radio.Button value="男">男</Radio.Button>
                              <Radio.Button value="女">女</Radio.Button>
                            </Radio.Group>
                          ) : (
                            <span>{userInfo.gender}</span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="email"
                          label="邮箱"
                          rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                          ]}
                        >
                          <Input disabled={!editing} prefix={<MailOutlined />} placeholder="请输入邮箱" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="phone"
                          label="手机号码"
                          rules={[
                            { required: true, message: '请输入手机号码' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                          ]}
                        >
                          <Input disabled={!editing} prefix={<PhoneOutlined />} placeholder="请输入手机号码" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="birthDate"
                          label="出生日期"
                        >
                          {editing ? (
                            <DatePicker
                              style={{ width: '100%' }}
                              placeholder="请选择出生日期"
                            />
                          ) : (
                            <span>{userInfo.birthDate}</span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="organizationId"
                          label="所属组织"
                        >
                          {editing ? (
                            <Select placeholder="请选择所属组织">
                              {orgOptions.map(option => (
                                <Option key={option.id} value={option.id}>
                                  {option.name}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <span>{userInfo.organization}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="department"
                          label="部门"
                        >
                          <Input disabled={!editing} placeholder="请输入部门" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="position"
                          label="职位"
                        >
                          <Input disabled={!editing} placeholder="请输入职位" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="roleId"
                          label="角色"
                        >
                          {editing ? (
                            <Select placeholder="请选择角色">
                              {roleOptions.map(option => (
                                <Option key={option.id} value={option.id}>
                                  {option.name}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <span>{userInfo.role}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="hireDate"
                          label="入职日期"
                        >
                          {editing ? (
                            <DatePicker
                              style={{ width: '100%' }}
                              placeholder="请选择入职日期"
                            />
                          ) : (
                            <span>{userInfo.hireDate}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          label="状态"
                        >
                          <Tag color={userStatus.color}>
                            {userStatus.text}
                          </Tag>
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="idNumber"
                          label="身份证号"
                        >
                          <Input disabled={!editing} prefix={<IdcardOutlined />} placeholder="请输入身份证号" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="emergencyContact"
                          label="紧急联系人"
                        >
                          <Input disabled={!editing} placeholder="请输入紧急联系人" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="emergencyPhone"
                          label="紧急联系电话"
                        >
                          <Input disabled={!editing} prefix={<PhoneOutlined />} placeholder="请输入紧急联系电话" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name="address"
                          label="联系地址"
                        >
                          <Input.TextArea 
                            disabled={!editing} 
                            rows={2} 
                            placeholder="请输入联系地址"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="education"
                          label="学历"
                        >
                          {editing ? (
                            <Select placeholder="请选择学历">
                              <Option value="专科">专科</Option>
                              <Option value="本科">本科</Option>
                              <Option value="硕士">硕士</Option>
                              <Option value="博士">博士</Option>
                              <Option value="其他">其他</Option>
                            </Select>
                          ) : (
                            <span>{userInfo.education}</span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          name="major"
                          label="专业"
                        >
                          <Input disabled={!editing} placeholder="请输入专业" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name="skills"
                          label="技能标签"
                        >
                          {editing ? (
                            <Select
                              mode="tags"
                              placeholder="请输入技能标签"
                              style={{ width: '100%' }}
                            />
                          ) : (
                            <div>
                              {userInfo.skills?.map((skill, index) => (
                                <Tag key={index} color="blue">
                                  {skill}
                                </Tag>
                              ))}
                            </div>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name="introduction"
                          label="个人简介"
                        >
                          <Input.TextArea 
                            disabled={!editing} 
                            rows={3} 
                            placeholder="请输入个人简介"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          label="最后登录时间"
                        >
                          <div className="readonly-info">
                            {userInfo.lastLogin}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          label="创建时间"
                        >
                          <div className="readonly-info">
                            {userInfo.createTime}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    {editing && (
                      <Row gutter={[16, 16]}>
                        <Col xs={24} style={{ textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            保存
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Form>
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {/* 我的权限标签页 */}
        {activeTabKey === '2' && (
          <div className="permissions-content">
            <Card className="permissions-card">
              <div className="permissions-header">
                <h2>当前角色：{userInfo.role}</h2>
                <p className="permissions-desc">以下是您当前拥有的系统操作权限</p>
              </div>
              <div className="permissions-list">
                <Row gutter={[16, 16]}>
                  {permissions.map((permission) => (
                    <Col xs={24} sm={12} md={8} key={permission.id}>
                      <div className={`permission-item ${permission.status ? 'permission-enabled' : 'permission-disabled'}`}>
                        <div className="permission-header">
                          <span className="permission-name">{permission.name}</span>
                          <Switch
                            checked={permission.status}
                            disabled
                          />
                        </div>
                        <div className="permission-code">
                          权限码：{permission.permission}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="permissions-footer">
                <p className="permissions-summary">
                  共拥有 <span className="permission-count">{permissions.filter(p => p.status).length}</span> / 
                  <span className="permission-total">{permissions.length}</span> 项权限
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* 通知中心标签页 */}
        {activeTabKey === '3' && (
          <div className="notifications-content">
            <Card className="notifications-card">
              <div className="notifications-header">
                <h2>通知列表</h2>
                <div className="notification-actions">
                  <Popconfirm
                    title="确认标记所有通知为已读？"
                    onConfirm={() => {
                      const updatedNotifications = notifications.map(item => ({ ...item, isRead: true }));
                      setNotifications(updatedNotifications);
                      message.success('已将所有通知标记为已读');
                    }}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button type="link">标记全部已读</Button>
                  </Popconfirm>
                </div>
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <AlertOutlined className="no-notifications-icon" />
                    <p>暂无通知</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.isRead ? 'notification-read' : 'notification-unread'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        <span 
                          className="notification-icon-bg"
                          style={{ backgroundColor: getNotificationColor(notification.type) }}
                        >
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="notification-content">
                        <div className="notification-header">
                          <h3 className="notification-title">{notification.title}</h3>
                          <Badge 
                            count={!notification.isRead ? 1 : 0}
                            style={{
                              backgroundColor: '#f5222d',
                              display: notification.isRead ? 'none' : 'inline-flex'
                            }}
                          />
                        </div>
                        <p className="notification-text">{notification.content}</p>
                        <div className="notification-footer">
                          <Tag 
                            color={getNotificationColor(notification.type)}
                            style={{ fontSize: '12px', padding: '0 4px' }}
                          >
                            {notification.type === 'system' && '系统通知'}
                            {notification.type === 'contract' && '合同通知'}
                            {notification.type === 'auction' && '拍卖通知'}
                            {notification.type === 'finance' && '财务通知'}
                            {notification.type === 'security' && '安全通知'}
                          </Tag>
                          <span className="notification-time">{notification.createTime}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* 工作日志标签页 */}
        {activeTabKey === '4' && (
          <div className="worklog-content">
            <Card className="worklog-card">
              <div className="worklog-header">
                <h2>工作日志</h2>
                <Button type="primary" icon={<EditOutlined />}>新增日志</Button>
              </div>
              <div className="worklog-list">
                {workLog.length === 0 ? (
                  <div className="no-worklog">
                    <ClockCircleOutlined className="no-worklog-icon" />
                    <p>暂无工作日志</p>
                  </div>
                ) : (
                  workLog.map((log) => (
                    <div key={log.id} className="worklog-item">
                      <div className="worklog-date">
                        {log.date}
                      </div>
                      <div className="worklog-content">
                        <div className="worklog-header">
                          <Tag color="blue">{log.hours}小时</Tag>
                          <Tag color={log.status === 'completed' ? '#52c41a' : '#faad14'}>
                            {log.status === 'completed' ? '已完成' : '进行中'}
                          </Tag>
                        </div>
                        <p className="worklog-text">{log.content}</p>
                        <div className="worklog-actions">
                          <Button type="link" size="small">编辑</Button>
                          <Button type="link" size="small" danger>删除</Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* 账户设置标签页 */}
        {activeTabKey === '5' && (
          <div className="settings-content">
            <Card className="settings-card">
              <Form
                layout="vertical"
                initialValues={userSettings}
                onValuesChange={handleSettingChange}
                size="large"
              >
                <h2>基础设置</h2>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="language"
                      label="语言"
                    >
                      <Select>
                        <Option value="zh_CN">简体中文</Option>
                        <Option value="en_US">English</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="theme"
                      label="主题"
                    >
                      <Select>
                        <Option value="light">明亮模式</Option>
                        <Option value="dark">暗黑模式</Option>
                        <Option value="auto">跟随系统</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="pageSize"
                      label="每页显示数量"
                    >
                      <Select>
                        <Option value="10">10条</Option>
                        <Option value="20">20条</Option>
                        <Option value="50">50条</Option>
                        <Option value="100">100条</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <h2 style={{ marginTop: '24px' }}>通知设置</h2>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="notificationEnabled"
                      valuePropName="checked"
                      label="启用通知"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="emailNotification"
                      valuePropName="checked"
                      label="邮件通知"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="smsNotification"
                      valuePropName="checked"
                      label="短信通知"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
                
                <h2 style={{ marginTop: '24px' }}>安全设置</h2>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="autoLogin"
                      valuePropName="checked"
                      label="自动登录"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item>
                      <Button type="primary" onClick={() => setShowPasswordModal(true)}>
                        修改密码
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                
                <div style={{ textAlign: 'right', marginTop: '24px' }}>
                  <Button type="primary" onClick={() => message.success('设置保存成功')}>
                    保存设置
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        )}
      </Tabs>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          size="large"
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入当前密码"
              iconRender={(visible) => (
                visible ? (
                  <EyeOutlined onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)} />
                )
              )}
              visibilityToggle={false}
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少为6位' },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: '密码必须包含字母和数字' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码"
              iconRender={(visible) => (
                visible ? (
                  <EyeOutlined onClick={() => setNewPasswordVisible(!newPasswordVisible)} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setNewPasswordVisible(!newPasswordVisible)} />
                )
              )}
              visibilityToggle={false}
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
              iconRender={(visible) => (
                visible ? (
                  <EyeOutlined onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} />
                )
              )}
              visibilityToggle={false}
            />
          </Form.Item>
          
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => {
              setShowPasswordModal(false);
              passwordForm.resetFields();
            }} style={{ marginRight: 12 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              确认修改
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 通知详情弹窗 */}
      <Modal
        title="通知详情"
        open={showNotificationDetail}
        onCancel={() => setShowNotificationDetail(false)}
        footer={null}
        width={600}
      >
        {selectedNotification && (
          <div className="notification-detail">
            <div className="notification-detail-header">
              <Tag 
                color={getNotificationColor(selectedNotification.type)}
                style={{ marginBottom: '12px' }}
              >
                {selectedNotification.type === 'system' && '系统通知'}
                {selectedNotification.type === 'contract' && '合同通知'}
                {selectedNotification.type === 'auction' && '拍卖通知'}
                {selectedNotification.type === 'finance' && '财务通知'}
                {selectedNotification.type === 'security' && '安全通知'}
              </Tag>
              <h2 className="notification-detail-title">{selectedNotification.title}</h2>
              <p className="notification-detail-time">{selectedNotification.createTime}</p>
            </div>
            <div className="notification-detail-content">
              {selectedNotification.content}
            </div>
            {selectedNotification.type === 'contract' && (
              <div className="notification-detail-actions" style={{ marginTop: '24px' }}>
                <Button type="primary" style={{ marginRight: 12 }}>
                  查看合同
                </Button>
                <Button>忽略</Button>
              </div>
            )}
            {selectedNotification.type === 'auction' && (
              <div className="notification-detail-actions" style={{ marginTop: '24px' }}>
                <Button type="primary" style={{ marginRight: 12 }}>
                  参与拍卖
                </Button>
                <Button>忽略</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserProfile;