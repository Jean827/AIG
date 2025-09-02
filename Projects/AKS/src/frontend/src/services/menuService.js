// 菜单服务，用于与后端API交互

// 模拟菜单数据，当后端API不可用时使用
const mockMenus = [
  {
    id: '1',
    name: '系统管理',
    icon: 'SettingOutlined',
    type: 'catalog',
    path: '',
    component: '',
    parent_id: null,
    order: 1,
    status: 1,
    children: [
      {
        id: '1-1',
        name: '菜单管理',
        icon: 'MenuOutlined',
        type: 'menu',
        path: '/system/menu',
        component: 'system/MenuManagement',
        parent_id: '1',
        order: 1,
        status: 1
      },
      {
        id: '1-2',
        name: '用户管理',
        icon: 'UserOutlined',
        type: 'menu',
        path: '/system/user',
        component: 'system/UserManagement',
        parent_id: '1',
        order: 2,
        status: 1
      },
      {
        id: '1-3',
        name: '角色管理',
        icon: 'UserSwitchOutlined',
        type: 'menu',
        path: '/system/role',
        component: 'system/RoleManagement',
        parent_id: '1',
        order: 3,
        status: 1
      },
      {
        id: '1-4',
        name: '组织机构管理',
        icon: 'TeamOutlined',
        type: 'menu',
        path: '/system/organization',
        component: 'system/OrganizationManagement',
        parent_id: '1',
        order: 4,
        status: 1
      },
      {
        id: '1-5',
        name: '数据字典管理',
        icon: 'DatabaseOutlined',
        type: 'menu',
        path: '/system/dictionary',
        component: 'system/DictionaryManagement',
        parent_id: '1',
        order: 5,
        status: 1
      }
    ]
  },
  {
    id: '2',
    name: '基础信息管理',
    icon: 'FileTextOutlined',
    type: 'catalog',
    path: '',
    component: '',
    parent_id: null,
    order: 2,
    status: 1,
    children: [
      {
        id: '2-1',
        name: '农户信息管理',
        icon: 'CustomerServiceOutlined',
        type: 'menu',
        path: '/basic/farmer',
        component: 'basic/FarmerManagement',
        parent_id: '2',
        order: 1,
        status: 1
      },
      {
        id: '2-2',
        name: '土地基础信息',
        icon: 'EnvironmentOutlined',
        type: 'menu',
        path: '/basic/land',
        component: 'basic/LandInformation',
        parent_id: '2',
        order: 2,
        status: 1
      },
      {
        id: '2-3',
        name: '乡镇信息管理',
        icon: 'EnvironmentOutlined',
        type: 'menu',
        path: '/basic/township',
        component: 'basic/TownshipManagement',
        parent_id: '2',
        order: 3,
        status: 1
      }
    ]
  },
  {
    id: '3',
    name: '土地竞拍管理',
    icon: 'GlobalOutlined',
    type: 'catalog',
    path: '',
    component: '',
    parent_id: null,
    order: 3,
    status: 1,
    children: [
      {
        id: '3-1',
        name: '竞拍信息管理',
        icon: 'FormOutlined',
        type: 'menu',
        path: '/auction/info',
        component: 'auction/AuctionInformation',
        parent_id: '3',
        order: 1,
        status: 1
      },
      {
        id: '3-2',
        name: '竞拍记录管理',
        icon: 'HistoryOutlined',
        type: 'menu',
        path: '/auction/record',
        component: 'auction/AuctionRecord',
        parent_id: '3',
        order: 2,
        status: 1
      }
    ]
  },
  {
    id: '4',
    name: '合同管理',
    icon: 'FileDoneOutlined',
    type: 'catalog',
    path: '',
    component: '',
    parent_id: null,
    order: 4,
    status: 1,
    children: [
      {
        id: '4-1',
        name: '合同信息管理',
        icon: 'FileAddOutlined',
        type: 'menu',
        path: '/contract/info',
        component: 'contract/ContractInformation',
        parent_id: '4',
        order: 1,
        status: 1
      },
      {
        id: '4-2',
        name: '合同执行管理',
        icon: 'PlayCircleOutlined',
        type: 'menu',
        path: '/contract/execution',
        component: 'contract/ContractExecution',
        parent_id: '4',
        order: 2,
        status: 1
      }
    ]
  },
  {
    id: '5',
    name: '收费管理',
    icon: 'AccountBookOutlined',
    type: 'catalog',
    path: '',
    component: '',
    parent_id: null,
    order: 5,
    status: 1,
    children: [
      {
        id: '5-1',
        name: '收费信息查询',
        icon: 'SearchOutlined',
        type: 'menu',
        path: '/payment/search',
        component: 'payment/PaymentSearch',
        parent_id: '5',
        order: 1,
        status: 1
      },
      {
        id: '5-2',
        name: '缴费操作',
        icon: 'PayCircleOutlined',
        type: 'menu',
        path: '/payment/operation',
        component: 'payment/PaymentOperation',
        parent_id: '5',
        order: 2,
        status: 1
      },
      {
        id: '5-3',
        name: '已缴费信息查询',
        icon: 'FileSearchOutlined',
        type: 'menu',
        path: '/payment/history',
        component: 'payment/PaymentHistory',
        parent_id: '5',
        order: 3,
        status: 1
      }
    ]
  },
  {
    id: '6',
    name: '融资与确权管理',
    icon: 'CreditCardOutlined',
    type: 'catalog',
    path: '',
    component: '',
    parent_id: null,
    order: 6,
    status: 1,
    children: [
      {
        id: '6-1',
        name: '融资信息管理',
        icon: 'DatabaseOutlined',
        type: 'menu',
        path: '/finance/info',
        component: 'finance/FinanceInformation',
        parent_id: '6',
        order: 1,
        status: 1
      },
      {
        id: '6-2',
        name: '资金流向监控',
        icon: 'LineChartOutlined',
        type: 'menu',
        path: '/finance/monitor',
        component: 'finance/FundMonitoring',
        parent_id: '6',
        order: 2,
        status: 1
      }
    ]
  }
];

