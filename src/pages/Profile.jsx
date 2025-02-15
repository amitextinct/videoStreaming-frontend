import { useState, useEffect } from 'react';
import { useUser } from '../context/useUser';
import { getCurrentUser, updateProfile, updateProfileImage, changePassword } from '../services/userService';
import { getSecureUrl } from '../utils/secureUrl';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    username: '',
    avatar: '',
    coverImage: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setProfileData(response.data);
        } else {
          toast.error(response.message || 'Failed to load profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile({
        fullName: profileData.fullName,
        email: profileData.email
      });
      
      if (response.success) {
        login(response.data);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpdate = async (type, file) => {
    try {
      const response = await updateProfileImage(type, file);
      if (response.success) {
        setProfileData(prev => ({
          ...prev,
          [type]: response.data[type]
        }));
        login(response.data);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
      } else {
        toast.error(response.message || `Failed to update ${type}`);
      }
    } catch {
      toast.error(`Failed to update ${type}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword(passwordData);
      if (response.success) {
        setPasswordData({ oldPassword: '', newPassword: '' });
        toast.success('Password changed successfully');
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch {
      toast.error('Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 pt-20 max-w-4xl">
        {/* Profile Header with Cover & Avatar */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            <img
              src={getSecureUrl(profileData.coverImage) || 'https://via.placeholder.com/1200x400'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpdate('coverImage', e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden relative bg-gray-200">
                <img
                  src={getSecureUrl(profileData.avatar) || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=random`}
                  alt={profileData.fullName}
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpdate('avatar', e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Profile
              </button>
            </form>

            {/* Password Change Form */}
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
