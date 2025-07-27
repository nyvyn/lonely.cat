'use client'
import CatAnimation from "@/components/CatAnimation";
import StaticAnimation from "@/components/StaticAnimation";
import { useEffect, useState } from 'react'
import RetroScreen from '../components/RetroScreen'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="w-screen h-screen overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-screen text-lg">Loading…</div>
      ) : (
          <div className="relative w-screen h-screen">
            <StaticAnimation/>
            <RetroScreen/>
            <CatAnimation/>
          </div>
      )}
    </main>
  )
}
