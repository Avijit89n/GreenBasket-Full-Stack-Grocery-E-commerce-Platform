import React from 'react'

export default function Loader2({ height = 10, width = 10 }) {
    return (
        <div className={`h-${height} w-${width} border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin`}>
        </div>

    )
}
