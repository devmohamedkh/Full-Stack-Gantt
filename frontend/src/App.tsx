import {
  CssBaseline,
} from '@mui/material';
import { BrowserRouter, Route, Routes, } from "react-router";
import { Home, Login } from './pages';
import PrivetRoutes from './components/PrivetRoutes';
import { AuthProvider } from './context/AuthContext';
import UnAuthRoutes from './components/UnAuthRoutes';

function App() {

  return (
    <BrowserRouter>
      <CssBaseline />
      <AuthProvider >
        <Routes>
          <Route element={<PrivetRoutes />}>
            <Route index element={<Home />} />
          </Route>
          <Route element={<UnAuthRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