// 获取菜单列表
export const getMenus = async () => {
  try {
    // 实际项目中，这里应该是一个API调用
    // const response = await fetch('/api/system/menus');
    // const data = await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟数据
    return Promise.resolve(mockMenus);
  } catch (error) {
    console.error('获取菜单列表失败:', error);
    // 发生错误时返回模拟数据
    return Promise.resolve(mockMenus);
  }
};

// 创建菜单
export const createMenu = async (menuData) => {
  try {
    // 实际项目中，这里应该是一个API调用
    // const response = await fetch('/api/system/menus', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(menuData)
    // });
    // const data = await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟数据
    const newMenu = {
      ...menuData,
      id: `new-${Date.now()}`,
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    };
    
    return Promise.resolve(newMenu);
  } catch (error) {
    console.error('创建菜单失败:', error);
    throw error;
  }
};

// 更新菜单
export const updateMenu = async (menuId, menuData) => {
  try {
    // 实际项目中，这里应该是一个API调用
    // const response = await fetch(`/api/system/menus/${menuId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(menuData)
    // });
    // const data = await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟数据
    const updatedMenu = {
      ...menuData,
      id: menuId,
      update_time: new Date().toISOString()
    };
    
    return Promise.resolve(updatedMenu);
  } catch (error) {
    console.error('更新菜单失败:', error);
    throw error;
  }
};

// 删除菜单
export const deleteMenu = async (menuId) => {
  try {
    // 实际项目中，这里应该是一个API调用
    // const response = await fetch(`/api/system/menus/${menuId}`, {
    //   method: 'DELETE'
    // });
    // await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回成功
    return Promise.resolve(true);
  } catch (error) {
    console.error('删除菜单失败:', error);
    throw error;
  }
};

// 根据ID获取菜单
export const getMenuById = async (menuId) => {
  try {
    // 实际项目中，这里应该是一个API调用
    // const response = await fetch(`/api/system/menus/${menuId}`);
    // const data = await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 在模拟数据中查找菜单
    const findMenu = (menus, id) => {
      for (const menu of menus) {
        if (menu.id === id) return menu;
        if (menu.children) {
          const found = findMenu(menu.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const menu = findMenu(mockMenus, menuId);
    if (!menu) {
      throw new Error(`Menu with id ${menuId} not found`);
    }
    
    return Promise.resolve(menu);
  } catch (error) {
    console.error('获取菜单详情失败:', error);
    throw error;
  }
};