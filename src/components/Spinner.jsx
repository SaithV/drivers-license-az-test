export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 animate-pulse">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <span className="text-sm text-gray-400" role="status">{label}</span>
    </div>
  )
}
