import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'

function CreateActivity() {
    const navigate = useNavigate()
    const [raceType, setRaceType] = useState('')
    const [form, setForm] = useState({
        title: '',
        location: '',
        locationSecondary: '',
        date: '',
        time: '',
        description: '',
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({ ...form, raceType })
        // TODO: submit to backend
    }

    return (
        <div className="min-h-screen bg-white flex items-start justify-center p-4">
            <div className=" w-full max-w-2xl p-8">

                {/* Title */}
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    Create New Run Activity
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Activity Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            Activity Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter activity name e.g. Sunday Morning Run..."
                            className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>

                    {/* Location / Date / Time row */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Location label + inputs stacked */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Location
                            </label>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Icon
                                        icon="mdi:map-marker-outline"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                                    />
                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="Search or enter meeting point..."
                                        className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>
                                <div className="relative">
                                    <Icon
                                        icon="mdi:map-marker-outline"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                                    />
                                    <input
                                        type="text"
                                        name="locationSecondary"
                                        value={form.locationSecondary}
                                        onChange={handleChange}
                                        placeholder="Search or enter meeting point..."
                                        className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-100 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="sm:w-40 w-full">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Date
                            </label>
                            <div className="relative">
                                <Icon
                                    icon="mdi:calendar-outline"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="sm:w-36 w-full">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Time
                            </label>
                            <div className="relative">
                                <Icon
                                    icon="mdi:clock-outline"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"
                                />
                                <input
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Race Type */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            Race Type
                        </label>
                        <select
                            value={raceType}
                            onChange={(e) => setRaceType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select race type...</option>
                            <option value="Trail Run">Trail Run</option>
                            <option value="City Run">City Run</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-0.5">
                            Description{' '}
                            <span className="font-normal text-gray-500">(Optional)</span>
                        </label>
                        <p className="text-xs text-gray-400 mb-2">
                            Tell runners about the route or what to prepare...
                        </p>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="e.g. We will meet at the park entrance, bring water..."
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition shadow-sm"
                        >
                            Create Activity
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateActivity