import { useNavigate } from 'react-router-dom'

export default function TopBar({ title }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-2 py-3 mb-2">
      <button
        onClick={()=>navigate(-1)}
        className="px-3 py-2 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 text-xs font-medium"
        aria-label="Go Back"
      >←</button>
      <h1 className="text-lg font-bold tracking-wide flex-1 text-center">
        {title}
      </h1>
      <button
        onClick={()=>navigate('/')}
        className="px-3 py-2 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 text-xs font-medium"
        aria-label="Home"
      >🏠</button>
    </div>
  )
}
