import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import LocationSearch from '../components/LocationSearch'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function CreateActivity() {
    const apiURL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })

    const [raceType, setRaceType] = useState('')
    const [raceTypes, setRaceTypes] = useState([])
    const [form, setForm] = useState({ title: '', location: '', latitude: null, longitude: null, date: '', time: '', description: '' })

    // Image state
    const [imagePreview, setImagePreview] = useState(null)
    const [imageUrl, setImageUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef()

    useEffect(() => {
        axios.get(`${apiURL}activity/getRaceType`)
            .then(res => setRaceTypes(res.data.data || []))
            .catch(err => console.error('Failed to load race types', err))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        let newForm = { ...form, [name]: value }
        if (name === 'date' && value === todayStr && form.time) {
            if (form.time < currentTime) newForm.time = ''
        }
        setForm(newForm)
    }

    const handleLocationSelect = ({ address, lat, lng }) => {
        setForm(prev => ({ ...prev, location: address, latitude: lat, longitude: lng }))
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            Swal.fire({ title: 'Invalid file', text: 'Please select an image file', icon: 'warning', confirmButtonColor: '#3b82f6' })
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({ title: 'File too large', text: 'Image must be less than 5MB', icon: 'warning', confirmButtonColor: '#3b82f6' })
            return
        }

        setImagePreview(URL.createObjectURL(file))
        setUploading(true)
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', UPLOAD_PRESET)
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data
            )
            setImageUrl(res.data.secure_url)
        } catch {
            Swal.fire({ title: 'Upload failed', text: 'Could not upload image', icon: 'error', confirmButtonColor: '#3b82f6' })
            setImagePreview(null)
            setImageUrl('')
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
        setImageUrl('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.date || !form.time || !form.title || !raceType || !form.description || !form.location) {
            Swal.fire({ title: 'Please fill in all required fields', text: 'Title, Location, Date, Time, Race Type and Description are required', icon: 'warning' })
            return
        }

        const selectedDatetime = new Date(`${form.date}T${form.time}:00+07:00`)
        if (selectedDatetime < new Date()) {
            Swal.fire({ title: 'Invalid date/time', text: 'Cannot create an activity in the past', icon: 'warning', confirmButtonColor: '#3b82f6' })
            return
        }

        if (uploading) {
            Swal.fire({ title: 'Please wait', text: 'Image is still uploading...', icon: 'info', confirmButtonColor: '#3b82f6' })
            return
        }

        const datetime = selectedDatetime.toISOString()

        try {
            await axios.post(
                `${apiURL}activity/create`,
                { title: form.title, location: form.location, latitude: form.latitude, longitude: form.longitude, description: form.description, raceType, datetime, imageUrl },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            )
            navigate('/')
        } catch (err) {
            console.error(err)
            Swal.fire({ title: 'Failed to create activity', text: err.response?.data?.message || 'Create activity failed', icon: 'error', confirmButtonColor: '#3b82f6' })
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-start justify-center p-4">
            <div className="w-full max-w-2xl p-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Create New Run Activity</h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">Activity Image</label>
                        {imagePreview ? (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-100">
                                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Icon icon="mdi:loading" className="text-white text-3xl animate-spin" />
                                    </div>
                                )}
                                {!uploading && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition cursor-pointer"
                                    >
                                        <Icon icon="mdi:close" className="text-base" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 text-gray-400 hover:text-blue-400 flex flex-col items-center justify-center gap-2 transition cursor-pointer"
                            >
                                <Icon icon="mdi:image-plus-outline" className="text-3xl" />
                                <span className="text-xs font-medium">Click to upload image</span>
                            </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">Activity Title <span className="text-red-500">*</span></label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Activity name"
                            className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">Location <span className="text-red-500">*</span></label>
                        <LocationSearch onLocationSelect={handleLocationSelect} initialValue={form.location} initialLat={form.latitude} initialLng={form.longitude} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Icon icon="mdi:calendar-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                                <input type="date" name="date" value={form.date} min={todayStr} onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className={`block text-sm font-bold mb-1.5 ${!form.date ? 'text-gray-400' : 'text-gray-800'}`}>Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Icon icon="mdi:clock-outline" className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none ${!form.date ? 'text-gray-300' : 'text-gray-400'}`} />
                                <input type="time" name="time" value={form.time} onChange={handleChange} disabled={!form.date}
                                    min={form.date === todayStr ? currentTime : undefined}
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-full border text-sm focus:outline-none transition ${!form.date ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent'}`} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">Race Type <span className="text-red-500">*</span></label>
                        <select value={raceType} onChange={(e) => setRaceType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition appearance-none cursor-pointer">
                            <option value="" disabled>Select race type...</option>
                            {raceTypes.map((rt) => (
                                <option key={rt.race_type_id} value={rt.race_type_id}>{rt.race_type_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-0.5">Description <span className="text-red-500">*</span></label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none" />
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <button type="button" onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={uploading}
                            className="px-6 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                            {uploading ? 'Uploading...' : 'Create Activity'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateActivity