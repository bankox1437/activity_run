import React from 'react'

function OptionActivity() {

  const listType = [
        {
            id: 1,
            name: 'All'
        },
        { 
            id: 2,
            name: 'Road'
        },
        {
            id: 3,
            name: 'Trail'
        },
        {
            id: 4,
            name: '5K'
        }   
      ,  {
            id: 5,
            name: '10K'
          },
        {
            id: 6,
            name: 'Half Marathon'
        },
        {
            id: 7,  
            name: 'Marathon'
        }
      ];

  return (
    <div>
        <div className="list-type mt-5 mb-5">
          <ul className="flex gap-4">
            {listType.map(type => (
              <li key={type.id} className="bg-gray-200 text-gray-600 hover:text-gray-50 font-bold px-4 py-2 rounded-lg shadow-md cursor-pointer hover:bg-blue-500 transition duration-300">
                {type.name}
              </li>
            ))}
          </ul>
        </div>
    </div>
  )
}

export default OptionActivity