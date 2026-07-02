import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'
import { useCart } from '../features/cart/hook/useCart'
import { useEffect } from 'react'


function App() {


  const { handleGetMe } = useAuth()
  const { handleGetCart } = useCart()

  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    handleGetMe()
  }, [])

  useEffect(() => {
    if (user) {
      handleGetCart()
    }
  }, [user])

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
