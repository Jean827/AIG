// 系统管理服务，用于与后端API交互

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    password: 'hashed_password',
    organization_id: '1',
    organization_name: '阿克苏市农业局',
    role_id: '1',
    role_name: '超级管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    status: 1,
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '2',
    username: 'finance',
    name: '财务人员',
    password: 'hashed_password',
    organization_id: '1',
    organization_name: '阿克苏市农业局',
    role_id: '2',
    role_name: '财务科长',
    phone: '13900139000',
    email: 'finance@example.com',
    status: 1,
    create_time: '2023-01-02T10:30:00Z',
    update_time: '2023-01-02T10:30:00Z'
  },
  {
    id: '3',
    username: 'clerk',
    name: '收费员',
    password: 'hashed_password',
    organization_id: '2',
    organization_name: '库车市农业局',
    role_id: '3',
    role_name: '收费员',
    phone: '13700137000',
    email: 'clerk@example.com',
    status: 1,
    create_time: '2023-01-03T14:15:00Z',
    update_time: '2023-01-03T14:15:00Z'
  }
];

// 模拟角色数据
const mockRoles = [
  {
    id: '1',
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    permissions: ['*'],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '2',
    name: '财务科长',
    code: 'FINANCE_MANAGER',
    permissions: ['system:user:view', 'payment:search', 'payment:history', 'finance:info'],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '3',
    name: '收费员',
    code: 'COLLECTOR',
    permissions: ['payment:search', 'payment:operation', 'payment:history'],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '4',
    name: '审核员',
    code: 'AUDITOR',
    permissions: ['basic:farm:view', 'basic:land:view', 'contract:info:view', 'payment:search'],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  }
];

// 模拟组织机构数据
const mockOrganizations = [
  {
    id: '1',
    name: '阿克苏市农业局',
    description: '负责阿克苏市农业管理工作',
    code: 'AKS_NYJ',
    type: '市级机构',
    phone: '0997-1234567',
    email: 'aks_nyj@example.com',
    work_days: '周一至周五',
    accounting_year: '2023',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    status: 1,
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '2',
    name: '库车市农业局',
    description: '负责库车市农业管理工作',
    code: 'KQ_NYJ',
    type: '市级机构',
    phone: '0997-7654321',
    email: 'kq_nyj@example.com',
    work_days: '周一至周五',
    accounting_year: '2023',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    status: 1,
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '3',
    name: '沙雅县农业局',
    description: '负责沙雅县农业管理工作',
    code: 'SY_XNYJ',
    type: '县级机构',
    phone: '0997-1112222',
    email: 'sy_xnyj@example.com',
    work_days: '周一至周五',
    accounting_year: '2023',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    status: 1,
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  }
];

// 模拟数据字典数据
const mockDataDictionary = [
  {
    id: '1',
    category: 'user_status',
    name: '用户状态',
    code: 'USER_STATUS',
    items: [
      { key: '0', value: '禁用' },
      { key: '1', value: '启用' }
    ],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '2',
    category: 'farmer_type',
    name: '农户类型',
    code: 'FARMER_TYPE',
    items: [
      { key: '普通农户', value: '普通农户' },
      { key: '种植大户', value: '种植大户' },
      { key: '合作社', value: '合作社' }
    ],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  },
  {
    id: '3',
    category: 'land_level',
    name: '土地等级',
    code: 'LAND_LEVEL',
    items: [
      { key: '一类地', value: '一类地' },
      { key: '二类地', value: '二类地' },
      { key: '三类地', value: '三类地' }
    ],
    create_time: '2023-01-01T08:00:00Z',
    update_time: '2023-01-01T08:00:00Z'
  }
];

// 用户管理相关API

