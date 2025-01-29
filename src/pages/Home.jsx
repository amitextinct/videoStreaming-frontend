import { useUser } from '../context/useUser';
import '../index.css';

function Home() {
  const { user } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {user?.fullName || 'User'}!
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          You have successfully logged in to your account.
        </p>
      </div>
    </div>
  );
}

export default Home;