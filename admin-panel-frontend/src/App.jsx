import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CsrfProvider } from './context/CsrfContext';
import { AdminProfileProvider } from './context/AdminProfileContext';
import { EventsProvider } from './context/EventsContext';
import { Suspense, lazy } from 'react';
import PageLoader from "./components/common/PageLoader";

const SignInComponent = lazy(() => import("./pages/auth/SignIn"));
const SignUpComponent = lazy(() => import("./pages/auth/SignUp"));
const PasswordResetComponent = lazy(() => import("./pages/auth/PasswordReset"));
const Home = lazy(() => import("./pages/home/Home"));
const CreateEvent = lazy(() => import("./pages/events/CreateEvent"));
const InviteAdminsComponent = lazy(() => import("./pages/inviteAdmins/InviteAdmins"));
const EditEvent = lazy(() => import("./pages/events/EditEvent"));
const Profile = lazy(() => import("./pages/profile/Profile"));

const CreateEventWrapper = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <CreateEvent />
    </Suspense>
  );
};

const SignIn = () => {
  return(
    <Suspense fallback={<PageLoader />}>
      <SignInComponent />
    </Suspense>
  )
};

const PasswordReset = () => {
  return(
    <Suspense fallback={ <PageLoader /> }>
      <PasswordResetComponent />
    </Suspense>
  )
};

const SignUp = () => {
  return(
    <Suspense fallback= { <PageLoader /> }>
      <SignUpComponent />
    </Suspense>
  )
}

const InviteAdmins = () => {
  return(
    <Suspense fallback = { <PageLoader /> }>
      <InviteAdminsComponent />
    </Suspense>
  )
}

function App() {
  return (
    <CsrfProvider>
      <AdminProfileProvider>
        <EventsProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<></>} />
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
                  path="/events/create"
                  element={
                    <ProtectedRoute>
                      <CreateEventWrapper />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invite"
                  element={
                    <ProtectedRoute>
                      <InviteAdmins />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/edit/:eventId"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}>
                        <EditEvent />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}>
                        <Profile />
                      </Suspense>
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
