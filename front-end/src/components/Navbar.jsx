import React from 'react'

import '../styles/Navbar.css'
import Logo from '../assets/icon/run_life.jpg'
import { Icon } from "@iconify/react";

function Navbar() {
  return (
    <>
       <div className="bg-white text-gray-800 p-4 rounded-md shadow-md flex items-center justify-between">
        {/* <h1 className="text-xl font-bold"></h1> */}
            <div className="logo w-50">
                <img src={Logo} alt="Logo" className="w-auto object-fit" />
            </div>
            <div className="nav-links flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-800">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">Activities</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">About Us</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            </div>
            <div className="login-profile">
                <Icon icon="mdi:account" className="inline-block mr-1 text-gray-500 text-2xl" />
                <a href="#" className="text-gray-600 hover:text-gray-800">Login</a>
            </div>
        </div>
        
        
    </>
  )
}

export default Navbar