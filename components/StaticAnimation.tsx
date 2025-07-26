import React from 'react'

export default function StaticAnimation() {
  return (
    <div
      aria-hidden="true"
      data-testid="static"
      className="absolute inset-0 pointer-events-none bg-cover motion-safe:animate-[staticNoise_1s_steps(10)_infinite]"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdmJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC44Jy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzIwMCcgaGVpZ2h0PScyMDAnIGZpbHRlcj0ndXJsKCNmKScgZmlsbD0nI2ZmZicvPjwvc3ZnPg==')",
      }}
    />
  )
}
