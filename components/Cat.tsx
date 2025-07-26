import React from 'react'

export default function Cat() {
  return (
    <div
      className="absolute bottom-0 left-1/2 w-[80px] h-[60px] -translate-x-1/2 bg-black rounded-[40%_40%_20%_20%]"
      role="img"
      aria-label="cat"
      data-testid="cat"
    >
      <div
        data-testid="tail"
        className="absolute bottom-[10px] left-[65px] w-[10px] h-[40px] bg-black rounded-[20px] origin-top motion-safe:animate-[wag_1s_ease-in-out_infinite]"
      />
    </div>
  )
}