export const getUsers = async (filters = {}) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockUsers];
    
    // 应用过滤条件
    if (filters.username) {
      result = result.filter(user => user.username.includes(filters.username));
    }
    if (filters.name) {
      result = result.filter(user => user.name.includes(filters.name));
    }
    if (filters.organization_id) {
      result = result.filter(user => user.organization_id === filters.organization_id);
    }
    if (filters.status !== undefined) {
      result = result.filter(user => user.status === filters.status);
    }
    
    return Promise.resolve(result);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return Promise.resolve(mockUsers);
  }
};

export const createUser = async (userData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查用户名是否已存在
    const existingUser = mockUsers.find(user => user.username === userData.username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }
    
    const newUser = {
      ...userData,
      id: `new-${Date.now()}`,
      password: 'hashed_password', // 在实际项目中应该加密密码
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockUsers.findIndex(user => user.id === userId);
    if (index === -1) {
      throw new Error(`用户不存在: ${userId}`);
    }
    
    // 检查用户名是否已被其他用户使用
    const existingUser = mockUsers.find(user => 
      user.username === userData.username && user.id !== userId
    );
    if (existingUser) {
      throw new Error('用户名已存在');
    }
    
    const updatedUser = {
      ...mockUsers[index],
      ...userData,
      update_time: new Date().toISOString()
    };
    
    mockUsers[index] = updatedUser;
    return Promise.resolve(updatedUser);
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockUsers.findIndex(user => user.id === userId);
    if (index === -1) {
      throw new Error(`用户不存在: ${userId}`);
    }
    
    // 不能删除最后一个管理员
    if (mockUsers[index].role_id === '1') {
      const adminCount = mockUsers.filter(user => user.role_id === '1').length;
      if (adminCount <= 1) {
        throw new Error('不能删除最后一个管理员用户');
      }
    }
    
    mockUsers.splice(index, 1);
    return Promise.resolve(true);
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
};

export const resetPassword = async (userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockUsers.findIndex(user => user.id === userId);
    if (index === -1) {
      throw new Error(`用户不存在: ${userId}`);
    }
    
    // 在实际项目中，这里应该生成一个临时密码并发送给用户
    mockUsers[index] = {
      ...mockUsers[index],
      password: 'hashed_temp_password', // 临时密码的哈希值
      update_time: new Date().toISOString()
    };
    
    return Promise.resolve({ success: true, message: '密码已重置' });
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
};

// 角色管理相关API

export const getRoles = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve(mockRoles);
  } catch (error) {
    console.error('获取角色列表失败:', error);
    return Promise.resolve(mockRoles);
  }
};

export const createRole = async (roleData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查角色名称是否已存在
    const existingRole = mockRoles.find(role => role.name === roleData.name || role.code === roleData.code);
    if (existingRole) {
      throw new Error('角色名称或编码已存在');
    }
    
    const newRole = {
      ...roleData,
      id: `new-${Date.now()}`,
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    };
    
    mockRoles.push(newRole);
    return Promise.resolve(newRole);
  } catch (error) {
    console.error('创建角色失败:', error);
    throw error;
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockRoles.findIndex(role => role.id === roleId);
    if (index === -1) {
      throw new Error(`角色不存在: ${roleId}`);
    }
    
    // 检查角色名称或编码是否已被其他角色使用
    const existingRole = mockRoles.find(role => 
      (role.name === roleData.name || role.code === roleData.code) && role.id !== roleId
    );
    if (existingRole) {
      throw new Error('角色名称或编码已存在');
    }
    
    const updatedRole = {
      ...mockRoles[index],
      ...roleData,
      update_time: new Date().toISOString()
    };
    
    mockRoles[index] = updatedRole;
    return Promise.resolve(updatedRole);
  } catch (error) {
    console.error('更新角色失败:', error);
    throw error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockRoles.findIndex(role => role.id === roleId);
    if (index === -1) {
      throw new Error(`角色不存在: ${roleId}`);
    }
    
    // 不能删除超级管理员角色
    if (mockRoles[index].code === 'SUPER_ADMIN') {
      throw new Error('不能删除超级管理员角色');
    }
    
    // 检查是否有用户正在使用该角色
    const userUsingRole = mockUsers.find(user => user.role_id === roleId);
    if (userUsingRole) {
      throw new Error('该角色正在被用户使用，无法删除');
    }
    
    mockRoles.splice(index, 1);
    return Promise.resolve(true);
  } catch (error) {
    console.error('删除角色失败:', error);
    throw error;
  }
};

