import React, { useState, useEffect } from 'react'
import axios from 'axios'

const apiURL = import.meta.env.VITE_API_URL

function OptionActivity({ onChangeType }) {
  const [selected, setSelected] = useState('all')
  const [raceTypes, setRaceTypes] = useState([])

  useEffect(() => {
    axios.get(`${apiURL}activity/getRaceType`)
      .then(res => setRaceTypes(res.data.data || []))
      .catch(() => { })
  }, [])

  const handleClick = (type) => {
    onChangeType(type)
    setSelected(type)
  }

  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap gap-2">

        <button
          onClick={() => handleClick('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${selected === 'all'
            ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
            }`}
        >
          All
        </button>

        {raceTypes.map((rt) => (
          <button
            key={rt.race_type_id}
            onClick={() => handleClick(rt.race_type_name)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${selected === rt.race_type_name
              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
              }`}
          >
            {rt.race_type_name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OptionActivity