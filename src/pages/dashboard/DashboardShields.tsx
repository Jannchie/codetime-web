import { useState } from 'react'
import {
  Flex,
  Container,
  Typography,
  TextField,
  Panel,
  Btn,
  MaterialSymbolIcon,
  pushNotice,
} from 'roku-ui'
import { useUserData } from '../../api'
import { useWindowSize } from '../../utils/getTimestampList'

export function ClipableTextField ({ text }: { text: string }) {
  return <Flex gap="1rem" style={{ width: '100%' }}>
    <TextField
      readOnly
      style={{ flexGrow: 1 }}
      value={text}
    />
    <Btn onClick={() => {
      pushNotice({
        title: 'Copied',
        desc: 'Text copied to clipboard.',
        type: 'success',
      })
      void navigator.clipboard.writeText(text)
    }}>
      <MaterialSymbolIcon icon="cut" style={{ marginRight: '0.25rem' }}/> { 'Copy' }
    </Btn>
  </Flex>
}

export function ShieldPanel ({ uid }: { uid: number }) {
  const [obj, setObj] = useState<{
    project: string
    days: string
    style: string
    color: string
  }>({ project: '', days: '', style: 'social', color: '' })
  let days = Number.parseInt(obj.days)
  if (isNaN(days)) days = 0
  const link = `https://img.shields.io/endpoint?style=${obj.style}${obj.color !== '' ? `&color=${obj.color}` : ''}&url=https%3A%2F%2Fapi.codetime.dev%2Fshield%3Fid%3D${uid}%26project%3D${obj.project}%26in%3D${days * 86400000}`
  return <Panel style={{ padding: '1rem' }}>
    <Flex direction="column" gap="1rem">
      <img alt="shield" src={link} />
      <Flex align="center" gap="1rem">
        <span style={{ minWidth: '90px' }}>{ 'Markdown' }</span>
        <ClipableTextField text={`[![CodeTime badge](${link})](https://codetime.dev)`} />
      </Flex>
      <Flex align="center" gap="1rem">
        <span style={{ minWidth: '90px' }}>{ 'HTML' }</span>
        <ClipableTextField text={`<img href="https://codetime.dev" alt="Custom badge" src="${link}">`} />
      </Flex>
      <Flex gap="1rem" direction={useWindowSize().width < 600 ? 'column' : 'row'}>
        <TextField style={{ flexGrow: 1 }} value={obj.project} setValue={(v) => { setObj({ ...obj, project: v }) }} placeholder="Project" />
        <TextField style={{ flexGrow: 1 }} value={obj.days} setValue={(v) => { setObj({ ...obj, days: v }) }} placeholder="Days" />
        <TextField style={{ flexGrow: 1 }} value={obj.style} setValue={(v) => { setObj({ ...obj, style: v }) }} placeholder="Style" />
        <TextField style={{ flexGrow: 1 }} value={obj.color} setValue={(v) => { setObj({ ...obj, color: v }) }} placeholder="Color" />
      </Flex>
    </Flex>
  </Panel>
}

export function DashboardShields () {
  const user = useUserData()
  const uid = user.data?.id
  return (
    <Container style={{ padding: '1rem' }}>
      <Typography.H1>{ 'Shields' }</Typography.H1>
      <Flex gap="1rem" direction="column" >
        { uid && <ShieldPanel uid={uid} /> }
      </Flex>
    </Container>
  )
}
