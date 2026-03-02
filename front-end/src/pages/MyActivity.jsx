import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AuthContext } from '../context/AuthContext'

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
  })
}

function formatTime(datetime) {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function CreatedCard({ activity }) {
  const navigate = useNavigate()

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex flex-col gap-4 flex-1">

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-snug truncate">{activity.title}</h3>
          </div>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {activity.type_race_name ?? '-'}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
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

        <button
          onClick={() => navigate(`/activity/${activity.id}/requests`)}
          className="mt-auto w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 active:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:account-check-outline" className="text-base" />
          Manage
        </button>

      </div>
    </div>
  )
}

function JoinedCard({ activity, onCancel }) {
  const statusKey = Number(activity.status)
  const cfg = statusConfig[statusKey] ?? statusConfig[0]
  const organizer = `${activity.organizer_first ?? ''} ${activity.organizer_last ?? ''}`.trim() || '-'

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex flex-col gap-4 flex-1">

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-snug truncate">{activity.title}</h3>
          </div>
          <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
            {cfg.label}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">

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
              : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {created.map((a) => <CreatedCard key={a.id} activity={a} />)}
              </div>
          )}

          {activeTab === 'joined' && (
            joined.length === 0
              ? <EmptyState message="You haven't joined any activities yet." />
              : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon icon="mdi:run-fast" className="text-3xl text-gray-300" />
      </div>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}

export default MyActivity