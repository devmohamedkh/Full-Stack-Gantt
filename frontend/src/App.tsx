import {
  CssBaseline,
} from '@mui/material';
import { BrowserRouter, Route, Routes, } from "react-router";
import { HomePage, LoginPage, NotFoundPage, UsersPage } from './pages';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { GuestOnlyRoutes, Header, PrivetRoutes } from './components/index';
import { UserRole } from './types';

function App() {

  return (
    <BrowserRouter>
      <CssBaseline />
      <AuthProvider >
        <Header />

        <Routes>

          <Route element={<PrivetRoutes />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path='users' element={<PrivetRoutes allowRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} />}>
            <Route index element={<UsersPage />} />
          </Route>

          <Route element={<GuestOnlyRoutes />}>
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
