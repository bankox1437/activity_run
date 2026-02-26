import React, { useState } from 'react'
import { Icon } from '@iconify/react'

const listType = [
  { id: 'all', name: 'All', icon: 'mdi:view-grid-outline' },
  { id: '5km', name: '5K', icon: 'mdi:run' },
  { id: '10km', name: '10K', icon: 'mdi:run-fast' },
  { id: 'half', name: 'Half Marathon', icon: 'mdi:road-variant' },
  { id: 'trail', name: 'Trail', icon: 'mdi:nature' },
]

function OptionActivity({ onChangeType }) {
  const [selected, setSelected] = useState('all')

  const handleClick = (type) => {
    onChangeType(type)
    setSelected(type)
  }

  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap gap-2">
        {listType.map((type) => (
          <button
            key={type.id}
            onClick={() => handleClick(type.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${selected === type.id
                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500'
              }`}
          >
            <Icon icon={type.icon} className="text-base" />
            {type.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OptionActivity