import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosJob from '../../api/axiosJob';
import { Briefcase, Users, CalendarCheck, Clock } from 'lucide-react';
import { FaSearch } from 'react-icons/fa';
import SavedJobSkeleton from '../../components/loaders/SavedJobSkeleton'

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('#');
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axiosJob
      .get("/recruiter/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Failed to fetch jobs", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs
    .filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOption === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortOption === 'applicants') {
        return b.applicant_count - a.applicant_count;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (loading){
    return <SavedJobSkeleton count={5}  />
  }

  return (
    <div className="bg-background p-6">
      <h1 className="section-heading mb-6">Your Job Posts</h1>
      <p className="text-muted-foreground text-sm sm:text-lg text-center">Easily manage all your job postings, track applicants, and keep your listings up to date.</p>

      <div className="max-w-5xl mx-auto flex flex-row items-center gap-2 sm:gap-4 mb-6 mt-6 flex-wrap">

        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
          className="text-sm sm:text-base bg-white border border-gray-300 px-2 py-3 rounded-lg shadow-sm w-[90px] bg-no-repeat bg-right"
        >
          <option value="#" disabled>Sort By</option>
          <option value="newest">Newest First</option>
          <option value="deadline">Deadline</option>
          <option value="applicants">Applicants</option>
        </select>


        <div className="relative flex-1 min-w-[180px]">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none text-sm sm:text-base"
          />
        </div>

      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-4 grid-cols-1">
          {paginatedJobs.map((job) => {
            const isOpen = new Date(job.deadline) > new Date();

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}
                className="rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition bg-white cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary">
                    {job.title}
                  </h2>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${isOpen ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> {job.company_name}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 justify-between text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.applicant_count} Applicant{job.applicant_count !== 1 && 's'}
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarCheck className="w-4 h-4" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-gray-200 font-semibold' : ''}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
