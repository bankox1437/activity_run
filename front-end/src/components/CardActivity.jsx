import React from 'react'

import imgCard from '../assets/cards_img/card_run.jpg'
import { Icon } from "@iconify/react";
function CardActivity() {

    const activities = [
        {
            id: 1,
            title: 'City Night Run 2026',
            location: 'Bangkok',
            distance: '25 angkal',
            date: '10 Jan 2026',
            image: imgCard
        },
         {
            id: 2,
            title: 'City Night Run 2026',
            location: 'Bangkok',
            distance: '25 angkal',
            date: '10 Jan 2026',
            image: imgCard
        },
        {
            id: 3,
            title: 'City Night Run 2026',
            location: 'Bangkok',
            distance: '25 angkal',
            date: '10 Jan 2026',
            image: imgCard
        },
        {
            id: 4,
            title: 'City Night Run 2026',
            location: 'Bangkok',
            distance: '25 angkal',
            date: '10 Jan 2026',
            image: imgCard
        },
    ]
  return (
    <div> 
        <div className='card_activity grid grid-cols-3 grid-flow-col md:grid-flow-row gap-4 mt-5'>
            
                
                {activities.map(activity => (
                    <div className='card_item w-80 bg-white rounded-lg shadow-md' key={activity.id}>
                        <img src={activity.image} alt={activity.title} className="w-full h-50 object-cover rounded-t-lg" />
                        <div className="details flex flex-col items-start justify-start mt-2 mb-2 px-4">
                            <h1 className="font-bold text-2xl">{activity.title}</h1>
                            <span className="text-center text-sm text-gray-600 mt-1"> 
                                <Icon icon="mdi:map-marker" className="inline-block mr-1 text-gray-500" />
                                {activity.location}
                                </span>
                            <span className="text-center text-sm text-gray-600 mt-1">
                                <Icon icon="mdi:calendar" className="inline-block mr-1 text-gray-500" />
                                {activity.distance}
                            </span>
                            <span className="text-center text-sm text-gray-600 mt-1">
                                <Icon icon="mdi:clock" className="inline-block mr-1 text-gray-500" />
                                {activity.date}
                            </span>
                            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition duration-300">Join Run</button>
                        </div> 
                    </div>
                ))}

        
        </div>
           
    </div>
    
  )
}

export default CardActivity