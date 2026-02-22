import React from 'react'

import Banner from '../assets/icon/banner_run.jpg'
import OptionActivity from './OptionActivity'
import CardActivity from './CardActivity'
function Home() {
  return (
    <div className="bg-[#F4F5FA] shadow-2xl rounded-t-sm p-5 home-container flex justify-center items-center flex-col">

      <div className="hero-banner object-cover rounded-md shadow-md w-[100%] relative ">
        <img src={Banner} alt="Banner" className="w-full h-full object-cover rounded-3xl" />
         <h1 className="text-center lg:text-7xl md:text-4xl sm:text-2xl font-bold mt-4 absolute bottom-15 left-20 ">WELCOME TO JOIN WITH US</h1>
      </div>

      <OptionActivity />
      <CardActivity />

    </div>
  )
}

export default Home