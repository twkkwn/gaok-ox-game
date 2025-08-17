'use client'
import { JSX, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{ image: string; hotspots?: JSX.Element; id?: string }>

export default function Screen({ image, hotspots, id = 'app-screen' }: Props) {
  return (
    <div className="app-shell">
      <div id={id} className="screen-frame">
        {/* 드래그/롱탭 이미지 저장 방지 및 터치 안정화 */}
        <img
          className="screen-img"
          src={image}
          alt="screen"
          width={1152}
          height={2048}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        {/* 투명 클릭 영역 */}
        <div className="hotspot" aria-hidden>{hotspots}</div>
      </div>
    </div>
  )
}