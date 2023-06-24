'use client'
import type React from 'react'
import { createContext, useCallback, useContext } from 'react'
import { sprintf } from 'sprintf-js'

const i18nCtx = createContext < { data: Record<string, string> }>({
  data: {},
})

export function I18nProvider ({ children, data }: React.PropsWithChildren<{ data: Record<string, string> }>) {
  return <i18nCtx.Provider value={{ data }}>{ children }</i18nCtx.Provider>
}

export function useI18n () {
  const { data } = useContext(i18nCtx)
  const getTemplate = useCallback((key: string) => {
    if (!data) {
      // eslint-disable-next-line no-console
      console.warn('i18n: locate not found')
      return key
    }
    const template = data[key]
    if (!template) {
      // eslint-disable-next-line no-console
      console.warn(`i18n: template ${key} not found`)
      return key
    }
    return template
  }, [data])
  const t = useCallback((key: string, args: any = {}) => {
    const template = getTemplate(key)
    return sprintf(template, args)
  }, [getTemplate])
  return {
    t,
  }
}
