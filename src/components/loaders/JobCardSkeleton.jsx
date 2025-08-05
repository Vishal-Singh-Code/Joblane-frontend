import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JobCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-5 bg-white rounded-2xl shadow-md border border-border h-full flex flex-col justify-between animate-pulse"
        >
          {/* Top Section: Title + Company + Logo */}
          <div className="flex text-left mb-4">
            <div className="flex-grow pr-2 space-y-2">
              <Skeleton height={20} width="40%" />
              <Skeleton height={16} width="30%" />
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12">
              <Skeleton height="100%" width="100%" circle />
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm mt-2">
            {[80, 60, 70].map((width, i) => (
              <Skeleton
                key={i}
                height={24}
                width={width}
                style={{ borderRadius: '9999px' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobCardSkeleton;
