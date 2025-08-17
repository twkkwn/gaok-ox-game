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

  // ✅ dataURL 대신 Blob + Object URL 사용
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  )
  if (!blob) return

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'success.png'
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()

  // 정리
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}
