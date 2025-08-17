'use client'
import { useEffect, useMemo, useState } from 'react'
import Screen from './components/Screen'
import { ALL_QUESTIONS } from './data/questions'
import { saveScreenAsImage } from './lib/screenshot'

// 퍼센트 기반 Hotspot 좌표(1152×2048 기준) — iOS/Android 동일 결과
const HS = {
  start: { left: 32, top: 46, width: 36, height: 10 },
  options: [
    { left: 19, width: 62, top: 46, height: 5 },
    { left: 19, width: 62, top: 52, height: 5 },
    { left: 19, width: 62, top: 58, height: 6 },
    { left: 19, width: 62, top: 65, height: 5 },
    { left: 19, width: 62, top: 71, height: 5 },
  ],
  next:   { left: 25, top: 70, width: 50, height: 5 },
  successSave: { left: 15,  top: 58, width: 71, height: 4 },
  successHome: { left: 15,  top: 64, width: 71, height: 4 },
  failureHome: { left: 9,  top: 66, width: 82, height: 7 },
} as const

type Rect = {left:number; top:number; width:number; height:number}
function pct({ left, top, width, height }: Rect) {
  return { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` } as React.CSSProperties
}

// 접근성/중복탭 방지 유틸
function useTapLock() {
  const [locked, setLocked] = useState(false)
  const tap = (fn: () => void) => () => {
    if (locked) return
    setLocked(true)
    try { fn(); if (navigator?.vibrate) navigator.vibrate(10) } finally {
      setTimeout(() => setLocked(false), 250)
    }
  }
  return tap
}

// 키보드 진입 대비
function withKeyboard(onActivate: () => void) {
  return (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate() }
  }
}

type Mode = 'main' | 'quiz' | 'answer' | 'success' | 'failure'

type Picked = { id: 1|2|3|4|5; correctIndex: 1|2|3|4|5; image: string; answerImageO: string; answerImageX: string }

export default function Page() {
  const [mode, setMode] = useState<Mode>('main')
  const [picked, setPicked] = useState<Picked[]>([])
  const [i, setI] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const tap = useTapLock()

  useEffect(() => {
    const imgs = [ '/assets/main.png', '/assets/success.png', '/assets/failure.png', ...ALL_QUESTIONS.flatMap(q => [q.image, q.answerImageO, q.answerImageX]) ]
    imgs.forEach(src => { const im = new Image(); im.src = src })
  }, [])

  const newRound = tap(() => {
    const others = ALL_QUESTIONS.slice(1)
    for (let k = others.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [others[k], others[r]] = [others[r], others[k]] }
    const selected = [ALL_QUESTIONS[0], ...others.slice(0, 2)] as Picked[]
    setPicked(selected)
    setI(0)
    setScore(0)
    setIsCorrect(null)
    setMode('quiz')
  })

  if (mode === 'main') {
    return (
      <Screen image="/assets/main.png" hotspots={
        <button
          aria-label="게임 시작"
          className="hotspot__btn"
          style={pct(HS.start)}
          onClick={newRound}
          onKeyDown={withKeyboard(newRound)}
        />
      } />
    )
  }

  if (mode === 'quiz') {
    const q = picked[i]
    return (
      <Screen image={q.image} hotspots={
        <div>
          {HS.options.map((rect, idx) => (
            <button
              key={idx}
              aria-label={`보기 ${idx+1}`}
              className="hotspot__btn"
              style={pct(rect)}
              onClick={tap(() => {
                const ok = (idx + 1) === q.correctIndex
                setIsCorrect(ok)
                setScore(s => s + (ok ? 1 : 0))
                setMode('answer')
              })}
              onKeyDown={withKeyboard(() => {
                const ok = (idx + 1) === q.correctIndex
                setIsCorrect(ok)
                setScore(s => s + (ok ? 1 : 0))
                setMode('answer')
              })}
            />
          ))}
        </div>
      } />
    )
  }

  if (mode === 'answer') {
    const q = picked[i]
    const img = isCorrect ? q.answerImageO : q.answerImageX
    const goNext = tap(() => {
      if (i < 2) { setI(i + 1); setMode('quiz') }
      else { setMode(score === 3 ? 'success' : 'failure') }
    })

    return (
      <Screen image={img} hotspots={
        <button
          aria-label="다음 문제"
          className="hotspot__btn"
          style={pct(HS.next)}
          onClick={goNext}
          onKeyDown={withKeyboard(goNext)}
        />
      } />
    )
  }

  if (mode === 'success') {
    const doSave = tap(() => saveScreenAsImage())
    return (
      <Screen image="/assets/success.png" hotspots={
        <>
          <button
            aria-label="내 앨범으로 저장"
            className="hotspot__btn"
            style={pct(HS.successSave)}
            onClick={doSave}
            onKeyDown={withKeyboard(doSave)}
          />
          <button
            aria-label="메인으로 돌아가기"
            className="hotspot__btn"
            style={pct(HS.successHome)}
            onClick={tap(() => setMode('main'))}
            onKeyDown={withKeyboard(() => setMode('main'))}
          />
        </>
      } />
    )
  }

  // 실패
  const goHome = tap(() => setMode('main'))
  return (
    <Screen image="/assets/failure.png" hotspots={
      <button
        aria-label="메인으로 돌아가기"
        className="hotspot__btn"
        style={pct(HS.failureHome)}
        onClick={goHome}
        onKeyDown={withKeyboard(goHome)}
      />
    } />
  )
}