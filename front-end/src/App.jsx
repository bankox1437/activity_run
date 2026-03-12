import './App.css'
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MyActivity from './pages/MyActivity';
import CreateActivity from './pages/CreateActivity';
import ActivityRequests from './pages/ActivityRequests';
import UpdateActivity from './pages/UpdateActivity';
import ReviewActivity from './pages/ReviewActivity';
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { checkAuth } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-10 pt-16 pb-16 max-w-screen-2xl mx-auto w-full flex-1 bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/myActivity" element={<ProtectedRoute><MyActivity /></ProtectedRoute>} />
            <Route path="/createActivity" element={<ProtectedRoute><CreateActivity /></ProtectedRoute>} />
            <Route path="/activity/:id/requests" element={<ProtectedRoute><ActivityRequests /></ProtectedRoute>} />
            <Route path="/activity/:id/update" element={<ProtectedRoute><UpdateActivity /></ProtectedRoute>} />
            <Route path="/activity/:id/review" element={<ProtectedRoute><ReviewActivity /></ProtectedRoute>} />
            <Route path="/myProfile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
