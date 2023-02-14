import useSWR from 'swr'
import languageIdentifiers from '../data/LanguageIdentifiers.json'
const baseURL = import.meta.env.VITE_API_BASE_URL

const entries = Object.entries(languageIdentifiers)
const languageIdentifiersMap = new Map(entries)

function useFetch<D> (url: string, options: RequestInit = {}) {
  options.credentials = 'include'
  const finalURL = baseURL + url
  const res = useSWR<D>(finalURL, async () => {
    const res = await fetch(baseURL + url, options)
    const data = await res.json()
    if (res.status !== 200) {
      throw new Error(data.error)
    }
    return data
  })
  return res
}

export function useUserData () {
  return useFetch<{
    id: number
    email: string
    username: string
    avatar: string
    github_id: number
    bio: string
    upload_token: string
  }>('/user')
}

export function useUserDuration (ms: number) {
  return useFetch<{ minutes: number }>(`/user/duration?in=${ms}`)
}

function getTimezoneString () {
  const offset = new Date().getTimezoneOffset()
  const hours = Math.abs(offset / 60)
  const minutes = Math.abs(offset % 60)
  const sign = offset < 0 ? '-' : '+'
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
}

export function useStats (
  unit: 'minutes' | 'days' | 'hours' = 'minutes',
  limit = 30,
) {
  return useFetch<{ data: Array<{ duration: number, time: string }> }>(
    `/stats?by=time&tz=${getTimezoneString()}&limit=${limit}&unit=${unit}`,
  )
}

export function useUserTop (
  field: 'platform' | 'language' | 'project',
  minutes = 60,
  limit = 5,
) {
  const res = useFetch<Array<{ field: string, minutes: number }>>(
    `/top?field=${field}&minutes=${minutes}&limit=${limit}`,
  )
  if (res.data) {
    res.data.map((d) => {
      if (field === 'language') {
        d.field = languageIdentifiersMap.get(d.field) ?? d.field
      }
      return d
    })
  }
  return res
}
