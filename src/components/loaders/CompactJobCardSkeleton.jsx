import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CompactJobCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl border border-border shadow h-full flex flex-col gap-4 animate-pulse"
        >
          {/* Top: Title + Company + Logo */}
          <div className="text-left flex justify-between items-start">
            <div className="flex-1 pr-4 space-y-2">
              <Skeleton height={25} width="70%" />
              <Skeleton height={16} width="50%" />
            </div>
            <Skeleton height={60} width={60} circle />
          </div>

          {/* Tags: Location, Salary, Type, Experience */}
          <div className="flex flex-col gap-2 text-sm text-left text-muted-foreground">
            <Skeleton height={16} width="30%" />
            <Skeleton height={16} width="35%" />
            <Skeleton height={16} width="30%" />
            <Skeleton height={16} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompactJobCardSkeleton;
