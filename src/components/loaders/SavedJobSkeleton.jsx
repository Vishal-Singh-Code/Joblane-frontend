import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SavedJobSkeleton = ({ count = 3 , padding = 'p-20'}) => {
  return (
    <div className={`w-full px-4 sm:px-8 md:px-16 ${padding} grid gap-4 grid-cols-1`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-5 rounded-2xl border border-border shadow-sm bg-white"
        >
          {/* Logo Skeleton */}
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0">
            <Skeleton height={56} width={56} />
          </div>

          {/* Job Info Skeleton */}
          <div className="text-left flex-1 space-y-2">
            <Skeleton height={20} width="30%" />
            <div className="flex justify-between items-center">
              <Skeleton height={14} width="40%" />
              <Skeleton height={18} width={60} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton height={18} width={80} />
              <Skeleton height={18} width={80} />
              <Skeleton height={18} width={120} className="ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedJobSkeleton;
