import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
