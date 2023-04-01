import { type ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Container, Footer, useTheme, Text } from 'roku-ui'
import { useUserData } from '../api'
import '../styles/index.css'

export function AwesomeText ({ children, colorStart, colorEnd }: { children?: ReactNode, colorStart: string, colorEnd: string }) {
  const [deg, setDeg] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setDeg(deg => (deg + 4 % 360))
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <div className="gradient-text"
      style={{
        display: 'inline-block',
        backgroundImage: `linear-gradient(${deg}deg, ${colorStart} 5%, ${colorEnd} 95%)`,
      }}>
      { children }
    </div>
  )
}
export function Home () {
  const { theme } = useTheme()
  const userRes = useUserData()
  const nav = useNavigate()
  useEffect(() => {
    if (userRes.data) {
      if (!window.location.pathname.includes('/dashboard')) {
        nav('/dashboard')
      }
    }
  }, [nav, userRes.data])
  if (userRes.isLoading) {
    return <></>
  }
  return (
    <>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          fontFamily: 'monospace',
          padding: '6rem 0rem 0rem 0rem',
        }}>
          <AwesomeText colorStart="#333" colorEnd={theme === 'light' ? 'hsl(var(--r-frontground-1))' : 'hsl(var(--r-background-3))'}>
            <Text size="xxl">
              Code
            </Text>
          </AwesomeText>
          <AwesomeText colorStart={theme === 'light' ? 'hsl(var(--r-frontground-1))' : 'hsl(var(--r-background-3))'} colorEnd="#2980B9">
            <Text weight="bold" size="xxl">
              Time
            </Text>
          </AwesomeText>
        </div>
        <div className="text-frontground-3" style={{ maxWidth: '60ch', paddingTop: '1rem' }}>
          <Text size="md">
            { 'A productivity tool for software developers. It helps developers track the amount of time they spend on coding projects, and provides insights into their coding habits and productivity.\r' }
          </Text>
        </div>
        <Btn text gloryColor="linear-gradient(to right, #6a11cb 0%, #2575fc 100%)" size="lg" style={{ marginTop: '3rem', background: 'hsl(var(--r-frontground-2), 0.025)' }} onClick={() => { window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github` }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.2rem' }}>
            <svg style={{ width: '2rem', height: '2rem' }} viewBox="0 0 98 98" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill={theme === 'dark' ? '#fff' : '#000'} /></svg>
            <span style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>{ 'Sign in with Github' }</span>
          </div>
        </Btn>
        <div className="text-frontground-3 text-xs" style={{
          marginTop: '1rem',
        }}>
          { 'Free for everyone. No credit card required.\r' }
        </div>
      </div>
      <Container style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
      }} >{ }</Container>
      <Footer className="text-frontground-3" style={{ position: 'sticky', top: '100vh' }}>
        { 'Datreks @ ' }{ new Date().getFullYear() }
      </Footer>
    </>
  )
}
