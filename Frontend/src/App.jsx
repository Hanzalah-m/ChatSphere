import './App.css'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useAuth } from './feature/auth/hooks/useAuth'
// import AuthProvider from './auth/state/authContext'

function App() {
  const { fetchCurrentUser } = useAuth()

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
