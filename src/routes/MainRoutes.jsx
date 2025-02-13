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

// Authentication check function
const isAuthenticated = () => !!localStorage.getItem('sessionToken');

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />,
  children: [
    {
      path: '/dashboard',
      element: isAuthenticated() ? <DashboardDefault /> : <Navigate to="/login" replace />
    }
  ]
};

export default MainRoutes;
