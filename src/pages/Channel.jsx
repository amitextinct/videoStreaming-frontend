import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Tab } from '@headlessui/react';
import { getChannelProfile, updateProfileImage } from '../services/channelService';
import { fetchTweets } from '../services/Services';
import ChannelHeader from '../components/channel/ChannelHeader';
import ChannelVideos from '../components/channel/ChannelVideos';
import ChannelTweetsList from '../components/channel/ChannelTweetsList';
import { useUser } from '../context/useUser';
import { toast } from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Channel() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [channel, setChannel] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannelData = async () => {
      try {
        setIsLoading(true);
        const [channelResponse, tweetsResponse] = await Promise.all([
          getChannelProfile(username),
          channel?._id ? fetchTweets(1, 10, channel._id) : null
        ].filter(Boolean));

        if (channelResponse.success) {
          setChannel(channelResponse.data);
          
          // Fetch tweets after we have the channel ID
          if (!channel?._id && channelResponse.data._id) {
            const tweetsData = await fetchTweets(1, 10, channelResponse.data._id);
            if (tweetsData.success) {
              setTweets(tweetsData.data);
            }
          }
        } else {
          toast.error(channelResponse.message);
          navigate('/404');
        }

        if (tweetsResponse?.success) {
          setTweets(tweetsResponse.data);
        }
      } catch {
        toast.error('Failed to load channel');
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    loadChannelData();
  }, [username, navigate, channel?._id]);

  const handleImageUpdate = async (type, file) => {
    if (!user || user._id !== channel._id) return;

    try {
      const response = await updateProfileImage(type, file);
      if (response.success) {
        setChannel(prev => ({
          ...prev,
          [type]: response.data[type]
        }));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error(`Failed to update ${type}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading channel...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      name: 'Videos', 
      content: channel && <ChannelVideos userId={channel._id} />
    },
    { 
      name: 'Tweets', 
      content: <ChannelTweetsList tweets={tweets} />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <ChannelHeader 
          channel={channel}
          onImageUpdate={handleImageUpdate}
        />
        
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
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              {tabs.map((tab, idx) => (
                <Tab.Panel key={idx}>{tab.content}</Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
