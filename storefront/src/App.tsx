import * as React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/productDetailPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import MainPage from "./pages/HomePage/MainPage";
import AboutPage from "./pages/AboutPage/about";

interface ProtectRouteProps {
    children: React.ReactNode
}

const ProtectRoute = ({ children }: ProtectRouteProps) => {
    const accessToken = localStorage.getItem("accessToken")
    const navigate = useNavigate()

    React.useEffect(() => {
        if (!accessToken) {
            navigate('/')
        }
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
            <Routes>
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/' element={<HomePage />} >
                    <Route index element={<MainPage />} />
                    <Route path='about' element={<AboutPage />} />
                    <Route path='account' element={<ProtectRoute><MyAccountPage /></ProtectRoute>} />
                    <Route path='checkout/:id' element={<ProtectRoute><CheckoutPage /></ProtectRoute>} />
                    <Route path='products'>
                        <Route index element={<ProductPage />} />
                        <Route path=':id' element={<ProductDetailPage />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
