import TweetFeed from '../components/tweets/TweetFeed';

function ProfilePage() {
  const userId = '123'; // Example user ID

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="profile-header">
        <h1 className="text-3xl font-bold">User Profile</h1>
        {/* ...other profile details... */}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Tweets</h2>
        <TweetFeed userId={userId} />
      </div>
    </div>
  );
}

export default ProfilePage;
