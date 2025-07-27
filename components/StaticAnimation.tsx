import React from 'react'

export default function StaticAnimation() {
    return (
        <div
            aria-hidden="true"
            data-testid="static"
            className="absolute top-20 bottom-20 left-40 right-96 pointer-events-none opacity-70"
            style={{
                backgroundImage: 'url(/static.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        />
    )
}
