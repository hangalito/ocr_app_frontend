"use client";
import { useState } from "react";
import { extractTextFromInvoice } from "../lib/api";

export default function UploadForm({ onUploadSuccess, multiple = false }: { onUploadSuccess?: (result: ExtractResult) => void; multiple?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  }

  async function onSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!file) return setMessage("Please select a file first.");
    setUploading(true);
    try {
      const result = await extractTextFromInvoice(file);
      onUploadSuccess && onUploadSuccess(result);
      setMessage("File uploaded and processed successfully.");
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
        <input id="file-input" type="file" onChange={onSelect} className="hidden" />
        <label htmlFor="file-input" className="cursor-pointer rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Select file</label>
        <button type="button" onClick={() => (document.getElementById("file-input") as HTMLInputElement | null)?.click()} className="rounded border border-zinc-200 px-3 py-2 text-sm">Browse</button>
        <div className="ml-auto text-sm text-zinc-600">{file ? file.name : "No file selected"}</div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button disabled={isUploading} type="submit" className="rounded bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isUploading ? "Uploading..." : "Upload"}</button>
        <button type="button" onClick={() => setFile(null)} className="rounded border border-zinc-200 px-3 py-2 text-sm">Clear</button>
        {message && <div className="ml-auto text-sm text-zinc-700">{message}</div>}
      </div>
    </form>
  );
}
