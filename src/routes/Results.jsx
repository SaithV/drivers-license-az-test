import { useLocation, useNavigate } from 'react-router-dom'
import { computeScore } from '../utils/score'
import TopBar from '../components/TopBar'

export default function Results(){
  const { state } = useLocation()
  const navigate = useNavigate()
  const answers = state?.answers || []
  const { correct, total, pct, message } = computeScore(answers)

  const replay = ()=>{
    const last = JSON.parse(localStorage.getItem('az_quiz_last_result')||'null')
    if(last?.path){
      navigate(`/quiz?path=${encodeURIComponent(last.path)}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Results" />
      <div className="py-4 flex flex-col gap-4">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">{correct} / {total}</h2>
          <p className="text-sm text-gray-400 mt-1">{pct}% — {message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={replay} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold">Play Again</button>
          <button onClick={()=>navigate('/')} className="flex-1 py-3 rounded-xl bg-gray-700/70 text-white font-semibold">Home</button>
        </div>
        <div className="mt-4 space-y-3 overflow-y-auto max-h-[50vh] pr-1">
          {answers.map((a,i)=> {
            const yourOptText = a.selected>=0 ? a.options?.[a.selected] : '—'
            const correctOptText = a.options?.[a.correctIndex]
            return (
              <div key={i} className={`p-3 rounded-lg text-xs flex flex-col gap-1 border ${a.isCorrect? 'bg-gray-800/40 border-green-500/30':'bg-gray-800/70 border-red-500/30'}`}>
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold">Q{i+1}</span>
                  <span className={a.isCorrect? 'text-green-400':'text-red-400'}>{a.isCorrect?'Correct':'Incorrect'}</span>
                </div>
                <p className="text-[11px] leading-snug text-gray-200 font-medium">{a.questionText}</p>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {!a.isCorrect && (
                    <div className="text-[11px] flex gap-1"><span className="text-gray-400">Your:</span><span className="text-red-300 break-words">{formatOption(a.selected)} {yourOptText && <>– {yourOptText}</>}</span></div>
                  )}
                  <div className="text-[11px] flex gap-1"><span className="text-gray-400">Answer:</span><span className="text-green-300 break-words">{formatOption(a.correctIndex)} – {correctOptText}</span></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatOption(i){
  if(i === -1 || i == null) return '—'
  return String.fromCharCode(65 + i)
}
