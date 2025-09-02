import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
  SettingOutlined,
  MenuOutlined,
  UserOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  FormOutlined,
  HistoryOutlined,
  FileDoneOutlined,
  FileAddOutlined,
  PlayCircleOutlined,
  AccountBookOutlined,
  SearchOutlined,
  PayCircleOutlined,
  FileSearchOutlined,
  CreditCardOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMenus } from '../../services/menuService';

const { SubMenu } = Menu;

// 图标映射
const iconMap = {
  SettingOutlined: <SettingOutlined />,
  MenuOutlined: <MenuOutlined />,
  UserOutlined: <UserOutlined />,
  UserSwitchOutlined: <UserSwitchOutlined />,
  TeamOutlined: <TeamOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  CustomerServiceOutlined: <CustomerServiceOutlined />,
  EnvironmentOutlined: <EnvironmentOutlined />,
  GlobalOutlined: <GlobalOutlined />,
  FormOutlined: <FormOutlined />,
  HistoryOutlined: <HistoryOutlined />,
  FileDoneOutlined: <FileDoneOutlined />,
  FileAddOutlined: <FileAddOutlined />,
  PlayCircleOutlined: <PlayCircleOutlined />,
  AccountBookOutlined: <AccountBookOutlined />,
  SearchOutlined: <SearchOutlined />,
  PayCircleOutlined: <PayCircleOutlined />,
  FileSearchOutlined: <FileSearchOutlined />,
  CreditCardOutlined: <CreditCardOutlined />,
  LineChartOutlined: <LineChartOutlined />
};

const SideMenu = () => {
  const [menus, setMenus] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const navigate = useNavigate();

  // 获取菜单数据
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menuData = await getMenus();
        setMenus(menuData);
      } catch (error) {
        console.error('获取菜单失败:', error);
      }
    };

    fetchMenus();
  }, []);

  // 监听路由变化
  useEffect(() => {
    const currentPath = window.location.pathname;
    setCurrentPath(currentPath);

    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // 添加路由变化监听器
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // 处理菜单点击
  const handleMenuClick = ({ key }) => {
    if (key) {
      navigate(key);
    }
  };

  // 递归渲染菜单
  const renderMenuItems = (menuItems) => {
    return menuItems.map((menu) => {
      // 只显示启用状态的菜单
      if (menu.status !== 1) return null;

      // 目录类型且有子菜单
      if (menu.type === 'catalog' && menu.children && menu.children.length > 0) {
        return (
          <SubMenu
            key={menu.id}
            title={
              <span>
                {menu.icon && iconMap[menu.icon] ? iconMap[menu.icon] : <MenuOutlined />}
                <span>{menu.name}</span>
              </span>
            }
          >
            {renderMenuItems(menu.children)}
          </SubMenu>
        );
      }

      // 菜单项
      if (menu.type === 'menu' && menu.path) {
        return (
          <Menu.Item
            key={menu.path}
            icon={menu.icon && iconMap[menu.icon] ? iconMap[menu.icon] : <MenuOutlined />}
          >
            {menu.name}
          </Menu.Item>
        );
      }

      return null;
    });
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[currentPath]}
      onClick={handleMenuClick}
      style={{
        height: '100%',
        borderRight: 0,
        overflowY: 'auto'
      }}
    >
      {renderMenuItems(menus)}
    </Menu>
  );
};

export default SideMenu;