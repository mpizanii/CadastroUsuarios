import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UsersPage from './pages/usersPage/UsersPage';
import ProductsPage from './pages/productsPage/ProductsPage';
import StockPage from './pages/stockPage/StockPage';
import OrderPage from './pages/orderPage/OrderPage';
import RecipesPage from './pages/recipesPage/RecipesPage';
import ProtectedRoutes from './services/protectedroutes';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
        <Route path='/clientes' element={ <ProtectedRoutes> <UsersPage/> </ProtectedRoutes>}/>
        <Route path='/produtos' element={ <ProtectedRoutes> <ProductsPage/> </ProtectedRoutes>}/>
        <Route path='/estoque' element={ <ProtectedRoutes> <StockPage/> </ProtectedRoutes>}/>
        <Route path='/pedidos' element={ <ProtectedRoutes> <OrderPage/> </ProtectedRoutes>}/>
        <Route path='/receitas' element={ <ProtectedRoutes> <RecipesPage/> </ProtectedRoutes>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
