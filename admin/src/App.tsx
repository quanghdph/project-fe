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
import AssetsPage from './pages/Catalog/Assets';
import OrderListPage from './pages/Sales/Orders/list';
import OrderDetailPage from './pages/Sales/Orders/detail';
import Payment from './components/Payment';
import ProductDetailUpdatePage from './pages/Catalog/Products/detail-update';
import DashboardPage from './pages/Dashboard';
import ColorListPage from './pages/Catalog/Color/list';
import ColorCreateUpdatePage from './pages/Catalog/Color/create-update';
import SizeListPage from './pages/Catalog/Size/list';
import SizeCreateUpdatePage from './pages/Catalog/Size/create-update';
import MaterialListPage from './pages/Catalog/Material/list';
import MaterialCreateUpdatePage from './pages/Catalog/Material/create-update';
import WaistbandListPage from './pages/Catalog/Waistband/list';
import WaistbandCreateUpdatePage from './pages/Catalog/Waistband/create-update';
import EmployeeListPage from './pages/Employee/list';
import EmployeeCreateUpdatePage from './pages/Employee/create-update';
import BrandListPage from './pages/Catalog/Brand/list';
import BrandCreateUpdatePage from './pages/Catalog/Brand/create-update';
import BillListPage from './pages/Bills/list';
import BillDetailPage from './pages/Bills/detail';
import BillCreateUpdatePage from './pages/Bills/create-update';
import ProductCreateUpdatePage from './pages/Catalog/Products/create-update';
import AddressListPage from './pages/Customer/address';

interface ProtectRouteProps {
  children: React.ReactNode
}

const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const accessToken = localStorage.getItem("accessToken")
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    } else {
      // navigate('/dashboard')
    }

    // Update loading state to stop displaying the children briefly
    setLoading(false);
  }, [])

  return (
    <React.Fragment>
        {loading ? null : children}
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
                <Route path='create' element={<ProductCreateUpdatePage />} />
                <Route path='detail-update/:id' element={<ProductCreateUpdatePage />} />
              </Route>
              <Route path='brands'>
                <Route index element={<BrandListPage />} />
                <Route path='create' element={<BrandCreateUpdatePage />} />
                <Route path='detail-update/:id' element={<BrandCreateUpdatePage />} />
              </Route>
              <Route path='colors'>
                <Route index element={<ColorListPage />} />
                <Route path='create' element={<ColorCreateUpdatePage />} />
                 <Route path='update/:id' element={<ColorCreateUpdatePage />} />
              </Route>
              <Route path='sizes'>
                <Route index element={<SizeListPage />} />
                <Route path='create' element={<SizeCreateUpdatePage />} />
                 <Route path='update/:id' element={<SizeCreateUpdatePage />} />
              </Route>
              <Route path='material'>
                <Route index element={<MaterialListPage />} />
                <Route path='create' element={<MaterialCreateUpdatePage />} />
                 <Route path='update/:id' element={<MaterialCreateUpdatePage />} />
              </Route>
              <Route path='waistbands'>
                <Route index element={<WaistbandListPage />} />
                <Route path='create' element={<WaistbandCreateUpdatePage />} />
                 <Route path='update/:id' element={<WaistbandCreateUpdatePage />} />
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
                {/* <Route path='detail/:id' element={<OrderDetailPage />} /> */}
              </Route>
              <Route path='bills'>
                <Route index element={<BillListPage />} />
                <Route path='create' element={<BillCreateUpdatePage />} />
                <Route path='update/:id' element={<BillCreateUpdatePage />} />
                <Route path='detail/:id' element={<BillDetailPage />} />
              </Route>
            </Route>
            <Route path='customers'>
              <Route path=''>
                <Route index element={<CustomerListPage />} />
                <Route path='create' element={<CustomerCreateUpdatePage />} />
                <Route path='update/:id' element={<CustomerCreateUpdatePage />} />
              </Route>
              <Route path='address'>
                <Route index element={<AddressListPage />} />
              </Route>
            </Route>
            <Route path='employee'>
              <Route index element={<EmployeeListPage />} />
              <Route path='create' element={<EmployeeCreateUpdatePage />} />
              <Route path='update/:id' element={<EmployeeCreateUpdatePage />} />
            </Route>
            <Route path='bills'>
              <Route index element={<BillListPage />} />
              <Route path='create' element={<BillCreateUpdatePage />} />
              <Route path='update/:id' element={<BillCreateUpdatePage />} />
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