import React from 'react'

export default function RetroScreen() {
    return (
        <div
            className="absolute top-0 left-0 w-screen h-screen bg-no-repeat bg-center bg-contain"
            data-testid="tv"
            style={{
                backgroundImage: 'url(/retro-tv.png)'
            }}
        />
    )
}
