import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Navigate, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import AuthMiddleware from './middleware/Auth';
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import User from './views/Auth/User';
import PersistLogin from './components/PersistLogin';
import Navbar from "./components/Navbar";
import TempDash from './views/Auth/TempDash';
import TempDash2 from './views/Auth/TempDash2';
import Dashboard from './views/Auth/Dashboard';
import DashBoard2 from './views/Auth/Dashboard2';
import EnhancedDashboard from './views/Auth/EnhancedDashboard';
import Update from './views/Auth/Update';
import Footer from './components/Footer';
import './i18n'; // Import the i18n configuration
import Home from './views/Home';


function App() {




  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for authentication tokens in localStorage on mount, except on the Register page
    const isAuthenticated = localStorage.getItem('accessToken') && localStorage.getItem('csrfToken');
    const isRegisterPage = location.pathname === '/auth/register';

    if (!isAuthenticated && !isRegisterPage) {
      navigate('/auth/login'); // Redirect to login if not authenticated and not on the register page
    }
  }, [navigate, location.pathname]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<PersistLogin />}>
          <Route path="/" element={<Home/>}></Route>
          <Route path='auth'>
            <Route path='login' element={<Login />}></Route>
            <Route path='register' element={<Register />}></Route>
            <Route path='user' element={<AuthMiddleware />}>
              <Route index element={<User />}></Route>
            </Route>
            <Route path='tempdash' element={<AuthMiddleware />}>
              <Route index element={<TempDash />}></Route>
            </Route>
            <Route path='tempdash2' element={<AuthMiddleware />}>
              <Route index element={<TempDash2 />}></Route>
            </Route>
            <Route path='dashboard' element={<AuthMiddleware />}>
              <Route index element={<DashBoard2 />}></Route>
            </Route>
            <Route path='enhanceddashboard' element={<AuthMiddleware />}>
              <Route index element={<EnhancedDashboard />}></Route>
            </Route>
            <Route path='update' element={<AuthMiddleware />}>
              <Route index element={<Update />}></Route>
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<Navigate to={localStorage.getItem('accessToken') && localStorage.getItem('csrfToken') ? `/auth/login` : `auth/enhanceddashboard`} />}></Route> {/* Redirect to login if no match */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
