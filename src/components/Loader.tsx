export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" | number }) {
  const s = typeof size === "number" ? size : size === "sm" ? 12 : size === "lg" ? 28 : 18;
  return (
    <div role="status" aria-live="polite" className="inline-block">
      <svg
        className="animate-spin"
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
e
