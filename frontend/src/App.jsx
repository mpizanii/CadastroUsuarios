import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UsersPage from './pages/usersPage/UsersPage';
import ProductsPage from './pages/productsPage/ProductsPage';
import StockPage from './pages/stockPage/StockPage';
import OrdersPage from './pages/ordersPage/OrdersPage'
import DashboardPage from './pages/dashboardPage/DashboardPage';
import ProtectedRoutes from './services/protectedroutes';
import NavbarSuperior from './components/menu/Navbar';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  )
}

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <NavbarSuperior path={path}/>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
        <Route path='/clientes' element={ <ProtectedRoutes> <UsersPage/> </ProtectedRoutes>}/>
        <Route path='/produtos' element={ <ProtectedRoutes> <ProductsPage/> </ProtectedRoutes>}/>
        <Route path='/estoque' element={ <ProtectedRoutes> <StockPage/> </ProtectedRoutes>}/>
        <Route path='/pedidos' element={ <ProtectedRoutes> <OrdersPage/> </ProtectedRoutes>}/>
        <Route path='/metricas' element={ <ProtectedRoutes> <DashboardPage/> </ProtectedRoutes>}/>
      </Routes>
    </>
  )
}


export default App
