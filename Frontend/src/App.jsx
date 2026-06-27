import './App.css'
import {RouterProvider} from 'react-router-dom'
import {router} from './routes'
import AuthProvider from './auth/state/authContext'


function App() {

  return (
    <>

    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
      
    </>
  )
}

export default App
