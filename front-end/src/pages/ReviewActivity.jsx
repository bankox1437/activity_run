import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Swal from 'sweetalert2'

const apiURL = import.meta.env.VITE_API_URL

const RATING_OPTIONS = [
    { value: 1, label: '1 Poor' },
    { value: 2, label: '2 Fair' },
    { value: 3, label: '3 Good' },
    { value: 4, label: '4 Great' },
    { value: 5, label: '5 Excellent!' },
]

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

function ReviewActivity() {
    const navigate = useNavigate()
    const { id: activityId } = useParams()

    const [activity, setActivity] = useState(null)
    const [existing, setExisting] = useState(null)
    const [loading, setLoading] = useState(true)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        if (!activityId) return
        Promise.all([
            axios.get(`${apiURL}activity/${activityId}/info`),
            axios.get(`${apiURL}activity/${activityId}/my-review`, { headers }),
        ])
            .then(([infoRes, reviewRes]) => {
                setActivity(infoRes.data.data)
                const rev = reviewRes.data.review
                if (rev) {
                    setExisting(rev)
                    setRating(rev.rating)
                    setComment(rev.comment || '')
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [activityId])

    const handleSubmit = async () => {
        if (!rating) {
            Swal.fire({ title: 'Select a rating', icon: 'warning', confirmButtonColor: '#3b82f6' })
            return
        }
        setSubmitting(true)
        try {
            await axios.post(`${apiURL}activity/${activityId}/review`, { rating, comment }, { headers })
            await Swal.fire({
                title: existing ? 'Review updated!' : 'Review submitted!',
                icon: 'success', timer: 2000, showConfirmButton: false,
            })
            navigate(-1)
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.message || 'Failed to submit review',
                icon: 'error', confirmButtonColor: '#3b82f6',
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center py-24">
            <Icon icon="mdi:loading" className="text-4xl text-gray-300 animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-4 mx-auto">

            <button onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition mb-6 pt-2">
                <Icon icon="mdi:arrow-left" /> Back
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900">
                    {existing ? 'Update Review' : 'Rate Activity'}
                </h1>
            </div>

            {activity && (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">
                    <h2 className="font-bold text-gray-900 text-base truncate">{activity.title}</h2>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:map-marker-outline" className="text-blue-400" />{activity.location || '-'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:calendar-outline" className="text-blue-400" />
                            {formatDate(activity.datetime)} · {formatTime(activity.datetime)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:run-fast" className="text-blue-400" />{activity.type_race_name || '-'}
                        </span>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Select a rating</p>
                <div className="flex flex-col gap-2">
                    {RATING_OPTIONS.map((opt) => (
                        <label key={opt.value}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 cursor-pointer transition select-none`}>
                            <input type="radio" name="rating" value={opt.value}
                                checked={rating === opt.value}
                                onChange={() => setRating(opt.value)}
                                disabled={submitting}
                                className="accent-blue-500 w-4 h-4" />
                            <span className="text-sm font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Comment
                </label>
                <textarea rows={4} value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                    placeholder="Share your experience…"
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:bg-gray-50" />
            </div>

            <button onClick={handleSubmit} disabled={submitting || !rating}
                className="w-full py-3 rounded-2xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
                {submitting
                    ? <Icon icon="mdi:loading" className="animate-spin text-lg" />
                    : <>{existing ? 'Update Review' : 'Submit Review'}</>}
            </button>

        </div>
    )
}

export default ReviewActivity
