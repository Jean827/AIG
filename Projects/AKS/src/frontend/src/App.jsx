import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutComponent from './components/Layout';

// 系统管理页面
import RoleManagement from './pages/system/RoleManagement';
import OrganizationManagement from './pages/system/OrganizationManagement';
import DataDictionaryManagement from './pages/system/DataDictionaryManagement';
import UserManagement from './pages/system/UserManagement';
import MenuManagement from './pages/system/MenuManagement';

// 基础信息管理页面
import FarmManagement from './pages/basic/FarmManagement';
import LandManagement from './pages/basic/LandManagement';
import InfrastructureManagement from './pages/basic/InfrastructureManagement';
import TownshipManagement from './pages/basic/TownshipManagement';

// 土地竞拍管理页面
import BiddingInfoManagement from './pages/bidding/BiddingInfoManagement';
import BiddingRecordManagement from './pages/bidding/BiddingRecordManagement';

// 合同管理页面
import ContractList from './pages/contract/ContractList';
import ContractDetail from './pages/contract/ContractDetail';
import ContractExecution from './pages/contract/ContractExecution';

// 收费管理页面
import PaymentList from './pages/payment/PaymentList';
import PaymentDetail from './pages/payment/PaymentDetail';
import PaymentOperation from './pages/payment/PaymentOperation';
import PaymentHistory from './pages/payment/PaymentHistory';

// 融资与确权管理页面
import FinancialOverview from './pages/finance/FinancialOverview';
import FundMonitoring from './pages/finance/FundMonitoring';

// 用户个人页面
import UserProfile from './pages/user/UserProfile';

// 404页面
const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <h1>404</h1>
      <p>页面不存在</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页路由可以在这里添加 */}
        <Route path="/login" element={<Navigate to="/system/user" replace />} />
        
        {/* 主布局路由 */}
        <Route path="/" element={<LayoutComponent />}>
          {/* 系统管理路由 */}
          <Route path="system/role" element={<RoleManagement />} />
          <Route path="system/organization" element={<OrganizationManagement />} />
          <Route path="system/dictionary" element={<DataDictionaryManagement />} />
          <Route path="system/user" element={<UserManagement />} />
          <Route path="system/menu" element={<MenuManagement />} />
          
          {/* 基础信息管理路由 */}
          <Route path="basic/farm" element={<FarmManagement />} />
          <Route path="basic/farmer" element={<Navigate to="/basic/farm" replace />} />
          <Route path="basic/land" element={<LandManagement />} />
          <Route path="basic/infrastructure" element={<InfrastructureManagement />} />
          <Route path="basic/township" element={<TownshipManagement />} />
          
          {/* 土地竞拍管理路由 */}
          <Route path="bidding/info" element={<BiddingInfoManagement />} />
          <Route path="bidding/record" element={<BiddingRecordManagement />} />
          
          {/* 旧路由重定向，确保兼容性 */}
          <Route path="auction/info" element={<Navigate to="/bidding/info" replace />} />
          <Route path="auction/detail/:id" element={<Navigate to="/bidding/info" replace />} />
          <Route path="auction/record" element={<Navigate to="/bidding/record" replace />} />
          
          {/* 合同管理路由 */}
          <Route path="contract/info" element={<ContractList />} />
          <Route path="contract/detail/:id" element={<ContractDetail />} />
          <Route path="contract/execution" element={<ContractExecution />} />
          
          {/* 收费管理路由 */}
          <Route path="payment/search" element={<PaymentList />} />
          <Route path="payment/detail/:id" element={<PaymentDetail />} />
          <Route path="payment/operation" element={<PaymentOperation />} />
          <Route path="payment/history" element={<PaymentHistory />} />
          
          {/* 融资与确权管理路由 */}
          <Route path="finance/info" element={<FinancialOverview />} />
          <Route path="finance/monitor" element={<FundMonitoring />} />
          
          {/* 用户个人页面路由 */}
          <Route path="user/settings" element={<UserProfile />} />
          
          {/* 默认路由重定向到用户管理页面 */}
          <Route index element={<Navigate to="/system/user" replace />} />
          
          {/* 404页面 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
