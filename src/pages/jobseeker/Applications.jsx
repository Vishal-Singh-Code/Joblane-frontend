import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function Applications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    axios.get('/jobs/applied/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error('Failed to load applications:', err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-background min-h-screen font-inter">

      <h1 className="section-heading">Your Applications</h1>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
            alt="No Applications"
            className="w-28 h-28 opacity-70 mb-4"
          />
          <p className="text-xl font-semibold">No Applications Yet</p>
          <p className="text-sm text-gray-500">Apply to jobs and they'll show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="p-4 sm:p-6 bg-card rounded-2xl border border-border shadow hover:shadow-lg transition-all duration-200 flex flex-row items-center gap-4 sm:gap-6 cursor-pointer group"
            >
              {/* Logo */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                <img
                  src={job.logo_url || 'https://via.placeholder.com/40'}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-[150px] text-left space-y-1">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground group-hover:text-primary truncate">
                  {job.title}
                </h2>
                <p className="text-xs sm:text-base text-muted-foreground truncate">
                  {job.company} &nbsp;•&nbsp; {job.location}
                </p>

                <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-xs">
                  <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                    ₹{job.ctc}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full tracking-wide font-semibold whitespace-nowrap">
                    {job.job_type}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-end justify-center gap-1 min-w-[90px] text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs sm:text-xs font-semibold 
            ${job.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : job.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {job.status || 'Pending'}
                </span>

                {job.applied_at && (
                  <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                    Applied on {new Date(job.applied_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Applications;
