import { useState } from 'react'
import { Btn, Flex, MaterialSymbolIcon, pushNotice, useEventListener, useIsomorphicLayoutEffect, Avatar, Container, Panel, TextField, Typography } from 'roku-ui'
import { useStats, useUserData, useUserDuration } from './api'

function getTimestampList (minutes: number = 30) {
  const now = new Date()
  const timestampList = []

  for (let i = 0; i < minutes; i++) {
    const previousMinute = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() - (i + 1),
      0,
      0,
    )
    // add time offset
    const offset = now.getTimezoneOffset()
    previousMinute.setMinutes(previousMinute.getMinutes() - offset)
    const previousMinuteTimestamp = previousMinute.toISOString().split('.')[0] + 'Z'
    timestampList.push(previousMinuteTimestamp)
  }
  return timestampList
}

export interface WindowSize {
  width: number
  height: number
}

function useWindowSize (): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener('resize', handleSize)

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return windowSize
}

export function getDurationText (ms: number): string {
  let result = ''
  const MS_OF_HOUR = 3600000
  const MS_OF_MINUTE = 60000
  if (ms > MS_OF_HOUR) {
    // 超过1小时
    if (result !== '') {
      result += ' '
    }
    const hour = Math.floor(ms / MS_OF_HOUR)
    result += `${hour}hr`
    if (hour > 1) {
      result += 's'
    }
    ms %= MS_OF_HOUR
  }
  if (ms > MS_OF_MINUTE) {
    if (result !== '') {
      result += ' '
    }
    // 超过1分钟
    const minute = Math.floor(ms / MS_OF_MINUTE)
    result += `${minute}min`
    if (minute > 1) {
      result += 's'
    }
    ms %= MS_OF_MINUTE
  }
  if (result !== '') {
    return result
  }
  const s = Math.floor(ms / 1000)
  result += `${s}sec`
  if (s > 1) {
    result += 's'
  }
  return result
}

export function UserPanel () {
  const user = useUserData()
  const window = useWindowSize()
  const boolList = useBools(window.width < 1024 ? 30 : 60)
  const duration = useUserDuration(1000 * 60 * 60 * 24)
  return (
    <Panel border style={{ padding: '1rem' }}>
      {user.data && (
        <Flex gap="1rem" align="center" direction={window.width <= 768 ? 'column' : 'row'}>
          <Flex gap={'1rem'} align="center">
            <Avatar src={user.data.avatar} />
            {user.data.username}
          </Flex>
          <div style={{ flexGrow: 1 }}>
            {getDurationText(duration.data?.minutes * 60 * 1000)} in the last 24h.
          </div>
          <div style={{
            flexGrow: 10,
          }} />
          <Flex justify={(window?.width ?? 1920) < 768 ? 'center' : 'end'} style={{ width: '100%', maxWidth: '600px', flexShrink: 10 }} gap={'0.25rem'} >
            {boolList.map((d, i) => (
              <div key={i} style={{ height: '2rem', flexBasis: '0.3rem', backgroundColor: d ? 'hsl(var(--r-primary-2))' : 'hsl(var(--r-default-2))' }} />
            ))}
          </Flex>
        </Flex>
      )}
    </Panel>
  )
}

function useBools (minutes = 30) {
  const stats = useStats('minutes', minutes)
  if (!stats.data) return []
  const allTimestamps = getTimestampList(minutes)
  const set = stats.data.data.reduce((acc: Set<string>, d: { time: any }) => {
    acc.add(d.time)
    return acc
  }, new Set<string>())
  const boolList = allTimestamps.map(d => set.has(d))
  return boolList.reverse()
}

export function TokenPanel () {
  const user = useUserData()
  return (
    <Panel border style={{ padding: '1rem' }}>
      {user.data && (
        <>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bolder' }}>Upload Token</div>
          <Flex gap="1rem">
            <TextField readOnly style={{ width: '100%', fontFamily: 'monospace' }} defaultValue={user.data.upload_token} value={undefined} />
            <Btn onClick={() => {
              void navigator.clipboard.writeText(user.data.upload_token)
              pushNotice({
                title: 'Copied',
                desc: 'Token copied to clipboard',
                type: 'success',
              })
            }}> <MaterialSymbolIcon icon="cut" /> Copy </Btn>
          </Flex>
        </>
      )}
    </Panel>
  )
}
export function DashboardHome () {
  return (
    <Container style={{ padding: '1rem' }}>
      <Typography.H1>
        Dashboard
      </Typography.H1>
      <Flex gap="1rem" direction="column">
        <UserPanel />
        <TokenPanel />
      </Flex>
    </Container>
  )
}
