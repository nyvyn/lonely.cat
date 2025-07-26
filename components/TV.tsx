import React from 'react'
import Cat from './Cat'

export default function TV() {
    return (
        <div className="relative w-screen h-screen" data-testid="tv">
            {/* Screen content behind TV */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden z-10"
            >
                <Cat/>

                {/* Static overlay for CRT effect */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10 w-4/5 h-4/5"
                    style={{
                        background: `
                          repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(255, 255, 255, 0.1) 2px,
                            rgba(255, 255, 255, 0.1) 4px
                          )
                        `
                    }}
                />
            </div>

            {/* TV frame on top */}
            <div
                className="absolute top-0 left-0 w-screen h-screen bg-no-repeat bg-center bg-contain z-20"
                style={{
                    backgroundImage: 'url(/retro-tv.png)'
                }}
            />
        </div>
    )
}
