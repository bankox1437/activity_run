import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
function Profile() {

    const apiURL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
    })

    const handleForm = (e) => {
        const { name, value } = e.target
        const newForm = { ...form, [name]: value }

        setForm(newForm)
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {

                const res = await axios.get(`${apiURL}activity/profile`, { headers });

                if (res.data && res.data.data) {
                    const { first_name, last_name } = res.data.data
                    setForm({
                        firstName: first_name || '',
                        lastName: last_name || ''
                    })
                }
            } catch (err) {
                console.error('Fetch profile error:', err)
                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.message || 'Failed to load profile',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                })
            }
        }

        fetchProfile()
    }, [apiURL])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(form);

        try {

            if (!form.firstName || !form.lastName) {
                Swal.fire({
                    title: 'Please fill in all required fields',
                    text: 'First name and Last name are required',
                    icon: 'warning',
                })
                return
            }

            const res = await axios.put(`${apiURL}activity/updateProfile`, form, { headers });

            Swal.fire({
                title: 'Update Profile successfully!',
                text: 'Success',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
            })

            navigate('/myProfile');

        } catch (err) {
            console.error(err)
            Swal.fire({
                title: 'Failed to update profile',
                text: err.response?.data?.message || 'Update profile failed',
                icon: 'error',
                confirmButtonColor: '#3b82f6',
            })
        }

    }
    return (
        <div className="min-h-screen bg-white flex items-start justify-center p-4">
            <div className=" w-full max-w-2xl p-8">

                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    My Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleForm}
                            placeholder="Please First name"
                            className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleForm}
                            placeholder="Please Last name"
                            className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition shadow-sm cursor-pointer"
                    >Update Profile</button>
                </form>
            </div>
        </div>
    )
}

export default Profile