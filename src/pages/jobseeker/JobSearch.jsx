import { useState, useEffect } from 'react';
import JobCard from "../../components/JobCard";
import { FaSearch } from 'react-icons/fa';
import axios from "../../api/axios";
import FilterJobs from "../../components/jobFilter/FilterJobs";

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [experienceFilter, setExperienceFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationFilter, setLocationFilter] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [profileFilter, setProfileFilter] = useState([]);
  const [profileSearch, setProfileSearch] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6; 
  useEffect(() => {
    axios.get("/jobs/")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Failed to fetch jobs", err));
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset pagination when filters/search change
  }, [searchQuery, profileFilter, locationFilter, experienceFilter, jobTypeFilter]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProfile =
      profileFilter.length === 0 ||
      profileFilter.some(role => job.title.toLowerCase().includes(role.toLowerCase()));

    const matchesLocation =
      locationFilter.length === 0 ||
      locationFilter.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()));

    const matchesExperience =
      experienceFilter === '' ||
      (experienceFilter === 'fresher' && parseInt(job.experience) === 0) ||
      (experienceFilter === 'experienced' && parseInt(job.experience) > 0);

    const matchesJobType =
      jobTypeFilter.length === 0 ||
      jobTypeFilter.includes(job.job_type);

    return matchesSearch && matchesProfile && matchesLocation && matchesExperience && matchesJobType;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const commonFilterProps = {
    profileFilter,
    setProfileFilter,
    experienceFilter,
    setExperienceFilter,
    setSearchQuery,
    jobTypeFilter,
    setJobTypeFilter,
    showLocationDropdown,
    setShowLocationDropdown,
    locationFilter,
    setLocationFilter,
    locationSearch,
    setLocationSearch,
    showProfileDropdown,
    setShowProfileDropdown,
    profileSearch,
    setProfileSearch,
    closeMobileFilter: null
  };

  return (
    <div className="bg-background min-h-screen px-4 sm:px-10 py-6 text-textDark relative">
      
      {/* Topbar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="inline-flex items-center gap-2 text-primary text-sm sm:text-base font-medium bg-white border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm md:hidden"
        >
          <span className="text-base">☰</span>
          <span className='text-base'>Filters</span>
        </button>

        <div className="flex justify-center items-center w-full py-6">
          <div className="relative w-full max-w-5xl">
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs (e.g. React Developer, Google...)"
              className="bg-white w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>
        </div>

      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="section-heading mb-2">
          {filteredJobs.length} Job{filteredJobs.length !== 1 && 's'} Found
        </h1>
        <p className="text-gray-600">Search and Apply to Latest Job Vacancies & Openings in India</p>
      </div>

      {/* Filters + Job List */}
      <div className="flex flex-col md:flex-row gap-10 justify-center mx-4 md:mx-25">
        <aside className="hidden bg-secondary md:block md:w-1/3">
          <FilterJobs {...commonFilterProps} />
        </aside>

        <main className="flex-1 space-y-6 px-4 md:px-8">
          {currentJobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs found. Try adjusting your filters or search query.</p>
          ) : (
            currentJobs.map((job) => (
              <div key={job.id} to={`/job/${job.id}`} className="block hover:no-underline">
                <JobCard job={job} />
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-400 text-md disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg border text-md ${currentPage === pageNum
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-400'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-400 text-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto pt-16 px-10">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-black"
            onClick={() => setShowMobileFilters(false)}
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-primary mb-4">Filters</h2>
          <FilterJobs
            {...commonFilterProps}
            closeMobileFilter={() => setShowMobileFilters(false)}
          />
        </div>
      )}
    </div>
  );
}

export default JobSearch;
