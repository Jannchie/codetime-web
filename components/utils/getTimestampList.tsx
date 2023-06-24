import { useState } from 'react'
import { useEventListener, useIsomorphicLayoutEffect } from 'roku-ui'

export function getTimestampList (minutes: number = 30) {
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

export function useWindowSize (): WindowSize {
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
