import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Tab } from '@headlessui/react';
import { getChannelProfile, updateProfileImage } from '../services/channelService';
import ChannelHeader from '../components/channel/ChannelHeader';
import VideosList from '../components/dashboard/VideosList';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannel = async () => {
      try {
        setIsLoading(true);
        const response = await getChannelProfile(username);
        if (response.success) {
          setChannel(response.data);
        } else {
          toast.error(response.message);
          navigate('/404');
        }
      } catch {
        toast.error('Failed to load channel');
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    loadChannel();
  }, [username, navigate]);

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
    { name: 'Videos', content: <VideosList videos={[]} /> },
    { name: 'About', content: <div className="p-4">Channel description and details</div> }
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
