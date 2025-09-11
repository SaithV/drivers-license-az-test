import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadQuiz } from '../utils/loadQuiz'
import { playSfx } from '../utils/sfx'
import AnswerButton from '../components/AnswerButton'
import ProgressBar from '../components/ProgressBar'
import Timer from '../components/Timer'
import Spinner from '../components/Spinner'
import TopBar from '../components/TopBar'

const AUTO_ADVANCE_MS = 1200
const QUESTION_TIME = 20

export default function Quiz(){
  const { search } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const path = params.get('path')

  const [quiz,setQuiz] = useState(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)
  const [index,setIndex] = useState(()=> Number(localStorage.getItem('az_quiz_last_index')) || 0)
  const [answers,setAnswers] = useState([])
  const [selected,setSelected] = useState(null)
  const [locked,setLocked] = useState(false)
  const advanceTimeout = useRef(null)
  const timerKey = useRef(0)

  // Load quiz
  useEffect(()=>{
    let active = true
    setLoading(true); setError(null)
  loadQuiz(path)
      .then(data=>{ if(active){ setQuiz(data); setLoading(false); localStorage.setItem('az_quiz_last_path', path) } })
      .catch(e=>{ if(active){ setError(e.message); setLoading(false) } })
    return ()=>{ active=false }
  },[path])

  // Guard index overflow
  useEffect(()=>{
    if(quiz && index >= quiz.questions.length){
      finish()
    }
  },[index, quiz])

  const question = quiz?.questions[index]

  const selectAnswer = useCallback((optIndex)=>{
    if(locked) return
    const isCorrect = optIndex === question.correctIndex
    setSelected(optIndex)
    setLocked(true)
    const newAnswers = [...answers]
    newAnswers[index] = { 
      questionId: question.id, 
      questionText: question.text,
      options: question.options,
      selected: optIndex, 
      correctIndex: question.correctIndex, 
      isCorrect 
    }
    setAnswers(newAnswers)
    localStorage.setItem('az_quiz_last_index', String(index))
  // Sound effect
  playSfx(isCorrect ? 'correct' : 'fail')
    advanceTimeout.current = setTimeout(()=>{
      goNext()
    }, AUTO_ADVANCE_MS)
  },[locked, question, answers, index])

  const goNext = useCallback(()=>{
    clearTimeout(advanceTimeout.current)
    setSelected(null)
    setLocked(false)
    setIndex(i=> i+1)
    timerKey.current++
  },[])

  const handleTimeout = ()=>{
    if(locked) return
    selectAnswer(-1) // mark incorrect (no selection)
  }

  const finish = ()=>{
    const payload = { answers }
    localStorage.setItem('az_quiz_last_result', JSON.stringify({ answers, finishedAt: Date.now(), path }))
    localStorage.removeItem('az_quiz_last_index')
    navigate('/results', { state: payload })
  }

  useEffect(()=>{ return ()=> clearTimeout(advanceTimeout.current)},[])

  if(loading) return <Spinner label="Loading questions…" />
  if(error) return <div className="py-10 flex flex-col gap-4 items-center"> <p className="text-red-400">{error}</p> <button onClick={()=> window.location.reload()} className="px-4 py-2 rounded bg-indigo-600 text-white">Retry</button></div>
  if(!question) return null

  const imageEl = question.hasImage && question.imageName ? (
    <img
      src={resolveImage(question.imageName)}
      alt={question.text}
      className="w-full max-h-56 object-contain mx-auto mb-4 rounded-lg bg-gray-800/40 p-2"
      onError={(e)=>{ e.currentTarget.style.display='none' }}
    />
  ) : null

  return (
    <div className="flex flex-col flex-1">
      <TopBar title={quiz.title || 'Quiz'} />
      <ProgressBar current={index+1} total={quiz.questions.length} />
      <Timer seconds={QUESTION_TIME} onTimeout={handleTimeout} active={!locked} keySeed={timerKey.current} />
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold leading-snug">{question.text}</h2>
        </div>
        {imageEl}
        <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
          {question.options.map((opt,i)=>{
            const state = locked ? (i === question.correctIndex ? 'correct' : (i===selected ? 'wrong':'idle')) : 'idle'
            return (
              <AnswerButton
                key={i}
                index={i}
                onClick={()=>selectAnswer(i)}
                disabled={locked}
                state={state}
                isSelected={selected===i}
              >{opt}</AnswerButton>
            )
          })}
        </div>
        {locked && (
          <div className="text-center text-sm text-gray-400 animate-pulse">Advancing…</div>
        )}
        <div className="flex gap-2 mt-4">
          <button onClick={finish} className="flex-1 py-2 rounded-lg bg-gray-700/60 text-xs font-medium hover:bg-gray-700">End Quiz</button>
          <button onClick={goNext} disabled={!locked} className="flex-1 py-2 rounded-lg bg-indigo-600 text-xs font-semibold disabled:opacity-40">Skip / Next</button>
        </div>
      </div>
    </div>
  )
}

// Preload all potential images (works with Vite glob)
const imgModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,gif}', { eager: true, import: 'default' })

function resolveImage(name){
  // Try direct match first
  const tryCandidates = [name]
  // If Spanish file naming like ES1Q10.jpg, fall back to Test1Q10.jpg (English assets)
  const m = /^ES(\d)Q(\d+)\.(png|jpg|jpeg|svg|gif)$/i.exec(name || '')
  if(m){
    const test = m[1]
    const q = m[2]
    const ext = m[3]
    tryCandidates.push(`Test${test}Q${q}.${ext}`)
  }
  for(const candidate of tryCandidates){
    const found = Object.entries(imgModules).find(([k])=> k.endsWith('/'+candidate))
    if(found) return found[1]
  }
  // fallback generic path (may 404; UI hides broken img)
  return new URL(`../assets/${name}`, import.meta.url).href
}
