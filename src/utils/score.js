export function computeScore(answers){
  let correct = 0
  for(const a of answers){
    if(a?.isCorrect) correct++
  }
  const total = answers.length
  const pct = total ? Math.round((correct/total)*100) : 0
  return { correct, total, pct, message: feedbackMessage(pct) }
}

function feedbackMessage(pct){
  if(pct === 100) return 'Perfect!'
  if(pct >= 90) return 'Excellent!'
  if(pct >= 80) return 'Great job!'
  if(pct >= 70) return 'Good effort!'
  if(pct >= 60) return 'Keep practicing!'
  return 'Study more and try again!'
}
