import React from 'react'
import ReactDOM from 'react-dom/client'
import 'roku-ui/style.css'
import './styles/index.css'
import { Notifications } from 'roku-ui'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Notifications />
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
