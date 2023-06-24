'use client'
import { Dashboard } from '../../../components/pages/dashboard/Dashboard'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return <Dashboard>{ children }</Dashboard>
}
