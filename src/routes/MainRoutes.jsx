// import { lazy } from 'react';

// // project import
// import Loadable from 'components/Loadable';
// import Dashboard from 'layout/Dashboard';

// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// // ==============================|| MAIN ROUTING ||============================== //

// const MainRoutes = {
//   path: '/dashboard',
//   element: <Dashboard />,
//   children: [
//     {
//       path: '/dashboard',
//       element: <DashboardDefault />
//     }
//   ]
// };

// export default MainRoutes;

import { Navigate } from 'react-router-dom';
import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

const isAuthenticated = () => !!localStorage.getItem('sessionToken');

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <DashboardDefault />
    }
  ]
};

export default MainRoutes;
