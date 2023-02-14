import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from 'roku-ui'
import { useUserData } from './api'
export function App () {
  useTheme()
  const userRes = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    if (userRes.data) nav('/dashboard')
  }, [nav, userRes.data])
  return <Outlet/>
}
