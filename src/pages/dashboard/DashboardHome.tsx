import { useEffect, useState } from 'react'
import { RokuCal } from 'roku-charts'
import {
  Flex,
  Avatar,
  Container,
  Panel,
  Typography,
  Btn,
  Text,
} from 'roku-ui'
import { useStats, useUserTop, useUserData, useUserDuration } from '../../api'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { getDurationText } from '../../utils/getDurationText'
import { getTimestampList, useWindowSize } from '../../utils/getTimestampList'

export function UserTop ({
  field,
  minutes = 60 * 24,
  limit = 5,
}: {
  field: 'platform' | 'language' | 'project'
  minutes?: number
  limit?: number
}) {
  const data = useUserTop(field, minutes, limit)
  let max: number = 0
  if (data.data) {
    max = data.data.reduce((a, b) => (a.minutes > b.minutes ? a : b)).minutes
  }
  return (
    <Panel border style={{ padding: '1rem', flexGrow: 1, flexBasis: 0 }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bolder', marginBottom: '0.5rem' }}>
        {capitalizeFirstLetter(field)}
      </div>
      {data.data?.map((d) => (
        <Flex
          key={d.field}
          direction="column"
          style={{ marginBottom: '0.5rem' }}
        >
          <Flex
            gap="1rem"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <div>{d.field}</div>
            <div>{getDurationText(d.minutes * 60 * 1000)}</div>
          </Flex>
          <div className="bg-background-3" style={{ borderRadius: '1px' }}>
            <div
              className="bg-primary-2"
              style={{
                height: '2px',
                width: `${(d.minutes / max) * 100}%`,
                borderRadius: '1px',
              }}
            />
          </div>
        </Flex>
      ))}
    </Panel>
  )
}

export function UserPanel ({ minutes }: { minutes: number }) {
  const user = useUserData()
  const window = useWindowSize()
  const boolList = useBools(window.width < 1024 ? 30 : 60)
  const duration = useUserDuration(1000 * minutes * 60)
  return (
    <Panel border style={{ padding: '1rem' }}>
      {user.data && (
        <Flex
          gap="1rem"
          align="center"
          direction={window.width <= 768 ? 'column' : 'row'}
        >
          <Flex gap={'1rem'} align="center">
            <Avatar src={user.data.avatar} />
            {user.data.username}
          </Flex>
          {duration.data && (
            <div style={{ flexGrow: 1 }}>
              {getDurationText(duration.data.minutes * 60 * 1000)} in the last { getDurationText(minutes * 60 * 1000)}.
            </div>
          )}
          <div style={{ flexGrow: 10 }} />
          <Flex
            justify={(window?.width ?? 1920) < 768 ? 'center' : 'end'}
            style={{ width: '100%', maxWidth: '600px', flexShrink: 10 }}
            gap={'0.25rem'}
          >
            {boolList.map((d, i) => (
              <div
                key={i}
                style={{
                  height: '2rem',
                  flexBasis: '0.3rem',
                  backgroundColor: d
                    ? 'hsl(var(--r-primary-2))'
                    : 'hsl(var(--r-default-2))',
                }}
              />
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
  const boolList = allTimestamps.map((d) => set.has(d))
  return boolList.reverse()
}

export function DashboardHome () {
  const [days, setDays] = useState(1)

  return (
    <Container style={{ padding: '1rem' }}>
      <Typography.H1>Dashboard</Typography.H1>
      <Flex gap="1rem" direction="column">
        <div>
          <Btn.Group value={days} setValue={setDays}>
            <Btn value={1}>Today</Btn>
            <Btn value={7}>Week</Btn>
            <Btn value={30}>30 Days</Btn>
          </Btn.Group>
        </div>
        <UserPanel minutes={days * 24 * 60} />
        <Flex gap="1rem" direction={
          useWindowSize().width < 1024 ? 'column' : 'row'
        }>
          <UserTop field="platform" minutes={days * 24 * 60} />
          <UserTop field="project" minutes={days * 24 * 60} />
          <UserTop field="language" minutes={days * 24 * 60}/>
        </Flex>
        <Flex>
          {ActivityChartPanel()}
        </Flex>
      </Flex>
    </Container>
  )
}

function calculateStreak (dates: Date[]): number {
  let currentStreak = 0
  let longestStreak = 0
  dates.sort((a, b) => a.getTime() - b.getTime())
  for (let i = 0; i < dates.length; i++) {
    if (i === 0 || dates[i].getTime() === dates[i - 1].getTime() + 24 * 60 * 60 * 1000) {
      // If this is the first date in the list or the current date is one day after the previous date
      currentStreak++
    } else {
      // Otherwise, the streak has been broken
      longestStreak = Math.max(longestStreak, currentStreak)
      currentStreak = 1
    }
  }

  // Check if the last streak was the longest
  longestStreak = Math.max(longestStreak, currentStreak)

  return longestStreak
}

function calculateCurrentStreak (dates: Date[]): number {
  let currentStreak = 0
  dates.sort((a, b) => a.getTime() - b.getTime())

  // Find the index of the last date in the array that is before today
  let lastDateIndex = dates.length - 1
  while (lastDateIndex >= 0 && dates[lastDateIndex].getTime() > new Date().getTime() + 86400000) {
    lastDateIndex--
  }

  // Calculate the current streak by counting backwards from the last date before today
  for (let i = lastDateIndex; i >= 0; i--) {
    if (i === 0 || dates[i].getTime() === dates[i - 1].getTime() + 24 * 60 * 60 * 1000) {
      // If this is the first date in the list or the current date is one day after the previous date
      currentStreak++
    } else {
      // Otherwise, the streak has been broken
      break
    }
  }

  return currentStreak
}

function ActivityChartPanel () {
  const data = useStats('days', 365 * 24 * 60)
  const calData = data.data?.data.map(d => {
    return {
      date: d.time,
      value: d.duration,
    }
  })
  useEffect(() => {
    if (calData) {
      RokuCal
        .New('#roku')
        .setTheme({
          nanFillColor: 'hsl(var(--r-background-1))',
          visualMap: ['hsl(var(--r-primary-1))', 'hsl(var(--r-primary-2))', 'hsl(var(--r-primary-3))'],
        })
        .setData(calData)
        .draw({
          durationDays: 365,
        })
      const svg = document.querySelector('#roku')?.querySelector('svg')
      if (svg) { svg.style.float = 'right' }
      return () => {
        document.querySelector('#roku')?.childNodes.forEach((d) => { d.remove() })
      }
    }
  }, [calData])
  return <Panel border style={{ padding: '1rem', flexGrow: 1, flexBasis: 0 }}>
    <Flex direction="column">
      <div style={{ fontSize: '1.5rem', fontWeight: 'bolder', marginBottom: '0.5rem' }}>
      Recent Activity
      </div>
      <Flex style={{ position: 'relative' }} gap="1rem" direction={
        useWindowSize().width < 1024 ? 'column' : 'row'
      }>
        <div style={{
          maxWidth: 'calc(100vw - 4rem)',
          overflow: 'hidden',
        }} id="roku" />
        <div style={{
          flexGrow: 1,
        }}>
          <Flex gap="1rem" style={{ width: '100%' }}>
            <div style={{ flexGrow: 1, flexBasis: 0 }}>
              <Text size="sm" className="text-primary-2">
                Most active day
              </Text>
              <div>
                {getDurationText(Math.max(...calData?.map(d => d.value) ?? []))}
              </div>
            </div>
            <div style={{ flexGrow: 1, flexBasis: 0 }}>
              <Text size="sm" className="text-primary-2">
                Total
              </Text>
              <div>
                {getDurationText(calData?.reduce((acc, d) => acc + d.value, 0) ?? 0)}
              </div>
            </div>
            <div style={{ flexGrow: 1, flexBasis: 0 }}>
              <Text size="sm" className="text-primary-2">
                Average
              </Text>
              <div>
                {getDurationText(((calData?.reduce((acc, d) => acc + d.value, 0) ?? 0) / (calData?.length ?? 1)) ?? 0)}
              </div>
            </div>
          </Flex>

          <Flex gap="1rem" style={{ width: '100%' }}>
            <div style={{ flexGrow: 1, flexBasis: 0 }}>
              <Text size="sm" className="text-primary-2">
                Most streak
              </Text>
              <div>
                {calculateStreak(calData?.filter(d => d.value > 0).map(d => new Date(d.date)) ?? [])} Days
              </div>
            </div>
            <div style={{ flexGrow: 1, flexBasis: 0 }}>
              <Text size="sm" className="text-primary-2">
                Current streak
              </Text>
              <div>
                {calculateCurrentStreak(calData?.filter(d => d.value > 0).map(d => new Date(d.date)) ?? [])} Days
              </div>
            </div>
            <div style={{ flexGrow: 1, flexBasis: 0 }} />
          </Flex>

        </div>
      </Flex>
    </Flex>
  </Panel>
}
