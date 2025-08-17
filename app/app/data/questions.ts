export type Question = {
  id: 1|2|3|4|5
  image: string
  correctIndex: 1|2|3|4|5
  answerImageO: string
  answerImageX: string
}

export const ALL_QUESTIONS: Question[] = [
  { id: 1, image: '/assets/quiz-1.png', correctIndex: 4, answerImageO: '/assets/quiz-1-o.png', answerImageX: '/assets/quiz-1-x.png' },
  { id: 2, image: '/assets/quiz-2.png', correctIndex: 3, answerImageO: '/assets/quiz-2-o.png', answerImageX: '/assets/quiz-2-x.png' },
  { id: 3, image: '/assets/quiz-3.png', correctIndex: 3, answerImageO: '/assets/quiz-3-o.png', answerImageX: '/assets/quiz-3-x.png' },
  { id: 4, image: '/assets/quiz-4.png', correctIndex: 3, answerImageO: '/assets/quiz-4-o.png', answerImageX: '/assets/quiz-4-x.png' },
  { id: 5, image: '/assets/quiz-5.png', correctIndex: 2, answerImageO: '/assets/quiz-5-o.png', answerImageX: '/assets/quiz-5-x.png' },
]
