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

function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="px-3 sm:px-6 lg:px-10 pt-3 max-w-screen-2xl mx-auto w-full">
          <Navbar />
        </div>
        <div className="px-3 sm:px-6 lg:px-10 mt-4 max-w-screen-2xl mx-auto w-full flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/myActivity" element={<MyActivity />} />
            <Route path="/createActivity" element={<CreateActivity />} />
            <Route path="/activity/:id/requests" element={<ActivityRequests />} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
