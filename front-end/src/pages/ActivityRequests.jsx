import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'

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

function getInitials(first, last) {
    return `${(first?.[0] ?? '').toUpperCase()}${(last?.[0] ?? '').toUpperCase()}`
}

function ActivityRequests() {
    const navigate = useNavigate()
    const { id: activityId } = useParams()

    const [activity, setActivity] = useState(null)
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')
    const [confirmModal, setConfirmModal] = useState(null)
    const [updating, setUpdating] = useState(false)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        if (!activityId) return

        const fetchAll = async () => {
            try {
                const [actRes, reqRes] = await Promise.all([
                    axios.get(`${apiURL}activity/all`),
                    axios.get(`${apiURL}activity/${activityId}/requests`, { headers }),
                ])

                const found = actRes.data.data?.find(a => String(a.id) === String(activityId))
                setActivity(found ?? null)

                // boolean → string
                const normalized = reqRes.data.data.map(r => ({
                    ...r,
                    statusStr: intToStatus(r.status),
                }))
                setRequests(normalized)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load data')
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [activityId])

    // accept / reject
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
        } catch (err) {
            console.error(err)
        } finally {
            setUpdating(false)
            setConfirmModal(null)
        }
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
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition mb-5"
            >
                <Icon icon="mdi:arrow-left" />
                Back to My Activity
            </button>

            {activity && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900 truncate">{activity.title}</h2>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Icon icon="mdi:map-marker-outline" />{activity.location || '-'}</span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:calendar-outline" />
                            {activity.datetime ? new Date(activity.datetime).toLocaleDateString('en-EN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:run-fast" />
                            {activity.type_race_name || '-'}
                        </span>
                    </div>
                </div>
            )}
            <div className="flex gap-1 bg-gray-100 rounded-full p-1 mb-5 w-fit flex-wrap">
                {['all', 'pending', 'accepted', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {f === 'all' ? `All (${counts.all})` : `${statusConfig[f].label} (${counts[f]})`}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-gray-300">
                        <Icon icon="mdi:account-group-outline" className="text-6xl mb-2" />
                        <p className="text-sm text-gray-400">No requests here.</p>
                    </div>
                )}

                {filtered.map((req) => {
                    const cfg = statusConfig[req.statusStr]
                    const initials = getInitials(req.first_name, req.last_name)

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
                                {req.comment && (
                                    <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-xl px-3 py-2 italic">
                                        "{req.comment}"
                                    </p>
                                )}
                            </div>

                            {req.statusStr === 'pending' && (
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setConfirmModal({ join_id: req.join_id, name: `${req.first_name} ${req.last_name}`, action: 'accepted' })}
                                        className="flex items-center gap-1 px-4 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full hover:bg-green-600 transition"
                                    >
                                        <Icon icon="mdi:check" /> Accept
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ join_id: req.join_id, name: `${req.first_name} ${req.last_name}`, action: 'rejected' })}
                                        className="flex items-center gap-1 px-4 py-1.5 border border-red-200 text-red-500 text-xs font-medium rounded-full hover:bg-red-50 transition"
                                    >
                                        <Icon icon="mdi:close" /> Reject
                                    </button>
                                </div>
                            )}

                        </div>
                    )
                })}
            </div>

            {confirmModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <h3 className="font-extrabold text-gray-900 text-lg mb-1">
                            {confirmModal.action === 'accepted' ? 'Accept Request?' : 'Reject Request?'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-5">
                            {confirmModal.action === 'accepted'
                                ? `${confirmModal.name} will be accepted into this activity.`
                                : `${confirmModal.name}'s request will be rejected.`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                disabled={updating}
                                className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateStatus(confirmModal.join_id, confirmModal.action)}
                                disabled={updating}
                                className={`flex-1 py-2.5 rounded-full text-white text-sm font-semibold transition flex items-center justify-center gap-2 ${confirmModal.action === 'accepted' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                {updating && <Icon icon="mdi:loading" className="animate-spin" />}
                                {confirmModal.action === 'accepted' ? 'Yes, Accept' : 'Yes, Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ActivityRequests
