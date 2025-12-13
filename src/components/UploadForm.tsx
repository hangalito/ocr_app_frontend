"use client";
import { useState } from "react";
import { uploadFiles, saveToHistory } from "../lib/api";
import { FileRecord } from "../types";

export default function UploadForm({ onUploadSuccess, multiple = false }: { onUploadSuccess?: (files: FileRecord[]) => void; multiple?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const fs = Array.from(e.target.files || []);
    setFiles(fs);
  }

  async function onSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (files.length === 0) return setMessage("Please select a file first.");
    setUploading(true);
    try {
      const results = await uploadFiles(files);
      await saveToHistory(results);
      setFiles([]);
      onUploadSuccess && onUploadSuccess(results);
      setMessage(`Uploaded ${results.length} file(s) successfully`);
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-md border border-zinc-200 bg-white p-6">
      <label className="mb-2 block text-sm font-medium text-zinc-700">Upload file</label>
      <div className="flex items-center gap-3">
        <input id="file-input" type="file" onChange={onSelect} multiple={multiple} className="hidden" />
        <label htmlFor="file-input" className="cursor-pointer rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Select file</label>
        <button type="button" onClick={() => (document.getElementById("file-input") as HTMLInputElement | null)?.click()} className="rounded border border-zinc-200 px-3 py-2 text-sm">Browse</button>
        <div className="ml-auto text-sm text-zinc-600">{files.length} selected</div>
      </div>

      {files.length > 0 && (
        <div className="mt-3">
          <ul className="space-y-1 text-sm">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{f.name}</span>
                <span className="text-xs text-zinc-500">{Math.round(f.size / 1024)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button disabled={isUploading} type="submit" className="rounded bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isUploading ? "Uploading..." : "Upload"}</button>
        <button type="button" onClick={() => setFiles([])} className="rounded border border-zinc-200 px-3 py-2 text-sm">Clear</button>
        {message && <div className="ml-auto text-sm text-zinc-700">{message}</div>}
      </div>
    </form>
  );
}
