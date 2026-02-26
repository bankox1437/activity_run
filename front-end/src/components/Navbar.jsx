import React, { useState } from 'react'
import '../styles/Navbar.css'
import Logo from '../assets/icon/run_life.jpg'
import { Icon } from "@iconify/react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showJoinEvent,setShowJoinEvent] = useState(false);

  return (
    <>
      <div className="bg-white text-gray-800 px-4 py-3 rounded-md shadow-md">
        {/* Top row */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="logo w-32 sm:w-40">
            <img src={Logo} alt="Logo" className="w-auto object-contain" />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Home</a>
            <a href="/myActivity" className="text-gray-600 hover:text-blue-500 transition duration-200">All Races</a>
            <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Community</a>
          </div>

          {/* Desktop login */}
          <div className="hidden md:flex items-center gap-1">
            <Icon icon="mdi:account" className="text-gray-500 text-2xl" />
            <a href="/login" className="text-gray-600 hover:text-blue-500 transition duration-200">Login</a>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} className="text-2xl" />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-3 mt-3 border-t pt-3">
            {showJoinEvent && (
              <>
              <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Home</a>
                <a href="/myActivity" className="text-gray-600 hover:text-blue-500 transition duration-200">All Races</a>
                <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Community</a>
              </>
                 )}
          
            <div className="flex items-center gap-1">
              <Icon icon="mdi:account" className="text-gray-500 text-2xl" />
              <a href="/login" className="text-gray-600 hover:text-blue-500 transition duration-200">Login</a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar