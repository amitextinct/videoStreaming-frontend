import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './context/UserContext'
import { VideoProvider } from './context/videoContext'
import { LikeProvider } from './context/LikeContext'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AuthWrapper from './components/AuthWrapper.jsx'
import NotFound from './pages/NotFound.jsx'
import WorkInProgress from './pages/WorkInProgress.jsx'
import Watching from './pages/Watching.jsx'
import Search from './pages/Search.jsx'
import Tweets from './pages/Tweets.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Channel from './pages/Channel.jsx'
import Profile from './pages/Profile.jsx'
import './index.css'

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
      <Route path="search" element={<Search />} />
      <Route path="tweets" element={<Tweets />} />
      <Route path="wip" element={<WorkInProgress />} />
      <Route path="watch/:videoId" element={<Watching />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="channel/:username" element={<Channel />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const root = createRoot(document.getElementById('root'))
root.render(
  <UserProvider>
    <VideoProvider>
      <LikeProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 24px',
            },
            success: {
              icon: '👍',
              style: {
                background: '#4ade80',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </LikeProvider>
    </VideoProvider>
  </UserProvider>
)
