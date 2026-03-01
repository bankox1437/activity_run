import { useState } from 'react'
import './App.css'
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MyActivity from './pages/MyActivity';
import CreateActivity from './pages/CreateActivity';
import ActivityRequests from './pages/ActivityRequests';

import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="px-3 sm:px-6 lg:px-10 pt-16 max-w-screen-2xl mx-auto w-full flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/myActivity" element={<ProtectedRoute><MyActivity /></ProtectedRoute>} />
              <Route path="/createActivity" element={<ProtectedRoute><CreateActivity /></ProtectedRoute>} />
              <Route path="/activity/:id/requests" element={<ProtectedRoute><ActivityRequests /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
