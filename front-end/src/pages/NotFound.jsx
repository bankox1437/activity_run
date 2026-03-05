import React from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
                <h1 className="text-9xl font-black text-gray-100 select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon icon="tabler:error-404" className="text-8xl text-blue-500" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-primary">Page Not Found</h2>

            <button
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
            >
                <Icon icon="mdi:home-outline" className="text-xl" />
                Back to Home
            </button>

        </div>
    )
}

export default NotFound
