import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import MainNavigation from 'shared/components/Navigation/MainNavigation';
import { AuthContext } from 'shared/context/auth-context';
import useAuth from 'shared/hooks/auth-hook';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';
import About from 'shared/components/About/About';

const Users = React.lazy(() => import('users/pages/Users'));
const NewPlace = React.lazy(() => import('places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('users/pages/Auth'));

function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
