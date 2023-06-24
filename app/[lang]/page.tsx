'use client'
import { Notifications } from 'roku-ui'
import { App } from '../../components/App'
import { Home } from '../../components/pages/Home'
import { useI18n } from '../../components/i18n'

export default function Page ({ params }: { params: { lang: string } }) {
  const { t } = useI18n()
  t('documentTitle')
  return (
    <App>
      <Notifications className="z-50" />
      <Home />
    </App>
  )
}
