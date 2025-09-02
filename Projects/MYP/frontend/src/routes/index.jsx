import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import TenantList from '../pages/tenant/TenantList';
import TenantDetail from '../pages/tenant/TenantDetail';
import TenantCreate from '../pages/tenant/TenantCreate';
import ProductList from '../pages/product/ProductList';
import ProductDetail from '../pages/product/ProductDetail';
import ProductEdit from '../pages/product/ProductEdit';
import OrderList from '../pages/order/OrderList';
import OrderCreate from '../pages/order/OrderCreate';
import OrderEdit from '../pages/order/OrderEdit';
import EmailConfigPage from '../pages/emailConfig/EmailConfigPage';
import PermissionRecommendationsPage from '../pages/PermissionRecommendationsPage';
import NotFound from '../pages/NotFound';
import AuthGuard from '../components/AuthGuard';
import Dashboard from '../pages/Dashboard';
import ChartTest from '../pages/ChartTest';
import RechartsTestPage from '../pages/RechartsTestPage';
import MenuList from '../pages/menu/MenuList';
import MenuCreate from '../pages/menu/MenuCreate';
import MenuEdit from '../pages/menu/MenuEdit';
import UserManagementPage from '../pages/user/UserManagementPage';
import RoleManagementPage from '../pages/role/RoleManagementPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {        path: '',        element: <AuthGuard />,        children: [          { path: '', element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'chart-test', element: <ChartTest />, requiredPermission: 'chart:view' },
          { path: 'recharts-test', element: <RechartsTestPage />, requiredPermission: 'chart:view' },
          { path: 'tenants', element: <TenantList />, },
          { path: 'tenants/create', element: <TenantCreate />, },
          { path: 'tenants/:id', element: <TenantDetail />, },
          { path: 'menus', element: <MenuList />, },
          { path: 'menus/create', element: <MenuCreate />, },
          { path: 'menus/:id/edit', element: <MenuEdit />, },
          {
            path: 'products',
            element: <ProductList />,
          },
          {
            path: 'products/:id',
            element: <ProductDetail />,
          },
          { path: 'products/edit/:id', element: <ProductEdit />, },
          {
            path: 'orders',
            element: <OrderList />,
          },
          {            path: 'email-config',            element: <EmailConfigPage />,          },          {            path: 'permission-recommendations',            element: <PermissionRecommendationsPage />,          },          {            path: 'users',            element: <UserManagementPage />,          },          {            path: 'roles',            element: <RoleManagementPage />,          },
          {            path: 'orders/create',            element: <OrderCreate />,          },
          {            path: 'orders/edit/:id',            element: <OrderEdit />,          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;