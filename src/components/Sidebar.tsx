"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const path = usePathname();

  function Item({ href, label }: { href: string; label: string }) {
    const active = path === href;
    return (
      <Link href={href} className={`block rounded px-3 py-2 text-sm ${active ? "bg-indigo-50 text-indigo-700" : "text-zinc-700 hover:bg-zinc-50"}`} onClick={() => onClose && onClose()} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  }

  return (
    <nav className="w-56 border-r border-zinc-100 bg-white p-4">
      <ul className="space-y-1">
        <li><Item href="/dashboard" label="Dashboard" /></li>
        <li><Item href="/history" label="History" /></li>
        <li><Item href="/profile" label="Profile" /></li>
      </ul>
    </nav>
  );
}
