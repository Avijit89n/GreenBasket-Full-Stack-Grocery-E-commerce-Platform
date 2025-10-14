import React from 'react'

function Loader3() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-500">
            <div className="h-14 w-14 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading...</p>
        </div>
    )
}

export default Loader3
