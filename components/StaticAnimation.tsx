import React, { useEffect, useRef } from 'react'

export default function StaticAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const generateStatic = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value     // red
        data[i + 1] = value // green
        data[i + 2] = value // blue
        data[i + 3] = Math.random() * 50 // alpha for transparency
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const interval = setInterval(generateStatic, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="static"
      className="absolute inset-0 pointer-events-none opacity-20"
      style={{ zIndex: 1 }}
    />
  )
}
