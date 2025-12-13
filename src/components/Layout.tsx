"use client";
import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header onOpenUpload={() => { /* placeholder */ }} />
      <div className="flex">
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
