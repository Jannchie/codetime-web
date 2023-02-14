
import { createBrowserRouter } from 'react-router-dom'
import { Home } from './Home'
import { Dashboard } from './Dashboard'
import { DashboardHome } from './DashboardHome'
import { App } from './App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [{
          path: '/dashboard',
          element: <DashboardHome />,
        }],
      },
    ],
  },
])
