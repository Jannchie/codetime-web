import type React from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { sprintf } from 'sprintf-js'

const i18nCtx = createContext<{ locate: string, setLocate: (locate: string) => void, data: Record<string, Record<string, string>> }>({
  locate: 'en',
  setLocate: () => { },
  data: {},
})

export type I18nData = Record<string, Record<string, string>>

export function I18nProvider ({ children, defaultLocate, data }: React.PropsWithChildren<{ defaultLocate: string, data: I18nData }>) {
  const [locate, setLocate] = useState(defaultLocate)
  return <i18nCtx.Provider value={{ locate, setLocate, data }}>{ children }</i18nCtx.Provider>
}

export function useI18n () {
  const { data, locate, setLocate } = useContext(i18nCtx)
  const getTemplate = useCallback((key: string) => {
    const langData = data[locate]
    if (!langData) {
      // eslint-disable-next-line no-console
      console.warn(`i18n: locate ${locate} not found`)
      return key
    }
    const template = langData[key]
    if (!template) {
      // eslint-disable-next-line no-console
      console.warn(`i18n: template ${key} not found`)
      return key
    }
    return template
  }, [data, locate])
  const t = useCallback((key: string, args: any = {}) => {
    const template = getTemplate(key)
    return sprintf(template, args)
  }, [getTemplate])
  return {
    t, locate, setLocate,
  }
}
