import { useEffect, useState } from 'react';
import axios from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';


function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get('/jobs/saved/');
        setSavedJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch saved jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`/jobs/${id}/save/`);
      setSavedJobs((prev) => prev.filter(job => job.id !== id));
    } catch (error) {
      console.error("Error unsaving job", error);
    }
  };

  if (loading) {
    return <p className="p-10 text-gray-500 text-center">Loading saved jobs...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen bg-background">

      <h1 className="section-heading">
        Saved Jobs
      </h1>

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
        <div className="grid gap-6">
          {savedJobs.map((job) => (

            <div
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="relative p-4 sm:p-6 flex flex-row items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            >

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(job.id);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-gray text-red-500 shadow sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition"
                title="Remove"
              >
                <FaTimes size={14} />
              </button>

              {/* Company Logo */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={job.logo_url || 'https://via.placeholder.com/64'}
                  alt={`${job.company} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Job Info */}
              <div className="ml-4 flex-1 min-w-[150px] text-left space-y-1">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-primary truncate transition-colors duration-300">
                  {job.title}
                </h2>
                <p className="text-xs sm:text-base text-gray-500 truncate">
                  {job.company} &nbsp;•&nbsp; {job.location}
                </p>

                <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm">
                  <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                    ₹ {job.ctc}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full tracking-wide font-semibold whitespace-nowrap">
                    {job.job_type}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}

export default SavedJobs;
