import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Appbar, HolyGrail } from 'roku-ui';
import { useTheme } from 'roku-ui';
import { useUserData } from './api';


export function Dashboard() {
  useTheme();
  const user = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    if (!user.data) nav('/')
  }, [user.data])
  return (
    <div className="App">
      <HolyGrail
        header={<Appbar icon={<img width={20} src="/public/icon.svg" />} border varient='pattern' title="CodeTime" />}
        main={<Outlet />}
      />
    </div>
  );
}
