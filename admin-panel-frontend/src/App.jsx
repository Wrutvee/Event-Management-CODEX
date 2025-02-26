import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignupPage from './components/auth/SignUp';
import PasswordReset from './components/auth/PasswordReset';
import Home from './components/home/Home';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CsrfProvider } from './context/CsrfContext';
import { AdminProfileProvider } from './context/AdminProfileContext';
import CreateEvent from './components/events/CreateEvent';

function App() { 
  return (
    <CsrfProvider>
      <AdminProfileProvider>
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
            <Route
              path='/events/create'
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AdminProfileProvider>
    </CsrfProvider>
  );
}

export default App;
