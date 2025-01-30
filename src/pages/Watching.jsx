import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getVideoById } from '../services/Services';
import VideoPlayer from '../components/VideoPlayer';
import Skeletal from '../components/Skeletal';

export default function Watching() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);
        if (response.success) {
          setVideo(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (isLoading) return <Skeletal />;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!video) return <div className="text-center p-4">Video not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-20"> {/* Added pt-20 for navbar space */}
      <VideoPlayer videoUrl={video.videoFile} title={video.title} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600">{video.views} views</p>
          <p className="text-gray-600">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="mt-4 text-gray-700">{video.description}</p>
      </div>
    </div>
  );
}
