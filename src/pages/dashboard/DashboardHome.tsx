import {
  Flex,
  Avatar,
  Container,
  Panel,
  Typography,
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
    <Panel border style={{ padding: '1rem', flexGrow: 1 }}>
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

export function UserPanel () {
  const user = useUserData()
  const window = useWindowSize()
  const boolList = useBools(window.width < 1024 ? 30 : 60)
  const duration = useUserDuration(1000 * 60 * 60 * 24)
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
              {getDurationText(duration.data.minutes * 60 * 1000)} in the last
              24h.
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
  return (
    <Container style={{ padding: '1rem' }}>
      <Typography.H1>Dashboard</Typography.H1>
      <Flex gap="1rem" direction="column">
        <UserPanel />
        <Flex gap="1rem" direction={
          useWindowSize().width < 1024 ? 'column' : 'row'
        }>
          <UserTop field="platform" />
          <UserTop field="project" />
          <UserTop field="language" />
        </Flex>
      </Flex>
    </Container>
  )
}
