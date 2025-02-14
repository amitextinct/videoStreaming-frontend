import TweetFeed from '../components/tweets/TweetFeed';

function TweetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tweets</h1>
      <TweetFeed />
    </div>
  );
}

export default TweetsPage;
