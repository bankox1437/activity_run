import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth)

  if (loading) return <p className='flex justify-center'>Loading...</p>
  if (!user) return <Navigate to="/" />

  return children
}