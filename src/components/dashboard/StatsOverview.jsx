import PropTypes from 'prop-types';
import { EyeIcon, VideoCameraIcon, HeartIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value.toLocaleString()}</h3>
      </div>
      <Icon className={`w-12 h-12 ${colorClass} opacity-20`} />
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  colorClass: PropTypes.string.isRequired
};

export default function StatsOverview({ stats }) {
  const statCards = [
    { title: 'Total Views', value: stats.totalViews, icon: EyeIcon, colorClass: 'text-blue-500' },
    { title: 'Total Videos', value: stats.totalVideos, icon: VideoCameraIcon, colorClass: 'text-green-500' },
    { title: 'Total Likes', value: stats.totalLikes, icon: HeartIcon, colorClass: 'text-red-500' },
    { title: 'Subscribers', value: stats.totalSubscribers, icon: UserGroupIcon, colorClass: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map(card => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}

StatsOverview.propTypes = {
  stats: PropTypes.shape({
    totalViews: PropTypes.number.isRequired,
    totalVideos: PropTypes.number.isRequired,
    totalLikes: PropTypes.number.isRequired,
    totalSubscribers: PropTypes.number.isRequired
  }).isRequired
};
