import { Outlet, useLocation } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useEffect } from 'react';
import useVideo from './context/useVideo';

export default function Layout() {
  const location = useLocation();
  const { clearVideos } = useVideo();

  useEffect(() => {
    if (location.pathname === '/search') {
      clearVideos();
    }
  }, [location.pathname, clearVideos]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
