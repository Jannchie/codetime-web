
import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home'
import { Dashboard } from './pages/dashboard/Dashboard'
import { DashboardHome } from './pages/dashboard/DashboardHome'
import { App } from './App'
import { DashboardSettings } from './pages/dashboard/DashboardSettings'
import { DashboardShields } from './pages/dashboard/DashboardShields'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfUse } from './pages/TermsOfUse'
import { Aggrements } from './pages/Aggrements'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'aggrements',
        element: <Aggrements />,
        children: [
          {
            path: 'privacy-policy',
            element: <PrivacyPolicy />,
          }, {
            path: 'terms-of-use',
            element: <TermsOfUse />,
          },
        ],
      },
      {
        path: '/',
        element: <Home />,
      },

      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [{
          path: '',
          element: <DashboardHome />,
        }, {
          path: 'settings',
          element: <DashboardSettings />,
        }, {
          path: 'shields',
          element: <DashboardShields />,
        }],
      },
    ],
  },
])
