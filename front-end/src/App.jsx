import { useState } from 'react'
import './App.css'
import Home from './components/Home';

import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {

  return (
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="col mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
  )
}

export default App
