import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UsersPage from './pages/usersPage/UsersPage';
import ProductsPage from './pages/productsPage/ProductsPage';
import StockPage from './pages/stockPage/StockPage';
import OrdersPage from './pages/ordersPage/OrdersPage'
import DashboardPage from './pages/dashboardPage/DashboardPage';
import RecipesPage from './pages/recipesPage/RecipesPage';
import SupportPage from './pages/supportPage/SupportPage';
import ProtectedRoutes from './services/protectedroutes';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/menu/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  )
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [activeItem, setActiveItem] = useState('');

  const rotasSemNavbar = ["/", "/resetpassword"];

  const routeToIdMap = {
    '/metricas': 'visao-geral',
    '/pedidos': 'pedidos',
    '/produtos': 'produtos',
    '/receitas': 'receitas',
    '/estoque': 'estoque',
    '/clientes': 'clientes',
    '/suporte': 'suporte'
  };

  useEffect(() => {
    setActiveItem(routeToIdMap[path] || '');
  }, [path]);

  const handleSidebarItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  return (
    <>
      {!rotasSemNavbar.includes(path) && (
        <>
          <SideBar 
            activeItem={activeItem} 
            onItemClick={handleSidebarItemClick}
          />
          <div style={{ marginLeft: '280px' }}>
            <Routes>
              <Route path='/clientes' element={<ProtectedRoutes><UsersPage/></ProtectedRoutes>}/>
              <Route path='/produtos' element={<ProtectedRoutes><ProductsPage/></ProtectedRoutes>}/>
              <Route path='/estoque' element={<ProtectedRoutes><StockPage/></ProtectedRoutes>}/>
              <Route path='/pedidos' element={<ProtectedRoutes><OrdersPage/></ProtectedRoutes>}/>
              <Route path='/metricas' element={<ProtectedRoutes><DashboardPage/></ProtectedRoutes>}/>
              <Route path='/receitas' element={<ProtectedRoutes><RecipesPage/></ProtectedRoutes>}/>
              <Route path='/suporte' element={<ProtectedRoutes><SupportPage/></ProtectedRoutes>}/>
            </Routes>
          </div>
        </>
      )}
      {rotasSemNavbar.includes(path) && (
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
        </Routes>
      )}
    </>
  );
}


export default App
