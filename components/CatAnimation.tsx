import React, { useState, useEffect } from 'react'

export default function CatAnimation() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const totalFrames = 9

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames)
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const row = Math.floor(currentFrame / 3)
  const col = currentFrame % 3
  const spriteX = -col * 200
  const spriteY = -row * 240

  return (
    <div className="absolute bottom-4 right-[-20]" role="img" aria-label="cat" data-testid="cat">
      <div 
        className="w-[200px] h-[240px] bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: 'url(/cat-sprites.png)',
          backgroundPosition: `${spriteX}px ${spriteY}px`,
          backgroundSize: '600px 720px'
        }}
        data-testid="cat-sprite"
      />
    </div>
  )
}
