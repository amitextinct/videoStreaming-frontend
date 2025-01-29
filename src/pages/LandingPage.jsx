import { useNavigate } from 'react-router';
import Footer from '../components/Footer';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Welcome to Video Streaming Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Stream your favorite content anytime, anywhere
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;