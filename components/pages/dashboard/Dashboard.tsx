import { CarbonBadge, CarbonDashboard, CarbonToolKit } from '@roku-ui/icons-carbon'
import { useEffect } from 'react'
import { Appbar, Avatar, Btn, Flex, HolyGrail, Panel, useTheme } from 'roku-ui'
import { useUserData } from '../../api'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TablerBrandGithub } from '@roku-ui/icons-tabler'
export function AvatarComponent () {
  const user = useUserData()
  return (
    <div>
      <Link href="/dashboard/settings">
        { user.data && <Btn
          icon
          text
          color="default"
        >
          <Avatar src={user.data.avatar} />
        </Btn> }
      </Link>
    </div>
  )
}

export function Dashboard ({ children }: { children?: React.ReactNode }) {
  useTheme()
  const user = useUserData()
  const router = useRouter()
  const pathname = usePathname()
  const { lang } = useParams()
  useEffect(() => {
    // trigger browser debug
    if (!user.data && !user.isLoading) router.push('/')
  }, [router, user.data, user.isLoading])
  return (
    <div className="App">
      <HolyGrail
        style={{ height: '100vh' }}
        header={<Appbar
          border
          style={{ zIndex: 1 }}
          icon={<img
            alt="CodeTime Logo"
            width={20}
            src="/icon.svg"
          />}
          varient="blur"
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
                    { to: `/${lang}/dashboard`, icon: <CarbonDashboard /> },
                    { to: `/${lang}/dashboard/shields`, icon: <CarbonBadge /> },
                    { to: `/${lang}/dashboard/settings`, icon: <CarbonToolKit /> },
                  ].map(d => {
                    return (
                      <Link
                        key={d.to}
                        href={d.to}
                      >
                        <Btn
                          icon
                          variant="text"
                          color={pathname.endsWith(d.to) ? 'primary' : 'default'}
                        >
                          { d.icon }
                        </Btn>
                      </Link>
                    )
                  })
                }
              </Flex>
            </Panel>
          </Flex>
          { children }
        </>}
        footer={<div
          className="rounded-none p-2 mt-10"
        >
          <div className="text-sm text-center">
            <Btn
              icon
              text
              as={Link}
              color="default"
              href={'https://github.com/datreks'}
              target="_blank"
            >
              <TablerBrandGithub />
            </Btn>
          </div>
          <div className="text-center text-frontground-3 text-sm">
            { `Datreks @ ${new Date().getFullYear()}, All rights reserved.` }
          </div>
        </div>}
      />
    </div>
  )
}