export const updateRoleStatus = async (roleId, status) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockRoles.findIndex(role => role.id === roleId);
    if (index === -1) {
      throw new Error(`角色不存在: ${roleId}`);
    }
    
    // 不能禁用超级管理员角色
    if (mockRoles[index].code === 'SUPER_ADMIN') {
      throw new Error('不能禁用超级管理员角色');
    }
    
    mockRoles[index] = {
      ...mockRoles[index],
      status: status ? 1 : 0,
      update_time: new Date().toISOString()
    };
    
    return Promise.resolve(mockRoles[index]);
  } catch (error) {
    console.error('更新角色状态失败:', error);
    throw error;
  }
};

export const getPermissions = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟的权限树数据
    return Promise.resolve([
      {
        id: '1',
        title: '系统管理',
        children: [
          { id: 'system:user:view', title: '查看用户' },
          { id: 'system:user:create', title: '创建用户' },
          { id: 'system:user:update', title: '更新用户' },
          { id: 'system:user:delete', title: '删除用户' },
          { id: 'system:role:view', title: '查看角色' },
          { id: 'system:role:create', title: '创建角色' },
          { id: 'system:role:update', title: '更新角色' },
          { id: 'system:role:delete', title: '删除角色' },
          { id: 'system:org:view', title: '查看组织' },
          { id: 'system:org:create', title: '创建组织' },
          { id: 'system:org:update', title: '更新组织' },
          { id: 'system:org:delete', title: '删除组织' }
        ]
      },
      {
        id: '2',
        title: '基础信息',
        children: [
          { id: 'basic:farm:view', title: '查看农场' },
          { id: 'basic:farm:create', title: '创建农场' },
          { id: 'basic:farm:update', title: '更新农场' },
          { id: 'basic:farm:delete', title: '删除农场' },
          { id: 'basic:land:view', title: '查看土地' },
          { id: 'basic:land:create', title: '创建土地' },
          { id: 'basic:land:update', title: '更新土地' },
          { id: 'basic:land:delete', title: '删除土地' }
        ]
      },
      {
        id: '3',
        title: '合同管理',
        children: [
          { id: 'contract:info:view', title: '查看合同' },
          { id: 'contract:info:create', title: '创建合同' },
          { id: 'contract:info:update', title: '更新合同' },
          { id: 'contract:info:delete', title: '删除合同' }
        ]
      },
      {
        id: '4',
        title: '缴费管理',
        children: [
          { id: 'payment:search', title: '查询缴费' },
          { id: 'payment:operation', title: '缴费操作' },
          { id: 'payment:history', title: '缴费历史' },
          { id: 'finance:info', title: '财务信息' }
        ]
      }
    ]);
  } catch (error) {
    console.error('获取权限树失败:', error);
    throw error;
  }
};

// 组织机构管理相关API

export const getOrganizations = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockOrganizations];
    
    // 应用过滤条件
    if (filters.name) {
      result = result.filter(org => org.name.includes(filters.name));
    }
    if (filters.code) {
      result = result.filter(org => org.code.includes(filters.code));
    }
    if (filters.type) {
      result = result.filter(org => org.type === filters.type);
    }
    if (filters.status !== undefined) {
      result = result.filter(org => org.status === filters.status);
    }
    
    return Promise.resolve(result);
  } catch (error) {
    console.error('获取组织机构列表失败:', error);
    return Promise.resolve(mockOrganizations);
  }
};

