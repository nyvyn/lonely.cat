'use client'
import { useEffect, useState } from 'react'
import TV from '../components/TV'

export default function RetroTVPage() {
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
        <TV />
      )}
    </main>
  )
}
