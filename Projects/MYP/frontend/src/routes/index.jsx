import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/auth/Login';
import TenantList from '../pages/tenant/TenantList';
import TenantDetail from '../pages/tenant/TenantDetail';
import ProductList from '../pages/product/ProductList';
import OrderList from '../pages/order/OrderList';
import NotFound from '../pages/NotFound';

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
        path: 'tenants',
        element: <TenantList />,
      },
      {
        path: 'tenants/:id',
        element: <TenantDetail />,
      },
      {
        path: 'products',
        element: <ProductList />,
      },
      {
        path: 'orders',
        element: <OrderList />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;