import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosJob from '../../api/axiosJob';
import { Briefcase } from 'lucide-react';
import SavedJobSkeleton from '../../components/loaders/SavedJobSkeleton'


function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axiosJob.get('/applied/');
        setApplications(response.data.results);
      } catch (error) {
        console.error('Failed to fetch your applied jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  if (loading) {
    return <SavedJobSkeleton />
  }

  return (
    <div className="bg-background px-4 py-4  min-h-screen font-inter">
      <h1 className="section-heading ">Your Applications</h1>
      <p className="text-muted-foreground text-sm sm:text-lg text-center pb-6">
        View the jobs you’ve applied to and monitor their progress.
      </p>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
            alt="No Applications"
            className="w-28 h-28 opacity-70 mb-4"
          />
          <p className="text-xl font-semibold">No Applications Yet</p>
          <p className="text-sm text-gray-500">
            Apply to jobs and they'll show up here.
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {applications.map((application) => {
            const { job, status, applied_at } = application;

            return (
              <div
                key={application.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="p-4 sm:p-6 bg-card rounded-2xl border border-border shadow hover:shadow-lg transition-all duration-200 flex flex-row items-center gap-4 sm:gap-6 cursor-pointer group"
              >
                {/* Logo */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={job.company_logo || 'https://via.placeholder.com/40'}
                    alt={`${job.company_name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-[150px] text-left space-y-1">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary truncate">
                    {job.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {job.company_name}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-xs pt-2">
                    <span className="bg-muted px-3 py-1 rounded-full border border-border">
                      {job.ctc}
                    </span>
                    <span className="bg-muted px-3 py-1 rounded-full border border-border">
                      {job.job_type}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-end justify-center gap-1 min-w-[90px] text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs sm:text-xs font-semibold 
                      ${status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {status || 'Pending'}
                  </span>

                  {applied_at && (
                    <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap pt-1">
                      Applied on{' '}
                      {new Date(applied_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Applications;
