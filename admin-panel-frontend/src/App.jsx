import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignIn from './components/auth/SignIn';
// import SignupPage from './components/auth/SignUp';
// import PasswordReset from './components/auth/PasswordReset';
// import Home from './components/home/Home';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CsrfProvider } from './context/CsrfContext';
import { AdminProfileProvider } from './context/AdminProfileContext';
// import CreateEvent from './components/events/CreateEvent';
import { EventsProvider } from './context/EventsContext';
import { Suspense, lazy } from 'react';

const SignIn = lazy(() => import("./components/auth/SignIn"));
const SignUp = lazy(() => import("./components/auth/SignUp"));
const PasswordReset = lazy(() => import("./components/auth/PasswordReset"));
const Home = lazy(() => import("./components/home/Home"));
const CreateEvent = lazy(() => import("./components/events/CreateEvent"));

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="dots-loader" />
  </div>
);

function App() { 
  return (
    <CsrfProvider>
      <AdminProfileProvider>
        <EventsProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route
                  path="/"
                  element={<h1 className="text-red-100">Users Panel</h1>}
                />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
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
            </Suspense>
          </BrowserRouter>
        </EventsProvider>
      </AdminProfileProvider>
    </CsrfProvider>
  );
}

export default App;
