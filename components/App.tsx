import { type ReactNode, useEffect, useState } from 'react'
import { Anchor, Btn, Flex, Panel } from 'roku-ui'

function CookiesConsent () {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('codetime.cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])
  if (!show) return null
  return (
    <div style = {{
      inset: 0,
    }}
    >
      <Panel
        border
        style={{ position: 'fixed', right: 10, bottom: 10, maxWidth: 400, zIndex: 1, padding: '1rem' }}
      >
        <div style={{
          fontSize: '0.8rem',
        }}
        >
          <div>
            { 'We use cookies to track user information and enable you to stay logged in. ' }
            { 'You can disable data collection and cookies by changing your browser settings, but this may affect the functionality of this site. ' }
            { 'We may use cookies in accordance with our ' }
            <Anchor href="/aggrements/privacy-policy">
              { 'Privacy Policy' }
            </Anchor>
            { ' and ' }
            <Anchor href="/aggrements/terms-of-use">
              { 'Terms of Use' }
            </Anchor>
            { ' if you have consented, and you may adjust or withdraw your consent at any time.' }
          </div>
        </div>
        <Flex
          gap="1rem"
          style={{ marginTop: '1rem' }}
        >
          <Btn
            text
            onClick={() => {
              localStorage.removeItem('codetime.cookie-consent')
              setShow(false)
            }}
          >
            { 'Decline' }
          </Btn>
          <Btn
            text
            onClick={() => {
              localStorage.setItem('codetime.cookie-consent', 'true')
              setShow(false)
            }}
          >
            { 'Accept' }
          </Btn>
        </Flex>
      </Panel>
    </div >
  )
}

export function App ({ children }: { children: ReactNode }) {
  return (
    <>
      <CookiesConsent />
      { children }
    </>
  )
}
