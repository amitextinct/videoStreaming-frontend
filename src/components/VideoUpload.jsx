import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { uploadVideo } from '../services/videoService';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function VideoUpload({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null
  });
  const [previews, setPreviews] = useState({
    video: null,
    thumbnail: null
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [type === 'video' ? 'videoFile' : 'thumbnail']: file
    }));

    const fileUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [type]: fileUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoFile || !formData.thumbnail) {
      toast.error('Please select both video and thumbnail files');
      return;
    }

    setIsLoading(true);
    const response = await uploadVideo(formData);
    setIsLoading(false);

    if (response.success) {
      toast.success('Video uploaded successfully');
      onSuccess(response.data);
      onClose();
    } else {
      toast.error(response.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upload Video</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="hidden"
                id="videoFile"
              />
              <label
                htmlFor="videoFile"
                className="relative block aspect-video rounded-lg border-2 border-dashed border-gray-300 
                         hover:border-blue-500 cursor-pointer overflow-hidden"
              >
                {previews.video ? (
                  <video
                    src={previews.video}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Click to upload video
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="hidden"
                id="thumbnail"
              />
              <label
                htmlFor="thumbnail"
                className="relative block aspect-video rounded-lg border-2 border-dashed border-gray-300 
                         hover:border-blue-500 cursor-pointer overflow-hidden"
              >
                {previews.thumbnail ? (
                  <img
                    src={previews.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Click to upload thumbnail
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Video Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
              required
            />

            <textarea
              placeholder="Video Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent min-h-[100px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

VideoUpload.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};
