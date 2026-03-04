import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'

const apiURL = import.meta.env.VITE_API_URL

function StarDisplay({ rating }) {
    return (
        <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Icon
                    key={s}
                    icon={s <= Math.round(rating) ? 'mdi:star' : 'mdi:star-outline'}
                    className={`text-sm ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                />
            ))}
        </span>
    )
}

function ParticipantsModal({ activity, onClose }) {
    const [data, setData] = useState({ average: null, count: 0, reviews: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!activity?.id) return
        axios.get(`${apiURL}activity/${activity.id}/reviews`)
            .then(res => setData(res.data || { average: null, count: 0, reviews: [] }))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [activity?.id])

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Ratings & Reviews</h3>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{activity?.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                    >
                        <Icon icon="mdi:close" className="text-base" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-5 py-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Icon icon="mdi:loading" className="text-3xl text-gray-300 animate-spin" />
                        </div>
                    ) : data.count === 0 ? (
                        <div className="flex flex-col items-center py-10 text-gray-300 gap-2">
                            <Icon icon="mdi:star-outline" className="text-5xl" />
                            <p className="text-sm text-gray-400">No reviews yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Summary */}
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                                <span className="text-3xl font-extrabold text-amber-500">{data.average}</span>
                                <div>
                                    <StarDisplay rating={data.average} />
                                    <p className="text-xs text-gray-400 mt-0.5">from {data.count} review{data.count > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            {/* Review list */}
                            {data.reviews.map((r) => (
                                <div key={r.id} className="flex flex-col gap-1.5 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-800">{r.first_name} {r.last_name}</span>
                                        <StarDisplay rating={r.rating} />
                                        <span className="ml-auto text-xs text-amber-500 font-bold">{r.rating}/5</span>
                                    </div>
                                    {r.comment && (
                                        <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">
                                            "{r.comment}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ParticipantsModal
