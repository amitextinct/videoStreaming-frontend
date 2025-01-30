import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { UserProvider } from './context/UserContext'
import { VideoProvider } from './context/videoContext'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AuthWrapper from './components/AuthWrapper.jsx'
import NotFound from './pages/NotFound.jsx'
import WorkInProgress from './pages/WorkInProgress.jsx'
import Watching from './pages/Watching.jsx' // Add this import

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={
        <AuthWrapper>
          <Home />
          <LandingPage />
        </AuthWrapper>
      } />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="wip" element={<WorkInProgress />} />
      <Route path="watch/:videoId" element={<Watching />} /> {/* Add this route */}
      <Route path="*" element={<NotFound />} /> {/* Add this catch-all route */}
    </Route>
  )
)

const root = createRoot(document.getElementById('root'))
root.render(
  <UserProvider>
    <VideoProvider>
      <RouterProvider router={router} />
    </VideoProvider>
  </UserProvider>
)
