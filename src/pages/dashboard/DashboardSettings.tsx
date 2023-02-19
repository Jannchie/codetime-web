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
  Modal,
} from 'roku-ui'
import { deleteRecords, useUserData } from '../../api'

export function TokenPanel () {
  const user = useUserData()
  const [hover, setHover] = useState(false)
  return (
    <Panel border style={{ padding: '1rem' }}>
      { user.data && (
        <>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
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
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
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
        <DangerPanel />
      </Flex>
    </Container>
  )
}

function DangerPanel () {
  const [showModal, setShowModal] = useState(false)
  return <Panel border style={{ padding: '1rem', borderColor: 'hsl(var(--r-danger-1))' }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'hsl(var(--r-danger-1))' }}>
      { 'Danger Zone' }
      <div style={{ fontSize: '0.8rem' }} className="text-frontground-3">{ 'I hope you understand what is being done. These operations are irrevocable.' }</div>
    </div>
    <Btn color="danger" onClick={() => {
      setShowModal(true)
    }}>
      <Flex gap="0.5rem">
        <MaterialSymbolIcon icon="delete" />
        { 'Distory All My Records' }
      </Flex>
    </Btn>
    <Modal backgroundBlur background show={showModal} setShow={setShowModal} >
      <ConfirmModal setShow={setShowModal} />
    </Modal>
  </Panel>
}
function ConfirmModal ({ setShow }: { setShow: (show: boolean) => void }) {
  const [text, setText] = useState('')
  return <Panel border style={{ padding: '1rem' }}>
    <Typography.H4>{ 'Are you sure?' }</Typography.H4>
    <Typography.P>{ 'This operation is irreversible. All your records will be deleted.' }</Typography.P>
    <div>
      <TextField style={{ width: '100%' }} value={text} setValue={setText} placeholder={'Input: "I\'m sure."'} />
    </div>
    <Flex gap="0.5rem" style={{ marginTop: '1rem' }}>
      <Btn color="danger" disabled={text !== 'I\'m sure.'} onClick={() => {
        void deleteRecords().then(() => {
          pushNotice({
            title: 'Success',
            desc: 'All records have been deleted.',
          })
        }).catch(() => {
          pushNotice({
            title: 'Error',
            desc: 'Failed to delete records.',
            type: 'danger',
          })
        })
        setShow(false)
      }}>{ 'I\'m sure.' }</Btn>
      <Btn color="default" onClick={() => {
        setShow(false)
      }} >{ 'Cancel' }</Btn>
    </Flex>
  </Panel>
}
