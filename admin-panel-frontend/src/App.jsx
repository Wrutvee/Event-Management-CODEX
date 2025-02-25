import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CsrfProvider } from './context/CsrfContext';
import { AdminProfileProvider } from './context/AdminProfileContext';
import { EventsProvider } from './context/EventsContext';
import { Suspense, lazy } from 'react';
import PageLoader from "./components/common/PageLoader";

const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const PasswordReset = lazy(() => import("./pages/auth/PasswordReset"));
const Home = lazy(() => import("./pages/home/Home"));
const CreateEvent = lazy(() => import("./pages/events/CreateEvent"));

const CreateEventWrapper = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <CreateEvent />
    </Suspense>
  );
};


function App() {
  return (
    <CsrfProvider>
      <AdminProfileProvider>
        <EventsProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path="/"
                  element={<></>}
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
                      <CreateEventWrapper />
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
