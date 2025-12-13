import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }: { message: string; type?: "info" | "success" | "error"; onClose?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-zinc-800";

  return (
    <div role="status" aria-live="polite" className={`fixed bottom-6 right-6 z-50 rounded-md px-4 py-2 text-white ${bg}`}>
      {message}
    </div>
  );
}
