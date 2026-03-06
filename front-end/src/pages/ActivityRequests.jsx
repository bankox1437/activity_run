import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Swal from 'sweetalert2'

const apiURL = import.meta.env.VITE_API_URL

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-600', icon: 'mdi:clock-outline' },
    accepted: { label: 'Accepted', cls: 'bg-green-100 text-green-600', icon: 'mdi:check-circle-outline' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-500', icon: 'mdi:close-circle-outline' },
}

function intToStatus(val) {
    if (val === 1) return 'accepted'
    if (val === 2) return 'rejected'
    return 'pending'
}

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

function ActivityRequests() {
    const navigate = useNavigate()
    const { id: activityId } = useParams()

    const [activity, setActivity] = useState(null)
    const [requests, setRequests] = useState([])
    const [participants, setParticipants] = useState([])
    const [reviews, setReviews] = useState({ average: null, count: 0, reviews: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')
    const [activePanel, setActivePanel] = useState('requests') // 'requests' | 'participants'
    const [updating, setUpdating] = useState(false)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        if (!activityId) return

        const fetchData = async () => {
            try {
                const [reqRes, infoRes, partRes, reviewRes] = await Promise.all([
                    axios.get(`${apiURL}activity/${activityId}/requests`, { headers }),
                    axios.get(`${apiURL}activity/${activityId}/info`),
                    axios.get(`${apiURL}activity/${activityId}/participants`),
                    axios.get(`${apiURL}activity/${activityId}/reviews`),
                ])

                const rows = reqRes.data.data || []
                const info = infoRes.data.data

                if (info) {
                    setActivity({
                        title: info.title,
                        location: info.location,
                        datetime: info.datetime,
                        type_race_name: info.type_race_name,
                    })
                }

                const normalized = rows.map(r => ({
                    ...r,
                    statusStr: intToStatus(r.status),
                }))
                setRequests(normalized)
                setParticipants(partRes.data.data || [])
                setReviews(reviewRes.data || { average: null, count: 0, reviews: [] })
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [activityId])

    const updateStatus = async (join_id, action) => {
        setUpdating(true)
        try {
            await axios.patch(
                `${apiURL}activity/request/${join_id}`,
                { status: action },
                { headers }
            )
            setRequests(prev =>
                prev.map(r => r.join_id === join_id ? { ...r, statusStr: action } : r)
            )
            // Refresh participants if accepted
            if (action === 'accepted') {
                axios.get(`${apiURL}activity/${activityId}/participants`)
                    .then(res => setParticipants(res.data.data || []))
                    .catch(() => { })
            }
            Swal.fire({
                title: 'Success!',
                text: `Request has been ${action}.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            })
        } catch (err) {
            console.error(err)
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.message || 'Failed to update request status',
                icon: 'error'
            })
        } finally {
            setUpdating(false)
        }
    }

    const handleConfirmAction = (join_id, name, action) => {
        const isAccept = action === 'accepted'
        Swal.fire({
            title: isAccept ? 'Accept Request?' : 'Reject Request?',
            text: isAccept
                ? `${name} will be accepted into this activity.`
                : `${name}'s request will be rejected.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: isAccept ? '#22c55e' : '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: isAccept ? 'Yes, Accept' : 'Yes, Reject',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus(join_id, action)
            }
        })
    }

    const filtered = filter === 'all'
        ? requests
        : requests.filter(r => r.statusStr === filter)

    const counts = {
        all: requests.length,
        pending: requests.filter(r => r.statusStr === 'pending').length,
        accepted: requests.filter(r => r.statusStr === 'accepted').length,
        rejected: requests.filter(r => r.statusStr === 'rejected').length,
    }

    if (loading) return (
        <div className="flex justify-center py-24">
            <Icon icon="mdi:loading" className="text-4xl text-gray-300 animate-spin" />
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center py-24 text-gray-400 gap-2">
            <Icon icon="mdi:alert-circle-outline" className="text-5xl text-red-300" />
            <p className="text-sm">{error}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-white p-4 mx-auto">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition mb-5 cursor-pointer"
            >
                <Icon icon="mdi:arrow-left" />
                Back to My Activity
            </button>

            {activity && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900 truncate">{activity.title}</h2>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:map-marker-outline" />{activity.location || '-'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:calendar-outline" />
                            {formatDate(activity.datetime)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:run-fast" />
                            {activity.type_race_name || '-'}
                        </span>
                    </div>

                    {reviews.count > 0 && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-blue-100">
                            <StarDisplay rating={reviews.average} />
                            <span className="text-xs font-semibold text-gray-600">({reviews.average})</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-2 mb-5">
                {[
                    { key: 'requests', label: 'Requests', icon: 'mdi:account-multiple-check-outline', badge: counts.all },
                    { key: 'reviewed', label: 'Reviewed', icon: 'mdi:star-outline', badge: reviews.count },
                ].map(p => (
                    <button
                        key={p.key}
                        onClick={() => setActivePanel(p.key)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border cursor-pointer ${activePanel === p.key
                            ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
                            }`}
                    >
                        <Icon icon={p.icon} className="text-base" />
                        {p.label}
                        <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activePanel === p.key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {p.badge}
                        </span>
                    </button>
                ))}
            </div>

            {activePanel === 'requests' && (
                <>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {[
                            { key: 'all', label: 'All', icon: 'mdi:view-grid-outline' },
                            { key: 'pending', label: 'Pending', icon: 'mdi:clock-outline' },
                            { key: 'accepted', label: 'Accepted', icon: 'mdi:check-circle-outline' },
                            { key: 'rejected', label: 'Rejected', icon: 'mdi:close-circle-outline' },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border cursor-pointer ${filter === f.key
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
                                    }`}
                            >
                                <Icon icon={f.icon} className="text-base" />
                                {f.label}
                                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                    {counts[f.key]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center py-16 text-gray-300">
                                <p className="text-sm text-gray-400">No requests here</p>
                            </div>
                        )}

                        {filtered.map((req) => {
                            const cfg = statusConfig[req.statusStr]

                            return (
                                <div
                                    key={req.join_id}
                                    className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-gray-900 text-sm">{req.first_name} {req.last_name}</span>
                                            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                                                <Icon icon={cfg.icon} className="text-sm" />
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center my-1">
                                            <p className="text-gray-500 text-xs">
                                                {formatDate(req.datetime)} {formatTime(req.datetime)}
                                            </p>
                                        </div>
                                        {req.comment && (
                                            <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-xl px-3 py-2">
                                                {req.comment}
                                            </p>
                                        )}
                                    </div>

                                    {req.statusStr === 'pending' && (
                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleConfirmAction(req.join_id, `${req.first_name} ${req.last_name}`, 'accepted')}
                                                className="flex items-center gap-1 px-4 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full hover:bg-green-600 transition cursor-pointer"
                                            >
                                                <Icon icon="mdi:check" /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleConfirmAction(req.join_id, `${req.first_name} ${req.last_name}`, 'rejected')}
                                                className="flex items-center gap-1 px-4 py-1.5 border border-red-200 text-red-500 text-xs font-medium rounded-full hover:bg-red-50 transition cursor-pointer"
                                            >
                                                <Icon icon="mdi:close" /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}

            {activePanel === 'reviewed' && (
                <div className="flex flex-col gap-3">
                    {reviews.count === 0 ? (
                        <div className="flex flex-col items-center py-16 text-gray-300">
                            <p className="text-sm text-gray-400">No reviews yet</p>
                        </div>
                    ) : (
                        <>

                            {reviews.reviews.map((r, i) => (
                                <div
                                    key={r.id}
                                    className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{r.first_name} {r.last_name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <StarDisplay rating={r.rating} />
                                            {r.comment && (
                                                <span className="text-xs text-gray-400 truncate">"{r.comment}"</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

        </div>
    )
}

export default ActivityRequests
