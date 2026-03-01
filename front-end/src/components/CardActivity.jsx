import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Icon } from '@iconify/react'
import { AuthContext } from '../context/AuthContext'
import JoinModal from './JoinModal'
import defaultCardImg from '../assets/cards_img/card_run.jpg'

const apiURL = import.meta.env.VITE_API_URL

const typeBadge = {
    '5k': 'bg-blue-100 text-blue-600',
    '10k': 'bg-green-100 text-green-600',
    'half': 'bg-purple-100 text-purple-600',
    'full': 'bg-red-100 text-red-600',
    'trail': 'bg-orange-100 text-orange-600',
}

const typeBadgeName = {
    '5k': '5K',
    '10k': '10K',
    'half': 'Half Marathon',
    'full': 'Full Marathon',
    'trail': 'Trail',
}

function formatDate(datetime) {
    if (!datetime) return '-'
    return new Date(datetime).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

function formatTime(datetime) {
    if (!datetime) return '-'
    return new Date(datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}


function CardActivity({ raceType }) {

    const { user } = useContext(AuthContext)

    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [joinTarget, setJoinTarget] = useState(null)

    useEffect(() => {
        axios.get(`${apiURL}activity/all`)
            .then(res => {
                setActivities(res.data.data || [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('Failed to load activities')
                setLoading(false)
            })
    }, [])

    if (loading) return (
        <div className="flex justify-center py-16 text-gray-400">
            <Icon icon="mdi:loading" className="text-4xl animate-spin" />
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center py-16 text-gray-400">
            <Icon icon="mdi:alert-circle-outline" className="text-5xl mb-2" />
            <p className="text-sm">{error}</p>
        </div>
    )

    const filtered = raceType === 'all'
        ? activities
        : activities.filter((a) => a.type_race_name === raceType)

    if (filtered.length === 0) return (
        <div className="flex flex-col items-center py-16 text-gray-300">
            <Icon icon="mdi:run-fast" className="text-6xl mb-2" />
            <p className="text-sm text-gray-400">No activities found.</p>
        </div>
    )

    return (
        <>

            {joinTarget && (
                <JoinModal
                    activity={joinTarget}
                    onClose={() => setJoinTarget(null)}
                    onSuccess={() => {
                        setJoinTarget(null)
                        Swal.fire({
                            title: 'Success!',
                            text: 'Joined successfully!',
                            icon: 'success',
                            confirmButtonColor: '#3b82f6',
                        })
                    }}
                />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((activity) => {
                    const imgSrc = activity.image
                        ? `${apiURL.replace('/api/', '')}/uploads/${activity.image}`
                        : defaultCardImg

                    const raceLabel = activity.type_race_name || activity.type_race || '-'

                    return (
                        <div
                            key={activity.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                        >
                            <div className="relative overflow-hidden bg-gray-100 h-40">
                                {imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt={activity.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Icon icon="mdi:image-off-outline" className="text-4xl" />
                                    </div>
                                )}
                                <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${typeBadge[activity.type_race_name] ?? 'bg-gray-100 text-gray-500'}`}>
                                    {typeBadgeName[raceLabel]}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col gap-2">
                                <h2 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
                                    {activity.title}
                                </h2>

                                <div className="flex flex-col gap-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Icon icon="mdi:map-marker-outline" className="text-blue-400 shrink-0" />
                                        {activity.location || '-'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icon icon="mdi:calendar-outline" className="text-blue-400 shrink-0" />
                                        {formatDate(activity.datetime)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icon icon="mdi:clock-outline" className="text-blue-400 shrink-0" />
                                        {formatTime(activity.datetime)}
                                    </span>
                                </div>

                                {user && (
                                    (user.id !== activity.user_id) ?
                                        <button onClick={() => setJoinTarget(activity)}
                                            className="mt-1 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-full cursor-pointer transition"
                                        >Join Run</button>
                                        : (
                                            <span className="mt-1 w-full py-2 bg-gray-300 text-white text-xs font-semibold rounded-full text-center">
                                                Your Activity
                                            </span>
                                        )
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default CardActivity