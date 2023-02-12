import { pushNotice } from 'roku-ui';
import useSWR from 'swr';
const baseURL = import.meta.env.VITE_API_BASE_URL;
function useFetch(url: string, options: RequestInit = {}) {
  options.credentials = 'include';
  const finalURL = baseURL + url;
  const res = useSWR(finalURL, async () => {
    const res = await fetch(baseURL + url, options);
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.error);
    }
    return data
  })
  return res;
}

export function useUserData() {
  return useFetch('/user');
}

export function useUserDuration(ms: number) {
  return useFetch(`/user/duration?in=${ms}`);
}

function getTimezoneString() {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(offset / 60);
  const minutes = Math.abs(offset % 60);
  const sign = offset < 0 ? '-' : '+';
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export function useStats(unit: 'minutes'| 'days' | 'hours' = 'minutes', limit=30) {
  return useFetch(`/stats?by=time&tz=${getTimezoneString()}&limit=${limit}&unit=${unit}`);
}