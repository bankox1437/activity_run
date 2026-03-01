import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const apiURL = import.meta.env.VITE_API_URL

const raceTypeColor = {
  '5k': 'bg-blue-100 text-blue-600',
  '10k': 'bg-green-100 text-green-600',
  'half': 'bg-purple-100 text-purple-600',
  'full': 'bg-red-100 text-red-600',
  'trail': 'bg-orange-100 text-orange-600',
}

const statusConfig = {
  0: { label: 'Pending', icon: 'mdi:clock-outline', cls: 'bg-yellow-100 text-yellow-600' },
  1: { label: 'Accepted', icon: 'mdi:check-circle-outline', cls: 'bg-green-100 text-green-600' },
  2: { label: 'Rejected', icon: 'mdi:close-circle-outline', cls: 'bg-red-100 text-red-500' },
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-snug">{activity.title}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${raceTypeColor[activity.type_race_name] ?? 'bg-gray-100 text-gray-500'}`}>
          {activity.type_race_name ?? '-'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Icon icon="mdi:map-marker-outline" />
          {activity.location || '-'}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:calendar-outline" />
          {formatDate(activity.datetime)}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:clock-outline" />
          {formatTime(activity.datetime)}
        </span>
        {activity.participant_count > 0 && (
          <span className="flex items-center gap-1">
            <Icon icon="mdi:account-group-outline" />
            {activity.participant_count} joined
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-1">
        <button
          onClick={() => navigate(`/activity/${activity.id}/requests`)}
          className="flex-1 py-2 rounded-full bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
        >
          Manage
        </button>
      </div>
    </div>
  )
}

function JoinedCard({ activity }) {

  const statusKey = Number(activity.status) // 0, 1, 2
  const cfg = statusConfig[statusKey] ?? statusConfig[0]
  const organizer = `${activity.organizer_first ?? ''} ${activity.organizer_last ?? ''}`.trim() || '-'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-snug">{activity.title}</h3>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.cls}`}>
          <Icon icon={cfg.icon} className="text-sm" />
          {cfg.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Icon icon="mdi:map-marker-outline" />
          {activity.location || '-'}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:calendar-outline" />
          {formatDate(activity.datetime)}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:clock-outline" />
          {formatTime(activity.datetime)}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Icon icon="mdi:account-outline" />
        <span className="font-medium text-gray-600 ml-0.5">{organizer}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${raceTypeColor[activity.type_race_name] ?? 'bg-gray-100 text-gray-500'}`}>
          {activity.type_race_name ?? '-'}
        </span>
      </div>
    </div >
  )
}

function MyActivity() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('created')

  const [created, setCreated] = useState([])
  const [joined, setJoined] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  return (
    <div className="min-h-screen bg-white p-4 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-6">
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
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
              }`}
          >
            <Icon icon={tab.icon} className="text-base" />
            {tab.label}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
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
              : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {joined.map((a) => <JoinedCard key={a.join_id} activity={a} />)}
              </div>
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Icon icon="mdi:run-fast" className="text-6xl mb-3 text-gray-300" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default MyActivity