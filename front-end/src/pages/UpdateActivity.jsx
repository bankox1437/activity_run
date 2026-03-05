import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Swal from 'sweetalert2'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function UpdateActivity() {
    const apiURL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const { id: activityId } = useParams()

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })

    const [raceType, setRaceType] = useState('')
    const [raceTypes, setRaceTypes] = useState([])
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({ title: '', location: '', date: '', time: '', description: '' })

    // Image state
    const [imagePreview, setImagePreview] = useState(null)   // URL to show in preview
    const [imageUrl, setImageUrl] = useState(undefined)      // undefined = no change; '' = remove; 'https://...' = new
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef()

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [infoRes, typesRes] = await Promise.all([
                    axios.get(`${apiURL}activity/${activityId}/info`),
                    axios.get(`${apiURL}activity/getRaceType`),
                ])

                const info = infoRes.data.data
                setRaceTypes(typesRes.data.data || [])

                if (info) {
                    const createdRes = await axios.get(`${apiURL}activity/my-created`, { headers })
                    const match = (createdRes.data.data || []).find(a => String(a.id) === String(activityId))

                    if (match && Number(match.participant_count) > 0) {
                        await Swal.fire({ title: 'Cannot Edit', text: 'This activity already has participants and cannot be edited.', icon: 'warning', confirmButtonColor: '#3b82f6' })
                        navigate(-1)
                        return
                    }

                    const dt = new Date(info.datetime)
                    const date = dt.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
                    const time = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })

                    setForm({ title: info.title || '', location: info.location || '', date, time, description: info.description || '' })
                    setRaceType(String(info.type_race || ''))

                    // Show existing image if available
                    if (info.image) {
                        setImagePreview(info.image)
                        // imageUrl stays undefined = keep existing
                    }
                }
            } catch (err) {
                console.error(err)
                Swal.fire({ title: 'Error', text: 'Failed to load activity', icon: 'error' })
                navigate(-1)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [activityId])

    const handleChange = (e) => {
        const { name, value } = e.target
        let newForm = { ...form, [name]: value }
        if (name === 'date' && value === todayStr && form.time) {
            if (form.time < currentTime) newForm.time = ''
        }
        setForm(newForm)
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
            setImageUrl(undefined)
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
        setImageUrl('')   // '' means explicitly remove
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.date || !form.time || !form.title || !raceType || !form.description) {
            Swal.fire({ title: 'Please fill in all required fields', text: 'Title, Date, Time, Race Type and Description are required', icon: 'warning' })
            return
        }

        const selectedDatetime = new Date(`${form.date}T${form.time}:00+07:00`)
        if (selectedDatetime < new Date()) {
            Swal.fire({ title: 'Invalid date/time', text: 'Cannot set an activity in the past', icon: 'warning', confirmButtonColor: '#3b82f6' })
            return
        }

        if (uploading) {
            Swal.fire({ title: 'Please wait', text: 'Image is still uploading...', icon: 'info', confirmButtonColor: '#3b82f6' })
            return
        }

        const datetime = selectedDatetime.toISOString()

        try {
            await axios.put(
                `${apiURL}activity/update/${activityId}`,
                { title: form.title, location: form.location, description: form.description, raceType, datetime, imageUrl },
                { headers: { ...headers, 'Content-Type': 'application/json' } }
            )
            await Swal.fire({ title: 'Updated!', text: 'Activity has been updated successfully.', icon: 'success', timer: 2000, showConfirmButton: false })
            navigate('/myActivity')
        } catch (err) {
            console.error(err)
            Swal.fire({ title: 'Failed to update', text: err.response?.data?.message || 'Update activity failed', icon: 'error', confirmButtonColor: '#3b82f6' })
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Icon icon="mdi:loading" className="text-4xl text-gray-300 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex items-start justify-center p-4">
            <div className="w-full max-w-2xl p-8">

                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition mb-6">
                    <Icon icon="mdi:arrow-left" />Back to My Activity
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Edit Activity</h1>

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
                                    <button type="button" onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition">
                                        <Icon icon="mdi:close" className="text-base" />
                                    </button>
                                )}
                                {!uploading && (
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-2 right-2 px-3 py-1 bg-black/50 hover:bg-black/70 text-white text-xs rounded-full flex items-center gap-1 transition">
                                        <Icon icon="mdi:pencil" className="text-sm" /> Change
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 text-gray-400 hover:text-blue-400 flex flex-col items-center justify-center gap-2 transition">
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

                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <div className="flex-1 min-w-0">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">Location</label>
                            <div className="relative">
                                <Icon icon="mdi:map-marker-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                            </div>
                        </div>

                        <div className="sm:w-40 w-full">
                            <label className="block text-sm font-bold text-gray-800 mb-1.5">Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Icon icon="mdi:calendar-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                                <input type="date" name="date" value={form.date} min={todayStr} onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                            </div>
                        </div>

                        <div className="sm:w-36 w-full">
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
                            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={uploading}
                            className="px-6 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            {uploading ? 'Uploading...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default UpdateActivity
