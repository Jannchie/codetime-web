
import { formatDuration } from 'date-fns'
export function getDurationData (ms: number): { hour: number, minute: number, second: number } {
  const MS_OF_HOUR = 3600000
  const MS_OF_MINUTE = 60000
  const MS_OF_SECOND = 1000
  const hour = Math.floor(ms / MS_OF_HOUR)
  ms %= MS_OF_HOUR
  const minute = Math.floor(ms / MS_OF_MINUTE)
  ms %= MS_OF_MINUTE
  const second = Math.floor(ms / MS_OF_SECOND)
  return { hour, minute, second }
}

export function getDurationString (ms: number): string {
  const { hour, minute, second } = getDurationData(ms)
  return formatDuration({ hours: hour, minutes: minute, seconds: second }, {
    format: ['hours', 'minutes', 'seconds'],
  })
}

export function getDurationText (ms: number): string {
  let result = ''
  const MS_OF_HOUR = 3600000
  const MS_OF_MINUTE = 60000
  if (ms >= MS_OF_HOUR) {
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
  if (ms >= MS_OF_MINUTE) {
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
