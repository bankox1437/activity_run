import React, { useState } from 'react'
import axios from 'axios'
import { Icon } from '@iconify/react'

const apiURL = import.meta.env.VITE_API_URL

function JoinModal({ activity, onClose, onSuccess }) {
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await axios.post(
                `${apiURL}activity/join/${activity.activity_id ?? activity.id}`,
                { comment },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join activity')
        } finally {
            setLoading(false)
        }
    }

    return (
       
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">

                <div className="flex items-start justify-between p-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-extrabold text-gray-900">Join Activity</h2>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{activity.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                    >
                        <Icon icon="mdi:close" className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            Comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            placeholder="e.g. Looking forward to running with everyone!"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <Icon icon="mdi:alert-circle-outline" />
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition shadow-sm disabled:opacity-60 flex items-center gap-2"
                        >
                            {loading && <Icon icon="mdi:loading" className="animate-spin" />}
                            {loading ? 'Joining...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinModal
