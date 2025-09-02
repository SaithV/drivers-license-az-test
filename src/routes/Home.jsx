import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const tests = [
  { label: 'Test 1 (EN)', path: 'test1_en' },
  { label: 'Test 2 (EN)', path: 'test2_en' },
  { label: 'Test 3 (EN)', path: 'test3_en' },
]

export default function Home(){
  const navigate = useNavigate()
  const [selected, setSelected] = useState(tests[0].path)
  const [resumeInfo, setResumeInfo] = useState(null)

  useEffect(()=>{
    const lastPath = localStorage.getItem('az_quiz_last_path')
    const lastIndex = localStorage.getItem('az_quiz_last_index')
    if(lastPath && lastIndex){
      setResumeInfo({ lastPath, lastIndex: Number(lastIndex) })
    }
  },[])

  const start = ()=>{
    navigate(`/quiz?path=${encodeURIComponent(selected)}`)
  }
  const resume = ()=>{
    if(resumeInfo) navigate(`/quiz?path=${encodeURIComponent(resumeInfo.lastPath)}`)
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AZ Driver Practice</h1>
        <p className="text-sm text-gray-400 mt-2">Kahoot-style practice quizzes. One question at a time. Immediate feedback.</p>
      </header>
      <div className="space-y-4">
        <label className="block text-xs uppercase font-semibold tracking-wide text-gray-400">Select a Test</label>
        <div className="grid grid-cols-1 gap-3">
          {tests.map(t=> (
            <button
              key={t.path}
              onClick={()=>setSelected(t.path)}
              className={`px-4 py-4 rounded-xl text-left font-medium transition-all border ${selected===t.path ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-gray-800/60 hover:bg-gray-800 border-gray-700 text-gray-200'}`}
              aria-pressed={selected===t.path}
            >{t.label}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={start} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold shadow-md hover:opacity-95 active:scale-[.98]">Start Quiz</button>
        {resumeInfo && (
          <button onClick={resume} className="w-full py-3 rounded-xl bg-gray-700/70 hover:bg-gray-700 text-sm text-white">Resume Last Quiz (Q {resumeInfo.lastIndex+1})</button>
        )}
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed">Progress and last score are stored locally only. Reloading keeps your place. Built for mobile first—rotate for landscape if preferred.</p>
    </div>
  )
}
