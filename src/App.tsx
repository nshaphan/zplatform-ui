import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import LoginWithLink from './pages/LoginWithLink';
import Profile from './pages/Profile';
import SignUp from './pages/Signup';
import OtpLogin from './pages/OtpLogin';
import theme from './theme';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<p>hello</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login-link/:token" element={<LoginWithLink />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/otp-login/:id" element={<OtpLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