export const createOrganization = async (orgData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查组织机构名称或编码是否已存在
    const existingOrg = mockOrganizations.find(org => 
      org.name === orgData.name || org.code === orgData.code
    );
    if (existingOrg) {
      throw new Error('组织机构名称或编码已存在');
    }
    
    const newOrg = {
      ...orgData,
      id: `new-${Date.now()}`,
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    };
    
    mockOrganizations.push(newOrg);
    return Promise.resolve(newOrg);
  } catch (error) {
    console.error('创建组织机构失败:', error);
    throw error;
  }
};

export const updateOrganization = async (orgId, orgData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockOrganizations.findIndex(org => org.id === orgId);
    if (index === -1) {
      throw new Error(`组织机构不存在: ${orgId}`);
    }
    
    // 检查组织机构名称或编码是否已被其他组织机构使用
    const existingOrg = mockOrganizations.find(org => 
      (org.name === orgData.name || org.code === orgData.code) && org.id !== orgId
    );
    if (existingOrg) {
      throw new Error('组织机构名称或编码已存在');
    }
    
    const updatedOrg = {
      ...mockOrganizations[index],
      ...orgData,
      update_time: new Date().toISOString()
    };
    
    mockOrganizations[index] = updatedOrg;
    return Promise.resolve(updatedOrg);
  } catch (error) {
    console.error('更新组织机构失败:', error);
    throw error;
  }
};

export const deleteOrganization = async (orgId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockOrganizations.findIndex(org => org.id === orgId);
    if (index === -1) {
      throw new Error(`组织机构不存在: ${orgId}`);
    }
    
    // 检查是否有用户正在使用该组织机构
    const userInOrg = mockUsers.find(user => user.organization_id === orgId);
    if (userInOrg) {
      throw new Error('该组织机构下有用户，无法删除');
    }
    
    // 检查是否有子组织机构
    const subOrg = mockOrganizations.find(org => org.parent_id === orgId);
    if (subOrg) {
      throw new Error('该组织机构下有子机构，无法删除');
    }
    
    mockOrganizations.splice(index, 1);
    return Promise.resolve(true);
  } catch (error) {
    console.error('删除组织机构失败:', error);
    throw error;
  }
};

// 数据字典管理相关API

export const getDataDictionary = async (category = null) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (category) {
      return Promise.resolve(mockDataDictionary.filter(dict => dict.category === category));
    }
    return Promise.resolve(mockDataDictionary);
  } catch (error) {
    console.error('获取数据字典失败:', error);
    return Promise.resolve(mockDataDictionary);
  }
};

export const createDataDictionary = async (dictData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查数据字典类别是否已存在
    const existingDict = mockDataDictionary.find(dict => 
      dict.category === dictData.category || dict.code === dictData.code
    );
    if (existingDict) {
      throw new Error('数据字典类别或编码已存在');
    }
    
    const newDict = {
      ...dictData,
      id: `new-${Date.now()}`,
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    };
    
    mockDataDictionary.push(newDict);
    return Promise.resolve(newDict);
  } catch (error) {
    console.error('创建数据字典失败:', error);
    throw error;
  }
};

export const updateDataDictionary = async (dictId, dictData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDataDictionary.findIndex(dict => dict.id === dictId);
    if (index === -1) {
      throw new Error(`数据字典不存在: ${dictId}`);
    }
    
    // 检查数据字典类别或编码是否已被其他字典使用
    const existingDict = mockDataDictionary.find(dict => 
      (dict.category === dictData.category || dict.code === dictData.code) && dict.id !== dictId
    );
    if (existingDict) {
      throw new Error('数据字典类别或编码已存在');
    }
    
    const updatedDict = {
      ...mockDataDictionary[index],
      ...dictData,
      update_time: new Date().toISOString()
    };
    
    mockDataDictionary[index] = updatedDict;
    return Promise.resolve(updatedDict);
  } catch (error) {
    console.error('更新数据字典失败:', error);
    throw error;
  }
};

