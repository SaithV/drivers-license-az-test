// Simple sound effects helper. It will use bundled audio files if present,
// otherwise it falls back to a short WebAudio beep so UX still has feedback.

// Eagerly import audio assets so they’re available by name (e.g., 'correct.mp3')
const soundModules = import.meta.glob('../assets/**/*.{mp3,wav,ogg}', { eager: true, import: 'default' })

function resolveSound(name){
  if(!name) return null
  const found = Object.entries(soundModules).find(([k])=> k.endsWith('/'+name))
  return found ? found[1] : null
}

let audioCtx = null
function getCtx(){
  if(typeof window === 'undefined') return null
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)() }catch{ /* ignore */ }
  }
  return audioCtx
}

function beep(freq=440, durationMs=150, volume=0.2){
  const ctx = getCtx()
  if(!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = volume
  osc.connect(gain)
  gain.connect(ctx.destination)
  const now = ctx.currentTime
  osc.start(now)
  osc.stop(now + durationMs/1000)
}

export function playSfx(kind){
  const name = ({
    correct: 'correct.mp3',
    fail: 'fail.mp3',
    success: 'success.mp3',
    wrong: 'wrong.mp3',
  })[kind]
  const url = resolveSound(name)
  if(url){
    try {
      const a = new Audio(url)
      a.volume = 0.6
      // Non-blocking; play() returns a promise in modern browsers
      a.play()?.catch(()=>{ /* ignore blocked autoplay */ })
      return
    } catch {
      // fall through to beep
    }
  }
  // Fallback beeps (different frequencies per kind)
  const freq = ({ correct: 880, fail: 220, success: 1200, wrong: 200 })[kind] || 440
  const dur = kind === 'success' ? 220 : 150
  beep(freq, dur)
}
