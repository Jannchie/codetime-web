import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from 'roku-ui';
import { useUserData } from './api';
export function App() {
  useTheme();
  const userRes = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    console.log(userRes.data)
    if (userRes.data) nav('/dashboard')
  }, [userRes.data])
  return <Outlet/>;
}

