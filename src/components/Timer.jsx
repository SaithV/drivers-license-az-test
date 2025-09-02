import { useEffect, useRef, useState } from 'react'

export default function Timer({ seconds=20, onTimeout, active, keySeed }) {
  const [remaining, setRemaining] = useState(seconds)
  const raf = useRef(null)
  const started = useRef(null)
  const durationMs = seconds * 1000

  useEffect(()=>{
    if(!active) return
    started.current = performance.now()
    const tick = (t)=>{
      const elapsed = t - started.current
      const left = Math.max(0, durationMs - elapsed)
      setRemaining(Math.ceil(left/1000))
      if(left <= 0){
        onTimeout?.()
        return
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return ()=> cancelAnimationFrame(raf.current)
  },[seconds, active, keySeed])

  const pct = (remaining/seconds)*100

  return (
    <div className="mb-4" aria-label="Timer" role="timer">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1">
        <span>Time</span>
        <span>{remaining}s</span>
      </div>
      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 transition-all duration-1000 ease-linear" style={{ width: pct+'%' }} />
      </div>
    </div>
  )
}
