import React from 'react'
import ReactDOM from 'react-dom/client'
import 'roku-ui/style.css'
import { router } from './router'
import { RouterProvider } from 'react-router-dom'
import { Notifications } from 'roku-ui'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Notifications />
  </React.StrictMode>,
)
