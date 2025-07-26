import React from 'react'

export default function Cat() {
  return (
    <div className="absolute bottom-0 right-12" role="img" aria-label="cat" data-testid="cat">
      {/* Cat head - profile view looking away */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[40px] h-[35px] bg-black rounded-full">
        {/* Left ear (back ear, further apart) */}
        <div className="absolute -top-2 left-1 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-black"></div>
        {/* Right ear (front ear, further apart) */}
        <div className="absolute -top-2 right-1 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-black"></div>
      </div>
      
      {/* Cat body */}
      <div className="w-[50px] h-[80px] bg-black rounded-[30%_30%_15%_15%]">
        {/* Tail - properly connected to body */}
        <div
          data-testid="tail"
          className="absolute bottom-[20px] right-[-2px] w-[8px] h-[50px] bg-black rounded-[20px] origin-bottom motion-safe:animate-[wag_2s_ease-in-out_infinite]"
        />
      </div>
    </div>
  )
}
