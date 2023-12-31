import { I18nProvider } from '../../components/i18n'
import en from '../../components/i18n/data/en.json'
import ja from '../../components/i18n/data/ja.json'
import zhCN from '../../components/i18n/data/zh-CN.json'
import zhTW from '../../components/i18n/data/zh-TW.json'
import ptBR from '../../components/i18n/data/pt-BR.json'
import it from '../../components/i18n/data/it.json'
import { cookies } from 'next/dist/client/components/headers'
import { Provider } from './provider'
import { type Metadata } from 'next'
import Script from 'next/script'

export type localeTypes = 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'pt-BR' | 'it'
export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'pt-BR', 'it']
export function getData (locale: string) {
  switch (locale) {
    case 'en':
      return en
    case 'ja':
      return ja
    case 'zh-CN':
      return zhCN
    case 'zh-TW':
      return zhTW
    case 'pt-BR':
      return ptBR
    case 'it':
      return it
    default:
      return en
  }
}

export async function generateMetadata (
  { params }: { params: { lang: string }, searchParams: URLSearchParams },
): Promise<Metadata> {
  // read route params

  const { lang } = params
  let title = 'CodeTime - Track your coding time'
  let description = 'CodeTime is a time tracking tool for programmers. It enhances sense of achievement and motivation in programming by tracking your coding time.'
  switch (lang) {
    case 'zh-CN':
      title = 'CodeTime - 追迹你的编程时长'
      description = 'CodeTime 是一款程序员的时间追踪工具。通过追踪你的编程时间，它可以提升你的成就感和动力。'
      break
    case 'zh-TW':
      title = 'CodeTime - 追蹤你的編程時長'
      description = 'CodeTime 是一款程式設計師的時間追蹤工具。透過追蹤你的編程時間，它可以提升你的成就感和動力。'
      break
    case 'en':
      title = 'CodeTime - Track your coding time'
      description = 'CodeTime is a time tracking tool for programmers. It enhances sense of achievement and motivation in programming by tracking your coding time.'
      break
    case 'ja':
      title = 'CodeTime - コーディング時間を追跡する'
      description = 'CodeTime はプログラマー向けの時間追跡ツールです。コーディング時間を追跡することで、プログラミングにおける達成感とモチベーションを高めます。'
      break
    case 'pt-BR':
      title = 'CodeTime - Rastreie seu tempo de codificação'
      description = 'CodeTime é uma ferramenta de rastreamento de tempo para programadores. Ele aumenta o senso de realização e motivação na programação, rastreando seu tempo de codificação.'
      break
    case 'id':
      title = 'CodeTime - Lacak waktu coding Anda'
      description = 'CodeTime adalah alat pelacakan waktu untuk programmer. Ini meningkatkan rasa pencapaian dan motivasi dalam pemrograman dengan melacak waktu coding Anda.'
  }
  return {
    title,
    description,
    applicationName: 'CodeTime',
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    authors: [{
      name: 'Jannchie',
    }, {
      name: 'Si9ma',
      }],
    icons: ['/icon.svg'],
    keywords: 'CodeTime, time tracking, programming, programmer, coding, time, track, productivity, motivation, achievement, Wakatime',
    openGraph: {
      title,
      description,
      type: 'website',
      locale: lang,
      url: `https://codetime.dev/${lang}`,
      images: 'https://codetime.dev/icon.svg',
    },
    twitter: {
      images: 'https://codetime.dev/icon.svg',
      creator: '@jannchie',
    },
  }
}
export default function Layout ({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: localeTypes }
}) {
  const data = getData(lang)
  const cookieStore = cookies()
  let cookieTheme = cookieStore.get('roku.theme')?.value
  if (!cookieTheme || cookieTheme === '') {
    cookieTheme = cookieStore.get('roku.theme.default')?.value
  }
  if (!cookieTheme || cookieTheme === '') {
    cookieTheme = 'dark'
  }
  return (
    <html
      lang={lang}
      data-theme={cookieTheme}
    >
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-36N091FBKT" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-36N091FBKT');
        `}
      </Script>
      <body className="h-screen">
        <I18nProvider data={data}>
          <Provider>
            { children }
          </Provider>
        </I18nProvider>
      </body>
    </html>
  )
}
