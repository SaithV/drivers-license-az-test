// Eagerly import quizzes in both English and Spanish
const quizModules = {
  ...import.meta.glob('../data/en/az/car/*.json', { eager: true, import: 'default' }),
  ...import.meta.glob('../data/es/az/car/*.json', { eager: true, import: 'default' }),
}

// path is a simple key like 'test1_en'
export async function loadQuiz(path){
  if(!path) throw new Error('Missing quiz path')
  const entry = Object.entries(quizModules).find(([k])=> k.includes(path + '.json'))
  if(!entry) throw new Error('Quiz not found')
  const data = entry[1]
  if(!data.questions || !Array.isArray(data.questions)) throw new Error('Malformed quiz JSON')
  data.questions = data.questions.filter(q=> q && typeof q.text === 'string' && Array.isArray(q.options))
  return data
}
