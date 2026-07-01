import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProductsProvider, OrdersProvider, StockProvider, CustomersProvider } from './contexts';
import ProtectedRoutes from './utils/protectedroutes';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/menu/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageLoader from './components/PageLoader';

const LoginPage        = lazy(() => import('./pages/auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const LandingPage      = lazy(() => import('./pages/landingPage/LandingPage'));
const CustomersPage    = lazy(() => import('./pages/customersPage/CustomersPage'));
const ProductsPage     = lazy(() => import('./pages/productsPage/ProductsPage'));
const StockPage        = lazy(() => import('./pages/stockPage/StockPage'));
const OrdersPage       = lazy(() => import('./pages/ordersPage/OrdersPage'));
const DashboardPage    = lazy(() => import('./pages/dashboardPage/DashboardPage'));
const RecipeDetailPage = lazy(() => import('./pages/recipesPage/RecipeDetailPage'));
const SupportPage      = lazy(() => import('./pages/supportPage/SupportPage'));

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <OrdersProvider>
          <ProductsProvider>
            <StockProvider>
              <CustomersProvider>
                <Suspense fallback={<PageLoader />}>
                  <Layout/>
                </Suspense>
              </CustomersProvider>
            </StockProvider>
          </ProductsProvider>
        </OrdersProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

const routeToIdMap = {
  '/metricas': 'visao-geral',
  '/pedidos': 'pedidos',
  '/produtos': 'produtos',
  '/receitas': 'receitas',
  '/estoque': 'estoque',
  '/clientes': 'clientes',
  '/suporte': 'suporte'
};

const rotasSemNavbar = ["/", "/login", "/resetpassword"];

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [activeItem, setActiveItem] = useState('');

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
              <Route path='/clientes'    element={<ProtectedRoutes><CustomersPage/></ProtectedRoutes>}/>
              <Route path='/produtos'    element={<ProtectedRoutes><ProductsPage/></ProtectedRoutes>}/>
              <Route path='/estoque'     element={<ProtectedRoutes><StockPage/></ProtectedRoutes>}/>
              <Route path='/pedidos'     element={<ProtectedRoutes><OrdersPage/></ProtectedRoutes>}/>
              <Route path='/metricas'    element={<ProtectedRoutes><DashboardPage/></ProtectedRoutes>}/>
              <Route path='/receitas/:id' element={<ProtectedRoutes><RecipeDetailPage/></ProtectedRoutes>}/>
              <Route path='/suporte'     element={<ProtectedRoutes><SupportPage/></ProtectedRoutes>}/>
            </Routes>
          </div>
        </>
      )}
      {rotasSemNavbar.includes(path) && (
        <Routes>
          <Route path='/'             element={<LandingPage/>}/>
          <Route path='/login'        element={<LoginPage/>}/>
          <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
        </Routes>
      )}
    </>
  );
}

export default App