export const deleteDataDictionary = async (dictId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDataDictionary.findIndex(dict => dict.id === dictId);
    if (index === -1) {
      throw new Error(`数据字典不存在: ${dictId}`);
    }
    
    mockDataDictionary.splice(index, 1);
    return Promise.resolve(true);
  } catch (error) {
    console.error('删除数据字典失败:', error);
    throw error;
  }
};

// 字典项相关API

// 模拟字典项数据
const mockDictItems = [
  { id: '1', type_id: '1', label: '启用', value: '1', color: '#52c41a', sort_order: 1, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '2', type_id: '1', label: '禁用', value: '0', color: '#d9d9d9', sort_order: 2, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '3', type_id: '2', label: '普通农户', value: '普通农户', color: '#1890ff', sort_order: 1, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '4', type_id: '2', label: '种植大户', value: '种植大户', color: '#722ed1', sort_order: 2, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '5', type_id: '2', label: '合作社', value: '合作社', color: '#fa8c16', sort_order: 3, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '6', type_id: '3', label: '一类地', value: '一类地', color: '#13c2c2', sort_order: 1, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '7', type_id: '3', label: '二类地', value: '二类地', color: '#faad14', sort_order: 2, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
  { id: '8', type_id: '3', label: '三类地', value: '三类地', color: '#fadb14', sort_order: 3, status: 1, create_time: '2023-01-01T08:00:00Z', update_time: '2023-01-01T08:00:00Z' },
];

export const getDataDictionaryItems = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockDictItems];
    
    // 应用过滤条件
    if (filters.type_id) {
      result = result.filter(item => item.type_id === filters.type_id);
    }
    if (filters.value) {
      result = result.filter(item => item.value.includes(filters.value));
    }
    if (filters.status !== undefined) {
      result = result.filter(item => item.status === filters.status);
    }
    
    // 按排序号排序
    result.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    return Promise.resolve({ data: result });
  } catch (error) {
    console.error('获取字典项失败:', error);
    return Promise.resolve({ data: mockDictItems });
  }
};

export const createDataDictionaryItem = async (itemData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查同类型下值是否已存在
    const existingItem = mockDictItems.find(item => 
      item.type_id === itemData.type_id && item.value === itemData.value
    );
    if (existingItem) {
      throw new Error('该字典类型下已存在相同的值');
    }
    
    const newItem = {
      ...itemData,
      id: `new-${Date.now()}`,
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    };
    
    mockDictItems.push(newItem);
    return Promise.resolve(newItem);
  } catch (error) {
    console.error('创建字典项失败:', error);
    throw error;
  }
};

export const updateDataDictionaryItem = async (itemId, itemData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDictItems.findIndex(item => item.id === itemId);
    if (index === -1) {
      throw new Error(`字典项不存在: ${itemId}`);
    }
    
    // 检查同类型下值是否已被其他项使用
    const existingItem = mockDictItems.find(item => 
      item.type_id === itemData.type_id && item.value === itemData.value && item.id !== itemId
    );
    if (existingItem) {
      throw new Error('该字典类型下已存在相同的值');
    }
    
    const updatedItem = {
      ...mockDictItems[index],
      ...itemData,
      update_time: new Date().toISOString()
    };
    
    mockDictItems[index] = updatedItem;
    return Promise.resolve(updatedItem);
  } catch (error) {
    console.error('更新字典项失败:', error);
    throw error;
  }
};

export const deleteDataDictionaryItem = async (itemId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDictItems.findIndex(item => item.id === itemId);
    if (index === -1) {
      throw new Error(`字典项不存在: ${itemId}`);
    }
    
    mockDictItems.splice(index, 1);
    return Promise.resolve(true);
  } catch (error) {
    console.error('删除字典项失败:', error);
    throw error;
  }
};