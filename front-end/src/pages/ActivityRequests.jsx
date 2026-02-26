import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'

const mockActivity = {
    id: 1,
    title: 'Sunday Morning Run',
    location: 'Lumpini Park, Bangkok',
    date: '25/04/2026',
    time: '05:30 AM',
    raceType: 'City Run',
}

const initialRequests = [
    {
        id: 101,
        name: 'Somchai Jaidee',
        avatar: 'SC',
        requestedAt: '24/02/2026 10:15',
        note: 'I run 5k regularly, looking forward to joining!',
        status: 'pending',
    },
    {
        id: 102,
        name: 'Nattaya Kaew',
        avatar: 'NK',
        requestedAt: '24/02/2026 11:42',
        note: '',
        status: 'pending',
    },
    {
        id: 103,
        name: 'Prapat Moonlai',
        avatar: 'PM',
        requestedAt: '25/02/2026 08:00',
        note: 'Beginner here, hope thats ok!',
        status: 'accepted',
    },
    {
        id: 104,
        name: 'Wanida Srikul',
        avatar: 'WS',
        requestedAt: '25/02/2026 09:30',
        note: '',
        status: 'rejected',
    },
]

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-600', icon: 'mdi:clock-outline' },
    accepted: { label: 'Accepted', cls: 'bg-green-100 text-green-600', icon: 'mdi:check-circle-outline' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-500', icon: 'mdi:close-circle-outline' },
}

const avatarColors = [
    'bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-rose-400',
    'bg-orange-400', 'bg-teal-400',
]

function getAvatarColor(id) {
    return avatarColors[id % avatarColors.length]
}

function ActivityRequests() {
    const navigate = useNavigate()
    const [requests, setRequests] = useState(initialRequests)
    const [filter, setFilter] = useState('all')
    const [confirmModal, setConfirmModal] = useState(null) // { id, action }

    const updateStatus = (id, newStatus) => {
        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        )
        setConfirmModal(null)
    }

    const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

    const counts = {
        all: requests.length,
        pending: requests.filter((r) => r.status === 'pending').length,
        accepted: requests.filter((r) => r.status === 'accepted').length,
        rejected: requests.filter((r) => r.status === 'rejected').length,
    }

    return (
        <div className="min-h-screen bg-white p-4 mx-auto">

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition mb-5"
            >
                <Icon icon="mdi:arrow-left" />
                Back to My Activity
            </button>

            {/* Activity info card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                    {/* <p className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-0.5">Managing requests for</p> */}
                    <h2 className="text-lg font-extrabold text-gray-900 truncate">{mockActivity.title}</h2>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Icon icon="mdi:map-marker-outline" />{mockActivity.location}</span>
                        <span className="flex items-center gap-1"><Icon icon="mdi:calendar-outline" />{mockActivity.date}</span>
                        <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" />{mockActivity.time}</span>
                    </div>
                </div>
                {/* <div className="flex flex-col items-center bg-white rounded-xl px-4 py-2 shadow-sm">
                    <span className="text-2xl font-extrabold text-blue-500">{counts.pending}</span>
                    <span className="text-xs text-gray-400">Pending</span>
                </div> */}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-full p-1 mb-5 w-fit flex-wrap">
                {['all', 'pending', 'accepted', 'rejected'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {f !== 'all' && <Icon icon={statusConfig[f].icon} />}
                        {f === 'all' ? 'All' : statusConfig[f].label}
                        <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${filter === f ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {counts[f]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Request cards */}
            <div className="flex flex-col gap-3">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-gray-300">
                        <Icon icon="mdi:account-group-outline" className="text-6xl mb-2" />
                        <p className="text-sm text-gray-400">No requests here.</p>
                    </div>
                )}

                {filtered.map((req) => {
                    const cfg = statusConfig[req.status]
                    return (
                        <div
                            key={req.id}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition"
                        >
                            {/* Avatar */}
                            <div
                                className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getAvatarColor(req.id)}`}
                            >
                                {req.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-gray-900 text-sm">{req.name}</span>
                                    {/* Status badge */}
                                    <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                                        <Icon icon={cfg.icon} className="text-sm" />
                                        {cfg.label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Requested: {req.requestedAt}</p>
                                {req.note && (
                                    <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-xl px-3 py-2 italic">
                                        "{req.note}"
                                    </p>
                                )}
                            </div>

                            {/* Action buttons — only show for pending */}
                            {req.status === 'pending' && (
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setConfirmModal({ id: req.id, name: req.name, action: 'accepted' })}
                                        className="flex items-center gap-1 px-4 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full hover:bg-green-600 transition"
                                    >
                                        <Icon icon="mdi:check" />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ id: req.id, name: req.name, action: 'rejected' })}
                                        className="flex items-center gap-1 px-4 py-1.5 border border-red-200 text-red-500 text-xs font-medium rounded-full hover:bg-red-50 transition"
                                    >
                                        <Icon icon="mdi:close" />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Undo button for already decided */}
                            {req.status !== 'pending' && (
                                <button
                                    onClick={() => updateStatus(req.id, 'pending')}
                                    className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600 underline transition self-start mt-1"
                                >
                                    Undo
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <h3 className="font-extrabold text-gray-900 text-lg mb-1">
                            {confirmModal.action === 'accepted' ? 'Accept Request?' : 'Reject Request?'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-5">
                            {confirmModal.action === 'accepted'
                                ? `${confirmModal.name} will be notified that they have been accepted.`
                                : `${confirmModal.name} will be notified that their request was rejected.`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateStatus(confirmModal.id, confirmModal.action)}
                                className={`flex-1 py-2.5 rounded-full text-white text-sm font-semibold transition ${confirmModal.action === 'accepted'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
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
