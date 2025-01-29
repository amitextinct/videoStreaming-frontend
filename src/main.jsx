import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { UserProvider } from './context/UserContext'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="login" element={<Login />} />
    </Route>
  )
)

const root = createRoot(document.getElementById('root'))
root.render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
)
