/* _.. ___ .._ _ ... ._...___ .__.__ */

import type React from "react"
import { AppSidebar } from "./app-sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
