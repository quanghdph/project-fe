import * as React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';
import ProductListPage from 'src/pages/Catalog/Products/list';
import ProductCreatePage from 'src/pages/Catalog/Products/create';
import AdministratorListPage from 'src/pages/Settings/Administrators/list';
import RoleListPage from 'src/pages/Settings/Roles/list';
import RoleCreateUpdatePage from 'src/pages/Settings/Roles/create-update';
import AdministratorCreateUpdatePage from './pages/Settings/Administrators/create-update';
import CustomerListPage from './pages/Customer/list';
import CustomerCreateUpdatePage from './pages/Customer/create-update';
import CategoryListPage from './pages/Catalog/Categories/list';
import CategoryCreateUpdatePage from './pages/Catalog/Categories/create-update';
import PromotionListPage from './pages/Marketing/Promotions/list';
import PromotionCreateUpdatePage from './pages/Marketing/Promotions/create-update';
import AssetsPage from './pages/Catalog/Assets';
import OrderListPage from './pages/Sales/Orders/list';
import OrderDetailPage from './pages/Sales/Orders/detail';
import Payment from './components/Payment';
import ProductDetailUpdatePage from './pages/Catalog/Products/detail-update';
import DashboardPage from './pages/Dashboard';

interface ProtectRouteProps {
  children: React.ReactNode
}

const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const accessToken = localStorage.getItem("accessToken")
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    }
    // navigate('/dashboard')
  }, [accessToken])

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
const App = () => {
  return (
    <BrowserRouter>
      <ProtectRoute>
        <Routes>
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/' element={<HomePage />} >
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='catalog'>
              <Route path='products'>
                <Route index element={<ProductListPage />} />
                <Route path='create' element={<ProductCreatePage />} />
                <Route path='detail-update/:id' element={<ProductDetailUpdatePage />} />
              </Route>
              <Route path='categories'>
                <Route index element={<CategoryListPage />} />
                <Route path='create' element={<CategoryCreateUpdatePage />} />
                <Route path='update/:id' element={<CategoryCreateUpdatePage />} />
              </Route>
              <Route path='assets'>
                <Route index element={<AssetsPage />} />
              </Route>
            </Route>
            <Route path='sales'>
              <Route path='orders'>
                <Route index element={<OrderListPage />} />
                <Route path='detail/:id' element={<OrderDetailPage />} />
              </Route>
            </Route>
            <Route path='customers'>
              <Route index element={<CustomerListPage />} />
              <Route path='create' element={<CustomerCreateUpdatePage />} />
              <Route path='update/:id' element={<CustomerCreateUpdatePage />} />
            </Route>
            <Route path='marketing'>
              <Route path='promotions'>
                <Route index element={<PromotionListPage />} />
                <Route path='create' element={<PromotionCreateUpdatePage />} />
                <Route path='update/:id' element={<PromotionCreateUpdatePage />} />
              </Route>
            </Route>
            <Route path='settings'>
              <Route path='administrators'>
                <Route index element={<AdministratorListPage />} />
                <Route path='create' element={<AdministratorCreateUpdatePage />} />
                <Route path='update/:id' element={<AdministratorCreateUpdatePage />} />
              </Route>
              <Route path='roles'>
                <Route index element={<RoleListPage />} />
                <Route path='create' element={<RoleCreateUpdatePage />} />
                <Route path='update/:id' element={<RoleCreateUpdatePage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ProtectRoute>
    </BrowserRouter>
  );
};

export default App;