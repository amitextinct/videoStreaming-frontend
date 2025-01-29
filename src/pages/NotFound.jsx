import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="max-w-xl text-center">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">Page not found</h2>
        <p className="mt-4 text-lg text-gray-600">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Go back home
          </button>
        </div>
      </div>
    </div>
  );
}
