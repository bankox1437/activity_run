import React, { useState } from 'react'
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

function ReviewModal({ activity, existingReview, onClose, onSuccess }) {
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [comment, setComment] = useState(existingReview?.comment || '')
    const [submitting, setSubmitting] = useState(false)

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose()
    }

    const handleSubmit = async () => {
        if (!rating) {
            Swal.fire({ title: 'Select a rating', text: 'Please choose a rating.', icon: 'warning', confirmButtonColor: '#3b82f6' })
            return
        }
        setSubmitting(true)
        try {
            await axios.post(
                `${apiURL}activity/${activity.activity_id}/review`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            Swal.fire({
                title: 'Review submitted!',
                text: 'Thank you for your feedback.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            })
            onSuccess && onSuccess(rating)
            onClose()
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.message || 'Failed to submit review',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Rate this Activity</h3>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[210px]">{activity?.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                    >
                        <Icon icon="mdi:close" className="text-base" />
                    </button>
                </div>

                <div className="px-5 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Select a rating</p>
                        {RATING_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition select-none
                                    ${rating === opt.value
                                        ? 'border-blue-400 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="rating"
                                    value={opt.value}
                                    checked={rating === opt.value}
                                    onChange={() => setRating(opt.value)}
                                    disabled={submitting}
                                    className="accent-blue-500 w-4 h-4"
                                />
                                <span className="text-sm font-medium">{opt.label}</span>
                                {rating === opt.value && (
                                    <Icon icon="mdi:check-circle" className="ml-auto text-blue-500 text-lg" />
                                )}
                            </label>
                        ))}
                    </div>

                    <div className="border-t border-gray-100" />

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Comment <span className="font-normal text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={submitting}
                            placeholder="Share your experience…"
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:bg-gray-50"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !rating}
                        className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {submitting ? (
                            <Icon icon="mdi:loading" className="animate-spin text-lg" />
                        ) : (
                            <>
                                {existingReview ? 'Update Review' : 'Submit Review'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal
