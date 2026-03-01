import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


function CreateActivity() {

    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()

    const [raceType, setRaceType] = useState('')
    const [raceTypes, setRaceTypes] = useState([]) // Dropdown
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)

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

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
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

        const datetime = `${form.date}T${form.time}`

        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('location', form.location)
        formData.append('description', form.description)
        formData.append('raceType', raceType)
        formData.append('datetime', datetime)
        if (imageFile) formData.append('image', imageFile)

        try {
            const res = await axios.post(
                `${apiURL}activity/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
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
                            Activity Image <span className="font-normal text-gray-500">(Optional)</span>
                        </label>

                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="relative w-full h-44 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition overflow-hidden"
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <Icon icon="mdi:image-plus-outline" className="text-4xl" />
                                    <span className="text-sm">Click to upload activity image</span>
                                </div>
                            )}

                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setImageFile(null)
                                        setImagePreview(null)
                                        fileInputRef.current.value = ''
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <Icon icon="mdi:close" className="text-sm" />
                                </button>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

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

                    <div className="flex flex-col sm:flex-row gap-3 items-start">

                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">
                                Location
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
                                    placeholder="Search or enter meeting point..."
                                    className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>

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
                            {raceTypes.map((rt) => (
                                <option key={rt.race_type_id} value={rt.race_type_id}>
                                    {rt.race_type_name}
                                </option>
                            ))}
                        </select>
                    </div>

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