import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UsersPage from './pages/usersPage/UsersPage';
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
        <Route path='/home' element={ <ProtectedRoutes> <UsersPage/> </ProtectedRoutes>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
