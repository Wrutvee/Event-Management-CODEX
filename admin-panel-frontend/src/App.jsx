import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignupPage from './components/auth/SignUp';
import PasswordReset from './components/auth/PasswordReset';
import Home from './components/home/Home';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CsrfProvider } from './context/CsrfContext';

function App() { 
  return (
    <CsrfProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<h1 className="text-red-100">Users Panel</h1>}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CsrfProvider>
  );
}

export default App
