import { CarbonBadge, CarbonDashboard, CarbonToolKit } from '@roku-ui/icons-carbon'
import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Appbar, Avatar, Btn, Flex, HolyGrail, Panel, useTheme } from 'roku-ui'
import { useUserData } from '../../api'

export function AvatarComponent () {
  const user = useUserData()
  return (
    <div>
      <NavLink to="/dashboard/settings">
        { user.data && <Btn
          icon
          text
          color="default"
        >
          <Avatar src={user.data.avatar} />
        </Btn> }
      </NavLink>
    </div>
  )
}

export function Dashboard () {
  useTheme()
  const user = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    // trigger browser debug
    if (!user.data && !user.isLoading) nav('/')
  }, [nav, user.data, user.isLoading])
  return (
    <div className="App">
      <HolyGrail
        header={<Appbar
          border
          icon={<img
            alt="CodeTime Logo"
            width={20}
            src="/icon.svg"
          />}
          varient="pattern"
          title={<div>{ 'CodeTime' }</div>}
          tailing={<AvatarComponent />}
        />}
        main={<>
          <Flex justify="center" >
            <Panel
              border
              style={{ marginTop: '1rem', borderRadius: '999px', lineHeight: 0 }}
            >
              <Flex >
                {
                  [
                    { to: '/dashboard', icon: <CarbonDashboard /> },
                    { to: '/dashboard/shields', icon: <CarbonBadge /> },
                    { to: '/dashboard/settings', icon: <CarbonToolKit /> },
                  ].map(d => {
                    return (
                      <NavLink
                        key={d.to}
                        end
                        to={d.to}
                      >
                        {
                          ({ isActive }) => {
                            return (
                              <Btn
                                icon
                                variant="text"
                                className={isActive ? 'text-[hsl(var(--r-primary-2))]' : ''}
                                color={isActive ? 'primary' : 'default'}
                              >
                                { d.icon }
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
