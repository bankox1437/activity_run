import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {return <p className='flex justify-center'>Loading...</p>}
  if (!user) return <Navigate to="/" />

  return children
}