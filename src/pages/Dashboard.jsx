import { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { fetchChannelStats, fetchChannelVideos } from '../services/dashboardService';
import { getUserTweets } from '../services/Services';
import StatsOverview from '../components/dashboard/StatsOverview';
import ProfileHeader from '../components/dashboard/ProfileHeader';
import VideosList from '../components/dashboard/VideosList';
import TweetsList from '../components/dashboard/TweetsList';
import { useUser } from '../context/useUser';
import { toast } from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalVideos: 0,
    totalLikes: 0,
    totalSubscribers: 0
  });
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { name: 'Videos', count: videos.length },
    { name: 'Tweets', count: tweets.length }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsResponse, videosResponse, tweetsResponse] = await Promise.all([
          fetchChannelStats(),
          fetchChannelVideos(),
          getUserTweets(user._id)
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        if (videosResponse.success) {
          setVideos(videosResponse.data);
        }
        if (tweetsResponse.success) {
          setTweets(tweetsResponse.data);
        }
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      loadDashboardData();
    }
  }, [user?._id]);

  const handleVideoUpdate = useCallback((videoId, updates) => {
    setVideos(prev => prev.map(video => 
      video._id === videoId ? { ...video, ...updates } : video
    ));
  }, []);

  const handleTweetDelete = useCallback((tweetId) => {
    setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader user={user} />
        <StatsOverview stats={stats} />
        
        <div className="mt-6">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-blue-500 text-white shadow'
                        : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                    )
                  }
                >
                  {tab.name} ({tab.count})
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel>
                <VideosList videos={videos} onVideoUpdate={handleVideoUpdate} />
              </Tab.Panel>
              <Tab.Panel>
                <TweetsList tweets={tweets} onTweetDelete={handleTweetDelete} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
