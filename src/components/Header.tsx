"use client";
import Link from "next/link";

export default function Header({ onOpenUpload }: { onOpenUpload?: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-lg font-semibold text-zinc-900">OCR SaaS</Link>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onOpenUpload && onOpenUpload()} className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">Upload</button>
        <Link href="/profile" className="rounded border border-zinc-200 px-3 py-1 text-sm text-zinc-700">Profile</Link>
      </div>
    </header>
  );
}
