'use client'
import { RokuProvider } from 'roku-ui'
import { enUS, ja, zhCN, zhTW, ptBR } from 'date-fns/locale'
import { useEffect } from 'react'
import { setDefaultOptions } from 'date-fns'
import { useParams } from 'next/navigation'
export function Provider ({ children }: { children: React.ReactNode }) {
  const { lang: locale } = useParams()
  useEffect(() => {
    switch (locale) {
      case 'en':
        setDefaultOptions({ locale: enUS })
        break
      case 'ja':
        setDefaultOptions({ locale: ja })
        break
      case 'zh-CN':
        setDefaultOptions({ locale: zhCN })
        break
      case 'zh-TW':
        setDefaultOptions({ locale: zhTW })
        break
      case 'pt-BR':
        setDefaultOptions({ locale: ptBR })
        break
      default:
        setDefaultOptions({ locale: enUS })
    }
  }, [locale])
  return (
    <RokuProvider>
      { children }
    </RokuProvider>
  )
}
