import React, { useState, useContext } from 'react'
import '../styles/Navbar.css'
import Logo from '../assets/icon/run_life.jpg'
import { Icon } from "@iconify/react";
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <div className="bg-white text-gray-800 px-4 py-3 rounded-md shadow-md relative">
    
        <div className="flex items-center justify-between">
      
          <div className="logo w-32 sm:w-40">
            <img src={Logo} alt="Logo" className="w-auto object-contain" />
          </div>

          {/* Desktop */}
          <div className="hidden md:flex gap-6">
            {user && (
              <>
                <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Home</a>
                <a href="/myActivity" className="text-gray-600 hover:text-blue-500 transition duration-200">Activity</a>
                {/* <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Community</a> */}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Icon icon="mdi:account-circle" className="text-gray-500 text-lg" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.first_name} {user.last_name}
                  </span>
                </div>

                <div className="h-5 w-px bg-gray-200" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition font-medium"
                >
                  <Icon icon="mdi:logout-variant" className="text-base" />
                  Logout
                </button>
              </>
            ) : (
              <a href="/login" className="text-gray-600 hover:text-blue-500 transition duration-200">Login</a>
            )}
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

        {/* Mobile */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-3 mt-3 border-t pt-3">
            {user && (
              <>
                <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Home</a>
                <a href="/myActivity" className="text-gray-600 hover:text-blue-500 transition duration-200">Activity</a>
                {/* <a href="/" className="text-gray-600 hover:text-blue-500 transition duration-200">Community</a> */}
              </>
            )}

            <div className="flex items-center gap-2">
              <Icon icon="mdi:account" className="text-gray-500 text-2xl" />
              {user ? (
                <>
                  <p className="text-sm">{user.first_name} {user.last_name}</p>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition font-medium ml-auto"
                  >
                    <Icon icon="mdi:logout" className="text-base" />
                    Logout
                  </button>
                </>
              ) : (
                <a href="/login" className="text-gray-600 hover:text-blue-500 transition duration-200">Login</a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar