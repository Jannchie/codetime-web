import React from 'react'
import ReactDOM from 'react-dom/client'
import 'roku-ui/style.css'
import './styles/index.css'
import { router } from './router'
import { RouterProvider } from 'react-router-dom'
import { Notifications } from 'roku-ui'
import { I18nProvider } from './i18n'
import en from './i18n/data/en.json'
import zhCN from './i18n/data/zh-CN.json'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider
      defaultLocate="zh-CN"
      data={{ en, 'zh-CN': zhCN }}
    >
      <RouterProvider router={router} />
      <Notifications />
    </I18nProvider>
  </React.StrictMode>,
)

// 禁用双指缩放事件
document.documentElement.addEventListener('gesturestart', function (event) {
  event.preventDefault()
}, false)

// 禁用双击缩放事件
let lastTouchEnd = 0
document.documentElement.addEventListener('touchend', function (event) {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    event.preventDefault()
  }
  lastTouchEnd = now
}, false)
