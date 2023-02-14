import { Outlet } from 'react-router-dom'
import { useTheme } from 'roku-ui'

export function App () {
  useTheme()
  return <Outlet />
}
