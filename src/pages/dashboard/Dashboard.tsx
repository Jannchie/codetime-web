import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Appbar, Avatar, Btn, Flex, HolyGrail, MaterialSymbolIcon, Panel, useTheme } from 'roku-ui'
import { useUserData } from '../../api'

export function AvatarComponent () {
  const user = useUserData()
  return <div>
    <NavLink to="/dashboard/settings">
      { user.data && <Btn icon text color="default">
        <Avatar src={user.data.avatar} />
      </Btn> }
    </NavLink>
  </div>
}

export function Dashboard () {
  useTheme()
  const user = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    if (!user.data && !user.isLoading) nav('/')
  }, [nav, user.data, user.isLoading])
  return (
    <div className="App">
      <HolyGrail
        style={{ height: '100%' }}
        header={<Appbar
          border
          icon={<img alt="CodeTime Logo" width={20} src="/icon.svg" />}
          varient="pattern"
          title={<div>{ 'CodeTime' }</div>}
          tailing={<AvatarComponent />}
        />}
        main={<>
          <Flex justify="center">
            <Panel style={{ marginTop: '1rem', borderRadius: '999px', lineHeight: 0 }}>
              <Flex >
                {
                  [
                    { to: '/dashboard', icon: 'cottage' },
                    { to: '/dashboard/shields', icon: 'workspace_premium' },
                    { to: '/dashboard/settings', icon: 'construction' },
                  ].map(d => {
                    return (
                      <NavLink key={d.to} end to={d.to} >
                        {
                          ({ isActive }) => {
                            return (
                              <Btn icon text color={isActive ? 'primary' : 'default'}>
                                <MaterialSymbolIcon icon={d.icon} />
                              </Btn>
                            )
                          }
                        }
                      </NavLink>
                    )
                  })
                }
              </Flex>
            </Panel>
          </Flex>
          <Outlet />
        </>}
      />
    </div>
  )
}
