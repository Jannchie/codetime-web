import { useCallback, useState } from 'react'
import {
  Flex,
  Container,
  T,
  pushNotice,
  TextField,
  Panel,
  Btn,
  Anchor,
  Modal,
  Select,
  ThemeToggle,
} from 'roku-ui'
import { deleteRecords, useMutationFetch, useRecordExportMutation, useUserData } from '../../api'
import { useI18n } from '../../i18n'
import { useDebounce } from 'usehooks-ts'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { TablerCut, TablerDownload, TablerLogout, TablerTrash } from '@roku-ui/icons-tabler'
export function TokenPanel () {
  const user = useUserData()
  const [hover, setHover] = useState(false)
  const debounceHover = useDebounce(hover, 1000)
  const { t } = useI18n()
  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      { user.data && (
        <>
          <div
            className="monospace"
            style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
          >
            { t('token') }
          </div>
          <Flex gap="1rem">
            <TextField
              readOnly
              type={hover && debounceHover ? 'text' : 'password'}
              style={{ fontFamily: 'monospace', flexGrow: 1 }}
              defaultValue={user.data.upload_token}
              value={undefined}
              onMouseEnter={() => { setHover(true) }}
              onMouseLeave={() => { setHover(false) }}
            />
            <Btn
              leadingIcon={<TablerCut />}
              onClick={() => {
                void navigator.clipboard.writeText(
                  user.data?.upload_token ?? '',
                )
                pushNotice({
                  title: t('copied'),
                  desc: t('tokenCopied'),
                  type: 'success',
                })
              }}
            >
              { t('copy') }
            </Btn>
          </Flex>
          <div
            className="text-frontground-3 text-sm"
            style={{ marginTop: '0.25rem' }}
          >
            { t('tokenPrivacy') }
            <br />
            { t('tokenUsage') }
            <Anchor href="https://github.com/datreks/codetime-vscode" >{ 'github.com/datreks/codetime-vscode' }</Anchor>
          </div>
        </>
      ) }
    </Panel>
  )
}

export function ThemePanel () {
  const { t } = useI18n()
  const { lang: locate } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const getKey = useCallback((lang: string) => {
    return t(lang.replace('-', ''))
  }, [t])
  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      <div
        className="monospace"
        style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
      >
        { t('preferences') }
      </div>
      <Flex
        col
        gap="1rem"
      >
        <div>
          <div className="text-lg">{ t('themes') }</div>
          <ThemeToggle />
        </div>
        <div className="text-lg">{ t('languages') }</div>
        <div>
          <Select<{ lang: string, label: string }>
            defaultValue={{ lang: locate, label: getKey(locate).join('') }}
            options={[
              { lang: 'en', label: 'English' },
              { lang: 'zh-CN', label: '简体中文' },
              { lang: 'zh-TW', label: '繁體中文' },
              { lang: 'ja', label: '日本語' },
              { lang: 'pt-BR', label: 'Brasileiro' },
            ]}
            getKey={(d) => d.label}
            setValue={d => {
              document.cookie = `NEXT_LOCALE=${d.lang};path=/;max-age=31536000`
              router.push(pathname.replace(locate, d.lang), {
                replace: true,
              })
            }}
          />
          {
            locate === 'en' && (
              <div
                className="text-frontground-3 text-sm"
                style={{ marginTop: '0.25rem' }}
              >
                { t('contributeProject') }
                <Anchor
                  href="https://github.com/Jannchie/codetime-web"
                  target="_blank"
                >
                  { 'github.com/Jannchie/codetime-web' }
                </Anchor>
              </div>
            )
          }
        </div>
      </Flex>
    </Panel>
  )
}

function DangerPanel () {
  const { t } = useI18n()
  const [showModal, setShowModal] = useState(false)
  return (
    <Panel
      border
      style={{ padding: '1rem', borderColor: 'hsl(var(--r-danger-1))' }}
    >
      <div
        className="monospace"
        style={{ fontSize: '1.5rem', color: 'hsl(var(--r-danger-1))' }}
      >
        { t('dangerZone') }
      </div>
      <div
        style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
        className="text-frontground-3"
      >
        { t('irrevocableWarning') }
      </div>
      <Btn
        color="danger"
        leadingIcon={<TablerTrash />}
        onClick={() => {
          setShowModal(true)
        }}
      >
        { t('destroyRecords') }
      </Btn>
      <Modal
        backgroundBlur
        background
        show={showModal}
        setShow={setShowModal}
      >
        <ConfirmModal setShow={setShowModal} />
      </Modal>
    </Panel>
  )
}
function ConfirmModal ({ setShow }: { setShow: (show: boolean) => void }) {
  const [text, setText] = useState('')
  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      <T.H4>{ 'Are you sure?' }</T.H4>
      <T.Caption>{ 'This operation is irreversible. All your records will be deleted.' }</T.Caption>
      <div>
        <TextField
          style={{ width: '100%' }}
          value={text}
          setValue={setText}
          placeholder={'Input: "I\'m sure."'}
        />
      </div>
      <Flex
        gap="0.5rem"
        style={{ marginTop: '1rem' }}
      >
        <Btn
          color="danger"
          disabled={text !== 'I\'m sure.'}
          onClick={() => {
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
          }}
        >
          { 'I\'m sure.' }
        </Btn>
        <Btn
          color="default"
          onClick={() => {
            setShow(false)
          }}
        >
          { 'Cancel' }
        </Btn>
      </Flex>
    </Panel>
  )
}

function LogoutPanel () {
  const { t } = useI18n()
  const res = useMutationFetch('/auth/logout', { method: 'POST' })
  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      <div
        className="monospace"
        style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
      >
        { t('others') }
      </div>
      <Btn
        color="primary"
        leadingIcon={ <TablerLogout />}
        onClick={() => {
          void res.trigger().then(() => {
            window.location.reload()
          })
        }}
      >
        { t('logout') }
      </Btn>
    </Panel>
  )
}

export function ExportPanel () {
  const exportMutation = useRecordExportMutation()
  const { t } = useI18n()
  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      <div
        className="monospace"
        style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
      >
        { 'Export' }
      </div>
      <Btn
        loading={exportMutation.isMutating}
        color="primary"
        leadingIcon={<TablerDownload />}
        onClick={() => {
          if (exportMutation.isMutating) return
          void exportMutation.trigger().then((data) => {
            // download file
            // data is string of csv
            const blob = new Blob([data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `records-${new Date().toISOString()}.csv`
            a.click()
          })
        }}
        >
        <Flex gap="0.5rem">
          { t('export') }
        </Flex>
      </Btn>
      <div
        className='text-frontground-3 text-sm mt-2'
      >
        { t('exportDesc') }
      </div>
    </Panel>
  )
}
export function DashboardSettings () {
  const { t } = useI18n()
  return (
    <Container style={{ padding: '1rem' }}>
      <T.H1 className="monospace mb-4">
        { t('settings') }
      </T.H1>
      <Flex
        gap="1rem"
        direction="column"
      >
        <TokenPanel />
        <ThemePanel />
        <ExportPanel />
        <DangerPanel />
        <LogoutPanel />
      </Flex>
    </Container>
  )
}
