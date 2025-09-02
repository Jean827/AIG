// mock/auth.js
// 模拟认证API的响应

// 模拟用户数据库
let mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // 实际项目中应该是加密的密码
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user1',
    password: 'user123',
    email: 'user1@example.com',
    role: 'user'
  },
  {
    id: 3,
    username: 'test',
    password: 'test123',
    email: 'test@example.com',
    role: 'user'
  }
];

// 模拟token生成函数
const generateToken = (user) => {
  // 在实际项目中，这应该是一个加密的JWT
  return `mock-jwt-token-${user.id}-${Date.now()}`;
};

// 注册API的mock
const mockRegister = (req, res) => {
  const { username, password, email } = req.body;
  
  // 检查用户名是否已存在
  if (mockUsers.some(user => user.username === username)) {
    res.statusCode = 400;
    res.end(JSON.stringify({
      message: '用户名已存在'
    }));
    return;
  }
  
  // 检查邮箱是否已存在
  if (mockUsers.some(user => user.email === email)) {
    res.statusCode = 400;
    res.end(JSON.stringify({
      message: '邮箱已被注册'
    }));
    return;
  }
  
  // 创建新用户
  const newUser = {
    id: mockUsers.length + 1,
    username,
    password, // 实际项目中应该加密存储
    email,
    role: 'user'
  };
  
  mockUsers.push(newUser);
  
  res.statusCode = 201;
  res.end(JSON.stringify({
    message: '注册成功',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }
  }));
};

// 登录API的mock
const mockLogin = (req, res) => {
  const { username, password } = req.body;
  
  // 查找用户
  const user = mockUsers.find(
    u => u.username === username && u.password === password
  );
  
  if (!user) {
    res.statusCode = 401;
    res.end(JSON.stringify({
      message: '用户名或密码错误'
    }));
    return;
  }
  
  // 生成token
  const token = generateToken(user);
  
  res.statusCode = 200;
  res.end(JSON.stringify({
    token,
    id: user.id,
    username: user.username,
    email: user.email,
    roles: [{ name: user.role }]  // 修改为roles复数形式，以匹配useAuth.js的期望
  }));
};

// 获取用户信息API的mock
const mockGetUserInfo = (req, res) => {
  // 从请求头中获取token
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({
      message: '未授权'
    }));
    return;
  }
  
  // 从token中解析用户ID
  // 实际项目中应该验证JWT的有效性
  const userId = parseInt(token.split('-')[3]);
  
  // 查找用户
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    res.statusCode = 404;
    res.end(JSON.stringify({
      message: '用户不存在'
    }));
    return;
  }
  
  res.statusCode = 200;
  res.end(JSON.stringify({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }));
};

// 登出API的mock
const mockLogout = (req, res) => {
  // 在实际项目中，这里应该使token失效
  res.statusCode = 200;
  res.end(JSON.stringify({
    message: '登出成功'
  }));
};

// 模拟忘记密码API
export const mockForgotPassword = (req, res) => {
  const { email } = req.body;
  
  // 查找用户
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    res.statusCode = 404;
    res.end(JSON.stringify({
      message: '未找到该邮箱对应的用户'
    }));
    return;
  }
  
  // 在实际项目中，这里应该发送重置密码邮件
  // 这里我们简单地返回成功信息
  res.statusCode = 200;
  res.end(JSON.stringify({
    message: '重置密码链接已发送到您的邮箱',
    // 模拟生成的重置密码token
    resetToken: `reset-${user.id}-${Date.now()}`
  }));
};

// 模拟重置密码API
export const mockResetPassword = (req, res) => {
  const { resetToken, newPassword } = req.body;
  
  // 简单解析token获取用户ID
  const userId = parseInt(resetToken.split('-')[1]);
  
  // 查找用户
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    res.statusCode = 400;
    res.end(JSON.stringify({
      message: '无效的重置密码链接'
    }));
    return;
  }
  
  // 更新密码
  user.password = newPassword;
  
  res.statusCode = 200;
  res.end(JSON.stringify({
    message: '密码重置成功，请使用新密码登录'
  }));
};

// 导出mock函数
export default {
  register: mockRegister,
  login: mockLogin,
  getUserInfo: mockGetUserInfo,
  logout: mockLogout,
  forgotPassword: mockForgotPassword,
  resetPassword: mockResetPassword
};

// 修改注册函数，支持创建超级管理员账号
export const modifyRegisterForSuperAdmin = () => {
  // 检查是否已经有Jean账号
  const jeanExists = mockUsers.some(user => user.username === 'Jean');
  if (!jeanExists) {
    // 创建新的超级管理员账号
    const newSuperAdmin = {
      id: mockUsers.length + 1,
      username: 'Jean',
      password: '1qazxsw2',
      email: 'Jean.xu@muyacorp.com',
      role: 'admin' // 设置为管理员角色
    };
    
    mockUsers.push(newSuperAdmin);
    console.log('超级管理员账号Jean已创建');
  }
};