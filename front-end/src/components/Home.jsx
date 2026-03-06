import React, { useContext } from 'react'
import Banner from '../assets/icon/banner_run.jpg'
import OptionActivity from './OptionActivity'
import CardActivity from './CardActivity'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { AuthContext } from '../context/AuthContext'

function Home() {
  const [raceType, setRaceType] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const navigate = useNavigate()
  const { user, loading } = useContext(AuthContext)

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-6xl mx-auto">

      <div className="w-full relative rounded-2xl overflow-hidden shadow-md">
        <img
          src={Banner}
          alt="Banner"
          className="w-full h-52 sm:h-72 md:h-88 lg:h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10">

          <h1 className="text-white font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg">
            Find Your Next<br className="hidden sm:block" /> Run Activity
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            {user && (
              <button
                onClick={() => navigate('/myActivity')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold rounded-full transition border border-white/30 cursor-pointer"
              >
                <Icon icon="mdi:account-outline" className="text-lg" />
                My Activity
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Activities</h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Icon
                icon="mdi:calendar-search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Icon icon="mdi:close-circle" />
                </button>
              )}
            </div>
          </div>
        </div>

        <OptionActivity onChangeType={setRaceType} />
        <CardActivity raceType={raceType} selectedDate={selectedDate} />
      </div>

    </div>
  )
}

export default Home