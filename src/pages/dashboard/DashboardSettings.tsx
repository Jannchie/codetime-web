import { useState } from 'react'
import {
  Flex,
  Container,
  Typography,
  pushNotice,
  TextField,
  Panel,
  Btn,
  MaterialSymbolIcon,
  Anchor,
  useTheme,
} from 'roku-ui'
import { useUserData } from '../../api'

export function TokenPanel () {
  const user = useUserData()
  const [hover, setHover] = useState(false)
  return (
    <Panel border style={{ padding: '1rem' }}>
      { user.data && (
        <>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bolder', marginBottom: '0.5rem' }}>
            { 'Upload Token' }
          </div>
          <Flex gap="1rem">
            <TextField
              readOnly
              type={!hover ? 'password' : 'text'}
              style={{ width: '100%', fontFamily: 'monospace' }}
              defaultValue={user.data.upload_token}
              value={undefined}
              onMouseEnter={() => { setHover(true) }}
              onMouseLeave={() => { setHover(false) }}
            />
            <Btn
              onClick={() => {
                void navigator.clipboard.writeText(
                  user.data?.upload_token ?? '',
                )
                pushNotice({
                  title: 'Copied',
                  desc: 'Token copied to clipboard',
                  type: 'success',
                })
              }}
            >
              <MaterialSymbolIcon icon="cut" /> { 'Copy' }
            </Btn>
          </Flex>
          <div className="text-frontground-3 text-sm" style={{ marginTop: '0.25rem' }}>
            { 'This token is used to upload your data to the server. It is recommended to keep it private.' }
            <br />
            { 'Learn how to use the token: ' }<Anchor href="https://github.com/datreks/codetime-vscode" >{ 'github.com/datreks/codetime-vscode' }</Anchor>
          </div>
        </>
      ) }
    </Panel>
  )
}

export function ThemePanel () {
  const { theme, setTheme } = useTheme()
  return (
    <Panel border style={{ padding: '1rem' }}>
      <>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bolder', marginBottom: '0.5rem' }}>
          { 'Theme' }
        </div>
        <Flex gap="1rem">
          <Btn.Group value={theme} setValue={setTheme}>
            <Btn value="dark" >{ 'Dark ' }</Btn>
            <Btn value="light" >{ 'Light ' }</Btn>
          </Btn.Group>
        </Flex>
      </>
    </Panel>
  )
}

export function DashboardSettings () {
  return (
    <Container style={{ padding: '1rem' }}>
      <Typography.H1>{ 'Settings' }</Typography.H1>
      <Flex gap="1rem" direction="column" >
        <TokenPanel />
        <ThemePanel />
      </Flex>
    </Container>
  )
}
