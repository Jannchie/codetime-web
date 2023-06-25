import { CarbonCut } from '@roku-ui/icons-carbon'
import { useState } from 'react'
import {
  Flex,
  Container,
  T,
  TextField,
  Panel,
  Btn,
  pushNotice,
  Select,
} from 'roku-ui'
import { useUserData } from '../../api'
import { useWindowSize } from '../../utils/getTimestampList'
import { useI18n } from '../../i18n'

export function ClipableTextField ({ text }: { text: string }) {
  const { t } = useI18n()
  return (
    <Flex
      gap="1rem"
      style={{ width: '100%' }}
    >
      <TextField
        readOnly
        style={{ flexGrow: 1 }}
        value={text}
      />
      <Btn onClick={() => {
        pushNotice({
          title: 'copied',
          desc: 'Text copied to clipboard.',
          type: 'success',
        })
        void navigator.clipboard.writeText(text)
      }}
      >
        <Flex
          align="center"
          gap="0.25rem"
        >
          <CarbonCut width="20px" />
          <span>
            { t('copy') }
          </span>
        </Flex>
      </Btn>
    </Flex>
  )
}

export function ShieldPanel ({ uid }: { uid: number }) {
  const [obj, setObj] = useState<{
    project: string
    days: string
    color: string
  }>({ project: '', days: '', color: '' })
  let days = Number.parseInt(obj.days)
  if (isNaN(days)) days = 0
  const { t } = useI18n()
  const options = [
    { value: 'social', label: 'Social' },
    { value: 'flat', label: 'Flat' },
    { value: 'flat-square', label: 'Flat Square' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'for-the-badge', label: 'For The Badge' },
  ]
  const [style, setStyle] = useState(options[0])
  const link = `https://img.shields.io/endpoint?style=${style.value}${obj.color !== '' ? `&color=${obj.color}` : ''}&url=https%3A%2F%2Fapi.codetime.dev%2Fshield%3Fid%3D${uid}%26project%3D${obj.project}%26in%3D${days * 86400000}`

  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      <Flex
        direction="column"
        gap="1rem"
      >
        <img
          alt={t('shield').join('')}
          src={link}
        />
        <Flex
          align="center"
          gap="1rem"
        >
          <span style={{ minWidth: '100px' }}>{ t('markdown') }</span>
          <ClipableTextField text={`[![CodeTime badge](${link})](https://codetime.dev)`} />
        </Flex>
        <Flex
          align="center"
          gap="1rem"
        >
          <span style={{ minWidth: '100px' }}>{ t('html') }</span>
          <ClipableTextField text={`<img href="https://codetime.dev" alt="Custom badge" src="${link}">`} />
        </Flex>
        <Flex
          gap="1rem"
          direction={useWindowSize().width < 600 ? 'column' : 'row'}
        >
          <TextField
            style={{ flexGrow: 1 }}
            value={obj.project}
            setValue={(v) => { setObj({ ...obj, project: v }) }}
            placeholder={t('project').join('')}
          />
          <TextField
            style={{ flexGrow: 1 }}
            value={obj.days}
            setValue={(v) => { setObj({ ...obj, days: v }) }}
            placeholder={t('days').join('')}
          />
          <Select
            color="primary"
            style={{ flexGrow: 1 }}
            options={options}
            defaultValue={style}
            getKey={d => d.label}
            setValue={setStyle}
          />
          <TextField
            style={{ flexGrow: 1 }}
            value={obj.color}
            setValue={(v) => { setObj({ ...obj, color: v }) }}
            placeholder={t('color').join('')}
          />
        </Flex>
      </Flex>
    </Panel>
  )
}

export function DashboardShields () {
  const user = useUserData()
  const { t } = useI18n()
  const uid = user.data?.id
  return (
    <Container style={{ padding: '1rem' }}>
      <T.H1 className="monospace mb-4">
        { t('shields') }
      </T.H1>
      <Flex
        gap="1rem"
        direction="column"
      >
        { uid && <ShieldPanel uid={uid} /> }
      </Flex>
    </Container>
  )
}
