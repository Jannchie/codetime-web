import { useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
const baseURL = import.meta.env.VITE_API_BASE_URL

export function useMutationFetch<D> (url: string, options: RequestInit = {}) {
  options.credentials = 'include'
  const finalURL = baseURL + url
  return useSWRMutation<D>(finalURL, async () => {
    const res = await fetch(baseURL + url, options)
    const data = await res.json()
    if (res.status !== 200) {
      throw new Error(data.error)
    }
    return data
  }, { })
}

export function useFetch<D> (url: string, options: RequestInit = {}) {
  options.credentials = 'include'
  const finalURL = baseURL + url
  return useSWR<D>(finalURL, async () => {
    const res = await fetch(baseURL + url, options)
    const data = await res.json()
    if (res.status !== 200) {
      throw new Error(data.error)
    }
    return data
  }, {
    onErrorRetry: (error, key, __, revalidate, { retryCount }) => {
      if (key === finalURL) return
      if (retryCount >= 3) return
      if (error instanceof Error && error.message === 'Unauthorized') return
      setTimeout(async () => await revalidate({ retryCount }), 15000)
    },
    revalidateOnFocus: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  })
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

export async function deleteRecords () {
  const finalURL = baseURL + '/user/records'
  const res = await fetch(finalURL, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (res.status !== 200) {
    const data = await res.json()
    throw new Error(data.error)
  }
  return res
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
  otherParams = '',
) {
  return useFetch<{ data: Array<{ duration: number, time: string }> }>(
    `/stats?by=time&tz=${getTimezoneString()}&limit=${limit}&unit=${unit}&` + otherParams,
  )
}

export function useUserTop (
  field: string,
  minutes = 60,
  limit = 5,
) {
  const [params] = useSearchParams()
  return useFetch<Array<{ field: string, minutes: number }>>(
    `/top?field=${field}&minutes=${minutes}&limit=${limit}&${params.toString()}`,
  )
}
