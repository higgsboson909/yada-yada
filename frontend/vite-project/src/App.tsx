import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AUTH_TOKEN_KEY, UNAUTHORIZED_EVENT } from './api'
import { Auth } from './components/Auth'
import { Workspace } from './components/Workspace'

function AppRoutes() {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY))

  useEffect(() => {
    const clearAuthentication = () => setToken(null)
    window.addEventListener(UNAUTHORIZED_EVENT, clearAuthentication)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, clearAuthentication)
  }, [])

  const authenticate = (accessToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
    setToken(accessToken)
  }
  const clearAuthentication = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken(null)
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/app' : '/login'} replace />} />
      <Route path="/login" element={token ? <Navigate to="/app" replace /> : <Auth onAuthenticated={authenticate} />} />
      <Route path="/signup" element={token ? <Navigate to="/app" replace /> : <Auth signup onAuthenticated={authenticate} />} />
      <Route path="/app" element={token ? <Workspace onLoggedOut={clearAuthentication} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={token ? '/app' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}
