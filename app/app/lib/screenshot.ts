'use client'
import html2canvas from 'html2canvas'

export async function saveScreenAsImage(rootSelector = '#app-screen') {
  const el = document.querySelector(rootSelector) as HTMLElement | null
  if (!el) return
  const canvas = await html2canvas(el, {
    backgroundColor: '#ffffff',
    useCORS: true,
    scale: window.devicePixelRatio > 1 ? 2 : 1,
  })
  const link = document.createElement('a')
  link.download = 'ox-quiz.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}