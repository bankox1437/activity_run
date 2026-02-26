import React from 'react'
import imgCard from '../assets/cards_img/card_run.jpg'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const activities = [
    { id: 1, title: 'City Night Run 2026', location: 'Bangkok', distance: 'Half Marathon', type: 'half', date: '10 Jan 2026', image: imgCard, spots: 12 },
    { id: 2, title: 'Sunday Morning 5K', location: 'Bangkok', distance: '5 km', type: '5km', date: '15 Jan 2026', image: imgCard, spots: 5 },
    { id: 3, title: 'Park Run Challenge', location: 'Chiang Mai', distance: '5 km', type: '5km', date: '20 Jan 2026', image: imgCard, spots: 20 },
    { id: 4, title: 'Doi Trail Adventure', location: 'Chiang Rai', distance: 'Trail', type: 'trail', date: '28 Jan 2026', image: imgCard, spots: 8 },
    { id: 5, title: 'BKK 10K Classic', location: 'Bangkok', distance: '10 km', type: '10km', date: '05 Feb 2026', image: imgCard, spots: 30 },
    { id: 6, title: 'Midnight Half Marathon', location: 'Phuket', distance: 'Half Marathon', type: 'half', date: '14 Feb 2026', image: imgCard, spots: 3 },
]

const distanceBadge = {
    'Full Marathon': 'bg-red-100 text-red-600',
    'Half Marathon': 'bg-purple-100 text-purple-600',
    '5 km': 'bg-blue-100   text-blue-600',
    '10 km': 'bg-green-100  text-green-600',
    'Trail': 'bg-orange-100 text-orange-600',
}

function CardActivity({ raceType }) {
    const [showJoinEvent,setShowJoinEvent] = useState(false);
    const navigate = useNavigate()
    const filtered = raceType === 'all' ? activities : activities.filter((a) => a.type === raceType)

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center py-16 text-gray-300">
                <Icon icon="mdi:run-fast" className="text-6xl mb-2" />
                <p className="text-sm text-gray-400">No activities found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((activity) => (
                <div
                    key={activity.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                        />
                        {/* Distance badge */}
                        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${distanceBadge[activity.distance] ?? 'bg-gray-100 text-gray-500'}`}>
                            {activity.distance}
                        </span>
                        {/* Spots left */}
                        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                            {activity.spots} spots left
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2">
                        <h2 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
                            {activity.title}
                        </h2>

                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Icon icon="mdi:map-marker-outline" className="text-blue-400 shrink-0" />
                                {activity.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Icon icon="mdi:calendar-outline" className="text-blue-400 shrink-0" />
                                {activity.date}
                            </span>
                        </div>
                        {showJoinEvent && (
                            <button
                                onClick={() => navigate(`/activity/${activity.id}`)}
                                className="mt-1 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-full transition"
                            >Join Run</button>
                        )}
                        
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CardActivity