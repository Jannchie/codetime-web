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
    return mySprintf(template, args)
  }, [getTemplate])
  return {
    t,
  }
}

function splitString (pattern: RegExp, string: string, args: Record<string, any>): string[] {
  // 通过正则表达式找到所有匹配的部分
  const matches = string.match(pattern) ?? []

  // 使用正则表达式进行分割
  const parts = string.split(pattern)

  // 将匹配的部分和分割后的部分合并，并替换为 args 对象的值
  const result: string[] = []
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i])
    if (i < matches.length) {
      const key = matches[i].slice(2, -2) // 去除 (( 和 ))
      result.push(args[key] || '') // 使用 args 对象的值，如果不存在则使用空字符串
      i += 1
    }
  }

  // 去除空字符串并返回结果
  return result.filter((val) => val !== '')
}

function mySprintf (template: string, args: any = {}) {
  const res = sprintf(template, args)
  return splitString(/\(\((\w+)\)\)/, res, args)
}
