import { useEffect, useState } from 'react';
import axiosJob from '../../api/axiosJob';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { Clock, Briefcase } from 'lucide-react';
import SavedJobSkeleton from '../../components/loaders/SavedJobSkeleton'

function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axiosJob.get('/saved/');
        setSavedJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch saved jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axiosJob.delete(`/jobs/${id}/save/`);
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error('Error unsaving job', error);
    }
  };

  if (loading) {
    return <SavedJobSkeleton />
  }

  return (
    <div className="bg-background min-h-screen mx-auto p-6">
      <h1 className="section-heading">Saved Jobs</h1>
      <p className="text-muted-foreground text-sm sm:text-lg text-center pb-6">
        Review your saved job listings below.
      </p>

      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-24 text-gray-600">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
            alt="No saved jobs"
            className="w-28 h-28 mb-6 opacity-70"
          />
          <p className="text-2xl font-semibold mb-1">No Saved Jobs</p>
          <p className="text-sm">Explore opportunities and save jobs to view them later.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl grid gap-4 grid-cols-1">
          {savedJobs.map((job) => {
            const isOpen = new Date(job.deadline) > new Date();

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="relative flex items-center gap-4 p-5 rounded-2xl border border-border shadow-sm hover:shadow-md bg-white transition cursor-pointer group"
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(job.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-gray text-gray-500 shadow sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition cursor-pointer"
                  title="Remove"
                >
                  <FaTimes size={12} />
                </button>

                {/* Company Logo */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 ">
                  <img
                    src={job.logo_url || `https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s+/g, '')}.com`}
                    alt={`${job.company} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Job Content */}
                <div className="flex-1 min-w-[150px] text-left space-y-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-base sm:text-xl font-semibold text-gray-800 group-hover:text-primary transition">
                      {job.title}
                    </h2>

                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {job.company}
                    </p>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-2 text-xs pt-2 text-gray-600">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-muted px-3 py-1 rounded-full border border-border">{job.ctc}</span>
                      <span className="bg-muted px-3 py-1 rounded-full border border-border">{job.job_type}</span>

                    </div>

                    <span className="hidden sm:flex flex items-center gap-1 ml-auto">
                      <Clock className="w-4 h-4" /> Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;
