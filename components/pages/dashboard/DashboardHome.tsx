import { useEffect, useRef, useState } from 'react'
import { type CalData, RokuCal, type RokuChart } from 'roku-charts'
import {
  Flex,
  Container,
  Panel,
  T,
  Notice,
  Tag,
  ToggleGroup,
  useTrueTheme,
} from 'roku-ui'
import { useStats, useUserTop, useUserData, useUserDuration } from '../../api'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { getDurationString } from '../../utils/getDurationText'
import { getTimestampList, useWindowSize } from '../../utils/getTimestampList'
import * as d3 from 'd3'
import getLanguageName from '../../utils/getLanguageName'
import { CarbonInformation } from '@roku-ui/icons-carbon'
import { useI18n } from '../../i18n'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
export function UserTop ({
  field,
  minutes = 60 * 24,
  limit = 5,
}: {
  field: string
  minutes?: number
  limit?: number
}) {
  const { t } = useI18n()
  const params = useSearchParams()
  const router = useRouter()
  // const [params, setParams] = useSearchParams()
  const data = useUserTop(field, minutes, limit)
  let max: number = 0
  if (data.data) {
    max = data.data.reduce((a, b) => (a.minutes > b.minutes ? a : b)).minutes
  }
  return (
    <Panel
      border
      style={{
        padding: '1rem',
        flexGrow: 1,
        flexBasis: '0px',
        flexShrink: 0,
      }}
    >
      <div style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '1.5rem',
        fontWeight: 'bolder',
        marginBottom: '0.5rem',
      }}
      >
        { t(field + 's') }
      </div>
      { data.data?.map((d) => {
        const selected = params?.get(field) === d.field
        return (
          <Flex
            key={d.field}
            direction="column"
            style={{ paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: selected ? 'bold' : 'normal', color: selected ? 'hsl(var(--r-primary-2))' : 'hsl(var(--r-frontground-2))', transition: 'all 0.15s ease-in-out' }}
            onClick={() => {
              const current = new URLSearchParams(Array.from(params?.entries() ?? []))
              if (selected) {
                current.delete(field)
              } else {
                current.set(field, d.field)
              }
              router.push(`./dashboard?${current.toString()}`)
            }}
          >
            <Flex
              gap="1rem"
              className="text-sm"
              style={{
                justifyContent: 'space-between',
              }}
            >
              <div>
                { field === 'language' ? getLanguageName(d.field) : d.field }
              </div>
              <div>{ getDurationString(d.minutes * 60 * 1000) }</div>
            </Flex>
            <div
              className="bg-background-3"
              style={{ borderRadius: '1px' }}
            >
              <div
                className="bg-[hsl(var(--r-primary))]"
                style={{
                  height: '2px',
                  width: `${(d.minutes / max) * 100}%`,
                  borderRadius: '1px',
                }}
              />
            </div>
          </Flex>
        )
      }) }
    </Panel>
  )
}

export function UserPanel ({ minutes }: { minutes: number }) {
  const user = useUserData()
  const window = useWindowSize()
  const boolList = useBools(window.width < 1024 ? 30 : 60)
  const duration = useUserDuration(1000 * minutes * 60)
  const { t } = useI18n()
  return (
    <Panel
      border
      style={{ padding: '1rem' }}
    >
      { user.data && (
        <Flex
          gap="1rem"
          align="center"
          direction={window.width <= 768 ? 'column' : 'row'}
        >
          { duration.data && (
            <div style={{ flexGrow: 1 }}>
              { t('durationPeriod', {
                duration: getDurationString(duration.data.minutes * 60 * 1000),
                period: getDurationString(minutes * 60 * 1000),
              }) }
            </div>
          ) }
          <div style={{ flexGrow: 10 }} />
          <Flex
            justify={(window?.width ?? 1920) < 768 ? 'center' : 'end'}
            style={{ width: '100%', maxWidth: '600px', flexShrink: 10 }}
            gap="0.25rem"
          >
            { boolList.map((d, i) => (
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
            )) }
          </Flex>
        </Flex>
      ) }
    </Panel>
  )
}

function useBools (minutes = 30) {
  const params = useSearchParams()
  const stats = useStats('minutes', minutes, params?.toString())
  if (!stats.data) return []
  const allTimestamps = getTimestampList(minutes)
  const set = stats.data.data.reduce((acc: Set<string>, d: { time: any }) => {
    acc.add(d.time)
    return acc
  }, new Set<string>())
  const boolList = allTimestamps.map((d) => set.has(d))
  return boolList.reverse()
}

