import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


function CreateActivity() {

    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()

    // วันนี้ในรูปแบบ YYYY-MM-DD สำหรับ min ของ date input
    const todayStr = new Date().toISOString().split('T')[0]

    const [raceType, setRaceType] = useState('')
    const [raceTypes, setRaceTypes] = useState([]) // Dropdown

    const [form, setForm] = useState({
        title: '',
        location: '',
        date: '',
        time: '',
        description: '',
    })

    useEffect(() => {
        axios.get(`${apiURL}activity/getRaceType`)
            .then(res => setRaceTypes(res.data.data || []))
            .catch(err => console.error('Failed to load race types', err))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.date || !form.time || !form.title || !raceType) {
            Swal.fire({
                title: 'Please fill in all required fields',
                text: 'Title, Date, Time and Race Type are required',
                icon: 'warning',
            })
            return
        }

        // ตรวจสอบว่าไม่ได้เลือกวันและเวลาในอดีต
        const selectedDatetime = new Date(`${form.date}T${form.time}`)
        if (selectedDatetime < new Date()) {
            Swal.fire({
                title: 'Invalid date/time',
                text: 'Cannot create an activity in the past',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
            })
            return
        }

        const datetime = `${form.date}T${form.time}`

        try {
            const res = await axios.post(
                `${apiURL}activity/create`,
                {
                    title: form.title,
                    location: form.location,
                    description: form.description,
                    raceType,
                    datetime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log(res.data)
            navigate('/')
        } catch (err) {
            console.error(err)
            Swal.fire({
                title: 'Failed to create activity',
                text: err.response?.data?.message || 'Create activity failed',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
            })
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-start justify-center p-4">
            <div className=" w-full max-w-2xl p-8">

                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    Create New Run Activity
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            Activity Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Please activity name"
                            className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start">

                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Location <span className="text-red-500">*</span>
                            </label>
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
                                    placeholder="Please fill the location"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="sm:w-40 w-full">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Date <span className="text-red-500">*</span>
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
                                    min={todayStr}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="sm:w-36 w-full">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Time <span className="text-red-500">*</span>
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

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            Race Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={raceType}
                            onChange={(e) => setRaceType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select race type...</option>
                            {raceTypes.map((rt) => (
                                <option key={rt.race_type_id} value={rt.race_type_id}>
                                    {rt.race_type_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-0.5">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Please fill the description"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                        />
                    </div>

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