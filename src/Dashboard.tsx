import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Appbar, HolyGrail, useTheme } from 'roku-ui'
import { useUserData } from './api'

export function Dashboard () {
  useTheme()
  const user = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    if (!user.data) nav('/')
  }, [nav, user.data])
  return (
    <div className="App">
      <HolyGrail
        header={<Appbar border icon={<img alt="CodeTime Logo" width={20} src="/icon.svg" />} varient="pattern" title="CodeTime" />}
        main={<Outlet />}
      />
    </div>
  )
}