export function DaysComponent () {
  const [days, setDays] = useState(1)
  const { t } = useI18n()
  return (
    <Flex
      direction="column"
      gap="1rem"
    >
      <Panel
        padding
        border
      >
        <ToggleGroup
          value={days}
          setValue={setDays}
          data={[1, 7, 30]}
          body={(d) => {
            switch (d) {
              case 1: { return t('last24hours') }
              case 7: { return t('last7days') }
              case 30: { return t('last30days') }
            }
          }}
        />
      </Panel>
      <UserPanel minutes={days * 24 * 60} />
      <Flex
        gap="1rem"
        direction={useWindowSize().width < 1024 ? 'column' : 'row'}
      >
        <UserTop
          field={'platform'}
          minutes={days * 24 * 60}
        />
        <UserTop
          field={'project'}
          minutes={days * 24 * 60}
        />
        <UserTop
          field={'language'}
          minutes={days * 24 * 60}
        />
      </Flex>
    </Flex>
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

function CalChartComp ({ data, theme }: { data: CalData[], theme?: string }) {
  const chart = useRef<RokuChart<CalData, any>>()
  useEffect(() => {
    if (data) {
      if (!chart.current) {
        chart.current = RokuCal
          .New('#roku')
      }
      chart.current.setTheme({
        nanFillColor: 'hsl(var(--r-background-1))',
        visualMap: theme === 'light' ? d3.schemeBlues[9].slice(1) : d3.quantize(d3.interpolateHcl('#5AF2', '#2AF'), 8),
      })
      if (!data || data.length === 0) return
      chart.current.setData(data)
      try {
        chart.current.draw({
          durationDays: 365,
          tooltipFormatter: (d: CalData) => {
            return `<b>${d.date}</b> </br> ${d.value ? getDurationString(d.value) : getDurationString(0)}`
          },
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
      const svg = document.querySelector('#roku')?.querySelector('svg')
      if (svg) { svg.style.float = 'right' }
    }
  }, [data, theme])
  return (
    <div
      style={{
        maxWidth: 'calc(100vw - 6rem - 2px)',
        overflow: 'hidden',
      }}
      id="roku"
    />
  )
}

function ActivityChartPanel () {
  const theme = useTrueTheme()
  const params = useSearchParams()
  const data = useStats('days', 365 * 24 * 60, params?.toString())
  const calData = data.data?.data.map(d => {
    return {
      date: d.time,
      value: d.duration,
    }
  })
  const { t } = useI18n()
  return (
    <Panel
      border
      style={{
        padding: '1rem',
        flexGrow: 1,
        flexBasis: 0,
      }}
    >
      <Flex direction="column">
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '1.5rem',
          fontWeight: 'bolder',
          marginBottom: '0.5rem',
        }}
        >
          { t('recentActivity') }
        </div>
        <Flex
          style={{ position: 'relative' }}
          gap="1rem"
          direction={useWindowSize().width < 1024 ? 'column' : 'row'}
        >
          <CalChartComp
            data={calData as any}
            theme={theme}
          />
          <div style={{
            flexGrow: 1,
          }}
          >
            <Flex
              gap="1rem"
              style={{ width: '100%' }}
            >
              <div style={{ flexGrow: 1, flexBasis: 0 }}>
                <T.Caption
                  className="text-primary-2 monospace"
                >
                  { t('busiestDay') }
                </T.Caption>
                <div>
                  { getDurationString(Math.max(...calData?.map(d => d.value) ?? [0])) }
                </div>
              </div>
              <div style={{ flexGrow: 1, flexBasis: 0 }}>
                <T.Caption
                  className="text-primary-2 monospace"
                >
                  { t('total') }
                </T.Caption>
                <div>
                  { getDurationString(calData?.reduce((acc, d) => acc + d.value, 0) ?? 0) }
                </div>
              </div>
              <div style={{ flexGrow: 1, flexBasis: 0 }}>
                <T.Caption
                  className="text-primary-2 monospace"
                >
                  { t('average') }
                </T.Caption>
                <div>
                  { getDurationString(((calData?.reduce((acc, d) => acc + d.value, 0) ?? 0) / (calData?.length ?? 1)) ?? 0) }
                </div>
              </div>
            </Flex>

            <Flex
              gap="1rem"
              style={{ width: '100%' }}
            >
              <div style={{ flexGrow: 1, flexBasis: 0 }}>
                <T.Caption
                  className="text-primary-2 monospace"
                >
                  { t('mostStreak') }
                </T.Caption>
                <div>
                  { calculateStreak(calData?.filter(d => d.value > 0).map(d => new Date(d.date)) ?? []) }
                  { ' ' }
                  { t('days') }
                </div>
              </div>
              <div style={{ flexGrow: 1, flexBasis: 0 }}>
                <T.Caption
                  className="text-primary-2 monospace"
                >
                  { t('currentStreak') }
                </T.Caption>
                <div>
                  { calculateCurrentStreak(calData?.filter(d => d.value > 0).map(d => new Date(d.date)) ?? []) }
                  { ' ' }
                  { t('days') }
                </div>
              </div>
              <div style={{ flexGrow: 1, flexBasis: 0 }} />
            </Flex>
          </div>
        </Flex>
      </Flex>
    </Panel>
  )
}

function FilterList () {
  const params = useSearchParams()
  const router = useRouter()
  return (
    <Flex
      gap=".25rem"
      align="center"
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 10,
      }}
    >
      {
        Array.from(params?.entries() ?? []).map(([k, v]) => {
          return (
            <Tag
              key={k + v}
              onClose={() => {
                const newParams = new URLSearchParams(Array.from(params?.entries() ?? []))
                newParams.delete(k)
                router.push('/dashboard?' + newParams.toString())
              }}
            >
              { capitalizeFirstLetter(k) }
              { ' ' }
              =
              { k === 'language' ? getLanguageName(v) : v }
            </Tag>
          )
        })
      }
    </Flex>
  )
}
export function DashboardHome () {
  const params = useSearchParams()
  const data = useStats('days', 365 * 24 * 60, params?.toString())
  const { t } = useI18n()
  return (
    <Container style={{ padding: '1rem' }}>
      { data.data && data.data.data.length === 0 && <Notice
        border
        className="mb-4"
        icon={<CarbonInformation width="20px" />}
        color="warning"
        title={t('noData')}
        desc={<>
          {
            t('noDataDesc', {
              settings: <Link
                key="settings"
                className="hover:text-primary-2 underline decoration-primary-2"
                href={'/dashboard/settings'}
              >
                { t('settings') }
              </Link>,
            })
          }
        </>}
      /> }
      <T.H1 className="monospace mb-4">
        { t('dashboard') }
      </T.H1>
      <Flex
        gap="1rem"
        direction="column"
      >
        { params.toString() === '' ? null : <FilterList /> }
        <ActivityChartPanel />
        <DaysComponent />
      </Flex>
    </Container>
  )
}
