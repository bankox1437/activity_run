import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AuthContext } from '../context/AuthContext'
import defaultCardImg from '../assets/cards_img/card_run.jpg'

const apiURL = import.meta.env.VITE_API_URL

const statusConfig = {
  0: { label: 'Processing', icon: 'mdi:clock-outline', cls: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  1: { label: 'Accepted', icon: 'mdi:check-circle-outline', cls: 'bg-green-50 text-green-600 border-green-200' },
  2: { label: 'Rejected', icon: 'mdi:close-circle-outline', cls: 'bg-red-50 text-red-500 border-red-200' },
}

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

function CreatedCard({ activity, onRemove }) {
  const navigate = useNavigate()

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative h-40 overflow-hidden bg-gray-100 shrink-0 border-b border-gray-50">
        <img
          src={activity.image || defaultCardImg}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white shadow-sm">
          {activity.type_race_name ?? '-'}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 border-b border-gray-100 pb-2">
          {activity.title}
        </h3>

        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <Icon icon="mdi:map-marker-outline" className="text-blue-400 shrink-0 text-base" />
            <span className="truncate">{activity.location || '-'}</span>
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <Icon icon="mdi:calendar-outline" className="text-blue-400 shrink-0 text-base" />
              {formatDate(activity.datetime)}
            </span>
            <span className="flex items-center gap-2">
              <Icon icon="mdi:clock-outline" className="text-blue-400 shrink-0 text-base" />
              {formatTime(activity.datetime)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
          <Icon icon="mdi:account-group-outline" className="text-gray-400 text-lg" />
          <span className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{activity.participant_count ?? 0}</span>
            <span className="text-gray-400 ml-1"> joined</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => navigate(`/activity/${activity.id}/requests`)}
            className="flex-1 py-2 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointers"
          >
            <Icon icon="mdi:account-check-outline" className="text-base" />
            Manage
          </button>
          <div className="flex">
            <button
              onClick={() => {
                if (Number(activity.participant_count) > 0) {
                  Swal.fire({
                    title: 'Cannot Edit',
                    text: 'This activity already has participants and cannot be edited.',
                    icon: 'warning',
                    confirmButtonColor: '#3b82f6',
                  })
                  return
                }
                navigate(`/activity/${activity.id}/update`)
              }}
              className="flex-1 py-2 mx-2 rounded-xl border border-yellow-200 text-yellow-500 text-xs font-semibold hover:bg-yellow-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon icon="mdi:edit-outline" className="text-base" />
            </button>
            <button
              onClick={() => onRemove(activity)}
              className="flex-1 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon icon="mdi:trash-can-outline" className="text-base" />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

function JoinedCard({ activity, onCancel }) {
  const navigate = useNavigate()
  const statusKey = Number(activity.status)
  const cfg = statusConfig[statusKey] ?? statusConfig[0]
  const organizer = `${activity.organizer_first ?? ''} ${activity.organizer_last ?? ''}`.trim() || '-'
  const isPast = new Date(activity.datetime) < new Date()
  const canRate = isPast && statusKey === 1

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative h-40 overflow-hidden bg-gray-100 shrink-0 border-b border-gray-50">
        <img
          src={activity.image || defaultCardImg}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white shadow-sm">
          {activity.type_race_name ?? '-'}
        </span>
        <span className={`absolute top-2 right-2 flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border shadow-sm ${cfg.cls}`}>
          {cfg.label}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 border-b border-gray-100 pb-2">
          {activity.title}
        </h3>

        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <Icon icon="mdi:map-marker-outline" className="text-blue-400 shrink-0 text-base" />
            <span className="truncate">{activity.location || '-'}</span>
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <Icon icon="mdi:calendar-outline" className="text-blue-400 shrink-0 text-base" />
              {formatDate(activity.datetime)}
            </span>
            <span className="flex items-center gap-2">
              <Icon icon="mdi:clock-outline" className="text-blue-400 shrink-0 text-base" />
              {formatTime(activity.datetime)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Icon icon="mdi:account-outline" className="text-blue-500 text-base" />
            </div>
            <span className="truncate">{organizer}</span>
          </div>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {activity.type_race_name ?? '-'}
          </span>
        </div>

        {statusKey === 0 && (
          <button
            onClick={() => onCancel(activity)}
            className="mt-auto w-full py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition flex items-center justify-center gap-1.5"
          >
            <Icon icon="mdi:close-circle-outline" className="text-base" />
            Cancel Request
          </button>
        )}

        {canRate && (
          <button
            onClick={() => navigate(`/activity/${activity.activity_id}/review`)}
            className="w-full py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-sm font-semibold hover:bg-amber-100 transition flex items-center justify-center gap-1.5"
          >
            <Icon icon="mdi:star-outline" className="text-base" />
            Rate Activity
          </button>
        )}

      </div>
    </div>
  )
}

function MyActivity() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('created')

  const [created, setCreated] = useState([])
  const [joined, setJoined] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    Promise.all([
      axios.get(`${apiURL}activity/my-created`, { headers }),
      axios.get(`${apiURL}activity/my-joined`, { headers }),
    ])
      .then(([createdRes, joinedRes]) => {
        setCreated(createdRes.data.data || [])
        setJoined(joinedRes.data.data || [])
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleCancelJoin = async (activity) => {
    const result = await Swal.fire({
      title: 'Cancel Request?',
      text: `Cancel your join request for "${activity.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel',
    })
    if (!result.isConfirmed) return

    try {
      await axios.delete(`${apiURL}activity/join/${activity.join_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setJoined((prev) => prev.filter((j) => j.join_id !== activity.join_id))
      Swal.fire({ title: 'Cancelled', text: 'Your join request has been cancelled.', icon: 'success', confirmButtonColor: '#3b82f6' })
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Cancel failed', icon: 'error', confirmButtonColor: '#3b82f6' })
    }
  }

  const handleDeleteActivity = async (activity) => {
    const result = await Swal.fire({
      title: 'Delete Activity?',
      text: `Are you sure you want to delete "${activity.title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    })
    if (!result.isConfirmed) return

    try {
      await axios.delete(`${apiURL}activity/${activity.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setCreated((prev) => prev.filter((a) => a.id !== activity.id))
      Swal.fire({ title: 'Deleted', text: 'Activity has been deleted.', icon: 'success', confirmButtonColor: '#3b82f6' })
    } catch (err) {
      Swal.fire({
        title: 'Delete Failed',
        text: err.response?.data?.message || 'Failed to delete activity',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-6xl mx-auto">

      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-extrabold text-gray-900">My Activity</h1>
        <button
          onClick={() => navigate('/createActivity')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition shadow-sm"
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Create Activity
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'created', label: 'Created', icon: 'mdi:pencil-outline' },
          { key: 'joined', label: 'Joined', icon: 'mdi:account-plus-outline' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${activeTab === tab.key
              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
              }`}
          >
            <Icon icon={tab.icon} className="text-base" />
            {tab.label}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
              {tab.key === 'created' ? created.length : joined.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Icon icon="mdi:loading" className="text-4xl text-gray-300 animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'created' && (
            created.length === 0
              ? <EmptyState message="You haven't created any activities yet." />
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {created.map((a) => <CreatedCard key={a.id} activity={a} onRemove={handleDeleteActivity} />)}
              </div>
          )}

          {activeTab === 'joined' && (
            joined.length === 0
              ? <EmptyState message="You haven't joined any activities yet." />
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {joined.map((a) => (
                  <JoinedCard key={a.join_id} activity={a} onCancel={() => handleCancelJoin(a)} />
                ))}
              </div>
          )}
        </>
      )}

    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}

export default MyActivity