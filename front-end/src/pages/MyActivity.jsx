import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'

// ── Mock data ────────────────────────────────────────────────────────────────
const myCreatedActivities = [
  {
    id: 1,
    title: 'Sunday Morning Run',
    location: 'Lumpini Park, Bangkok',
    date: '25/04/2026',
    time: '05:30 AM',
    raceType: 'City Run',
    participants: 8,
    description: 'Easy 5 km loop around the park. All paces welcome!',
  },
  {
    id: 2,
    title: 'Mountain Trail Challenge',
    location: 'Doi Inthanon, Chiang Mai',
    date: '10/05/2026',
    time: '06:00 AM',
    raceType: 'Trail Run',
    participants: 15,
    description: 'Scenic trail run through the forest. Intermediate difficulty.',
  },
]

const myJoinedActivities = [
  {
    id: 3,
    title: 'City Marathon Training',
    location: 'Benjakitti Park, Bangkok',
    date: '30/04/2026',
    time: '05:00 AM',
    raceType: 'City Run',
    organizer: 'Run Bangkok Club',
    status: 'accepted',
  },
  {
    id: 4,
    title: 'Night Run BKK',
    location: 'Rama IX Park, Bangkok',
    date: '05/05/2026',
    time: '07:30 PM',
    raceType: 'City Run',
    organizer: 'BKK Runners',
    status: 'pending',
  },
  {
    id: 5,
    title: 'River Trail Run',
    location: 'Mae Klong, Ratchaburi',
    date: '15/05/2026',
    time: '06:00 AM',
    raceType: 'Trail Run',
    organizer: 'Trail Seekers',
    status: 'rejected',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
const raceTypeColor = {
  'City Run': 'bg-blue-100 text-blue-600',
  'Trail Run': 'bg-green-100 text-green-600',
  Other: 'bg-gray-100 text-gray-600',
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: 'mdi:clock-outline',
    cls: 'bg-yellow-100 text-yellow-600',
  },
  accepted: {
    label: 'Accepted',
    icon: 'mdi:check-circle-outline',
    cls: 'bg-green-100 text-green-600',
  },
  rejected: {
    label: 'Rejected',
    icon: 'mdi:close-circle-outline',
    cls: 'bg-red-100 text-red-500',
  },
}

// ── Sub-components ───────────────────────────────────────────────────────────
function CreatedCard({ activity }) {

  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-snug">
          {activity.title}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${raceTypeColor[activity.raceType] ?? 'bg-gray-100 text-gray-500'}`}
        >
          {activity.raceType}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Icon icon="mdi:map-marker-outline" />
          {activity.location}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:calendar-outline" />
          {activity.date}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:clock-outline" />
          {activity.time}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:account-group-outline" />
          {activity.participants} joined
        </span>
      </div>

      {activity.description && (
        <p className="text-xs text-gray-400 line-clamp-2">{activity.description}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button className="flex-1 py-2 rounded-full border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
          View Details
        </button>
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
  const cfg = statusConfig[activity.status]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-snug">
          {activity.title}
        </h3>
        {/* Status Badge */}
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.cls}`}
        >
          <Icon icon={cfg.icon} className="text-sm" />
          {cfg.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Icon icon="mdi:map-marker-outline" />
          {activity.location}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:calendar-outline" />
          {activity.date}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="mdi:clock-outline" />
          {activity.time}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Icon icon="mdi:account-outline" />
        Organized by <span className="font-medium text-gray-600 ml-0.5">{activity.organizer}</span>
      </div>

      {/* Race type tag */}
      <div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${raceTypeColor[activity.raceType] ?? 'bg-gray-100 text-gray-500'}`}
        >
          {activity.raceType}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button className="flex-1 py-2 rounded-full border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
          View Details
        </button>
        {activity.status === 'pending' && (
          <button className="flex-1 py-2 rounded-full border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition">
            Cancel Request
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function MyActivity() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('created')

  return (
    <div className="min-h-screen bg-white p-4 max-w-4xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Activity</h1>
        <button
          onClick={() => navigate('/createActivity')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition shadow-sm"
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Add Activity
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-full p-1 mb-6 w-fit">
        {[
          { key: 'created', label: 'Created', icon: 'mdi:pencil-outline', count: myCreatedActivities.length },
          { key: 'joined', label: 'Joined', icon: 'mdi:account-plus-outline', count: myJoinedActivities.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Icon icon={tab.icon} />
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'created' && (
        <>
          {myCreatedActivities.length === 0 ? (
            <EmptyState message="You haven't created any activities yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCreatedActivities.map((a) => (
                <CreatedCard key={a.id} activity={a} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'joined' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = myJoinedActivities.filter((a) => a.status === key).length
              return (
                <span
                  key={key}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${cfg.cls}`}
                >
                  <Icon icon={cfg.icon} />
                  {cfg.label}: {count}
                </span>
              )
            })}
          </div>

          {myJoinedActivities.length === 0 ? (
            <EmptyState message="You haven't joined any activities yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myJoinedActivities.map((a) => (
                <JoinedCard key={a.id} activity={a} />
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
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Icon icon="mdi:run-fast" className="text-6xl mb-3 text-gray-300" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default MyActivity