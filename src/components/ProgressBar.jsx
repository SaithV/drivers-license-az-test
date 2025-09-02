export default function ProgressBar({ current, total }) {
  const pct = total ? (current/total)*100 : 0
  return (
    <div className="w-full mb-4">
      <div className="text-xs font-semibold mb-1 tracking-wide text-gray-400">Question {current} / {total}</div>
      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-300" style={{width: pct+'%'}} />
      </div>
    </div>
  )
}
