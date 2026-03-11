import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllActivities, fetchJoinedMap, updateJoinedMap } from '../store/slices/activitySlice'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Icon } from '@iconify/react'
import JoinModal from './JoinModal'
import defaultCardImg from '../assets/cards_img/card_run.jpg'

const apiURL = import.meta.env.VITE_API_URL
const PAGE_SIZE = 8

function formatDate(datetime) {
    if (!datetime) return '-'
    return new Date(datetime).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        timeZone: 'Asia/Bangkok',
    })
}

function formatTime(datetime) {
    if (!datetime) return '-'
    return new Date(datetime).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Bangkok',
    })
}

function CardActivity({ raceType, selectedDate }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { homeActivities, homeLoading, homeError, joinedMap } = useSelector((state) => state.activity)

    const [joinTarget, setJoinTarget] = useState(null)
    const [descriptionTarget, setDescriptionTarget] = useState(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        dispatch(fetchAllActivities())
        if (user) dispatch(fetchJoinedMap())
    }, [dispatch, user])

    // Reset to page 1 when filters change
    useEffect(() => { setPage(1) }, [raceType, selectedDate])

    if (homeLoading) return (
        <div className="flex justify-center py-16 text-gray-400">
            <Icon icon="mdi:loading" className="text-4xl animate-spin" />
        </div>
    )

    if (homeError) return (
        <div className="flex flex-col items-center py-16 text-gray-400">
            <Icon icon="mdi:alert-circle-outline" className="text-5xl mb-2" />
            <p className="text-sm">{homeError}</p>
        </div>
    )

    const filtered = homeActivities.filter((a) => {
        const matchType = raceType === 'all' || a.type_race_name === raceType
        const activityDate = a.datetime ? new Date(a.datetime).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }) : ''
        const matchDate = !selectedDate || activityDate === selectedDate
        return matchType && matchDate
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    if (filtered.length === 0) return (
        <div className="flex flex-col items-center py-16 text-gray-300">
            <p className="text-sm text-gray-400">No activities found</p>
        </div>
    )

    const handleJoinSuccess = () => {
        setJoinTarget(null)
        dispatch(fetchJoinedMap())
        Swal.fire({
            title: 'Success!',
            text: 'Joined successfully!',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
        })
    }

    return (
        <>
            {joinTarget && (
                <JoinModal
                    activity={joinTarget}
                    onClose={() => setJoinTarget(null)}
                    onSuccess={handleJoinSuccess}
                />
            )}

            {descriptionTarget && (
                <DescriptionModal
                    activity={descriptionTarget}
                    onClose={() => setDescriptionTarget(null)}
                />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paged.map((activity) => {
                    return (
                        <div
                            key={activity.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                        >
                            <div className="relative overflow-hidden bg-gray-100 h-40">
                                <img
                                    src={activity.image || defaultCardImg}
                                    alt={activity.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 text-white">
                                    {activity.type_race_name || '-'}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                                    <h2 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
                                        {activity.title}
                                    </h2>
                                    <button onClick={() => setDescriptionTarget(activity)}
                                        title="View description"
                                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-500 transition cursor-pointer">
                                        <Icon icon="mdi:text-box-outline" className="text-sm" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1 text-xs text-gray-500">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-start gap-1 line-clamp-3">
                                            <Icon icon="mdi:map-marker-outline" className="shrink-0 mt-0.5 text-blue-400" />
                                            {activity.location || '-'}
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Icon icon="mdi:calendar-outline" className="text-blue-400 shrink-0" />
                                        {formatDate(activity.datetime)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icon icon="mdi:clock-outline" className="text-blue-400 shrink-0" />
                                        {formatTime(activity.datetime)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    {user ? (
                                        user.id === activity.user_id ? (
                                            <span className="flex-1 py-2 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full text-center flex items-center justify-center gap-1">
                                                Your Activity
                                            </span>
                                        ) : joinedMap[activity.id] === 0 ? (
                                            <span className="flex-1 py-2 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold rounded-full text-center flex items-center justify-center gap-1">
                                                <Icon icon="mdi:clock-outline" className="text-sm" />
                                                Processing
                                            </span>
                                        ) : joinedMap[activity.id] === 1 ? (
                                            <span className="flex-1 py-2 bg-green-50 border border-green-200 text-green-600 text-xs font-semibold rounded-full text-center flex items-center justify-center gap-1">
                                                <Icon icon="mdi:check-circle-outline" className="text-sm" />
                                                Accepted
                                            </span>
                                        ) : (
                                            <button onClick={() => setJoinTarget(activity)}
                                                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-full cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm shadow-blue-200">
                                                <Icon icon="mdi:run-fast" className="text-sm" />
                                                Join Run
                                            </button>
                                        )
                                    ) : (
                                        <button onClick={() => setJoinTarget(activity)}
                                            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-full cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm shadow-blue-200">
                                            <Icon icon="mdi:run-fast" className="text-sm" />
                                            Join Run
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <Icon icon="mdi:chevron-left" className="text-base" />
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-full text-sm font-semibold transition cursor-pointer ${p === currentPage
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        Next
                        <Icon icon="mdi:chevron-right" className="text-base" />
                    </button>
                </div>
            )}
        </>
    )
}

function DescriptionModal({ activity, onClose }) {
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose()
    }
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-2">Description</h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                    >
                        <Icon icon="mdi:close" className="text-base" />
                    </button>
                </div>
                <div className="px-5 pb-5">
                    {activity.description ? (
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{activity.description}</p>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No description</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CardActivity