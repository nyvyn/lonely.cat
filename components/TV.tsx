import React from 'react'
import StaticAnimation from './StaticAnimation'
import Cat from './Cat'

export default function TV() {
  return (
    <div
      className="relative mx-auto w-[90vw] max-w-[300px] h-[260px]"
      data-testid="tv"
    >
      <div
        className="absolute top-0 left-1/2 w-full max-w-[300px] h-[220px] -translate-x-1/2 bg-zinc-800 border-[8px] border-[#654321] rounded-lg overflow-hidden"
      >
        <StaticAnimation />
      </div>
      <Cat />
    </div>
  )
}
