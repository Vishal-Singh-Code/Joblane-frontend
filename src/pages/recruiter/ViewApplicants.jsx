import { useEffect, useState, useMemo } from 'react';
import axios from '../../api/axios';
import { FaSearch, FaBriefcase } from 'react-icons/fa';
import ApplicantCard from '../../components/ApplicantCard';

function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const response = await axios.get('/recruiter/applicants/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(response.data);
      } catch (error) {
        console.error('Failed to fetch applicant profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesSearch =
        searchQuery === '' ||
        (app.applicant?.first_name + ' ' + app.applicant?.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job?.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesJobTitle =
        jobTitleFilter === '' || (app.job?.title.toLowerCase().includes(jobTitleFilter.toLowerCase()));

      return matchesSearch && matchesJobTitle;
    });
  }, [applicants, searchQuery, jobTitleFilter]);

  const totalPages = Math.ceil(filteredApplicants.length / jobsPerPage);

  const indexOfLastApplicant = currentPage * jobsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - jobsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, jobTitleFilter]);

  return (
    <div className="bg-background min-h-screen px-4 sm:px-10 py-6 text-textDark">

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

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          {filteredApplicants.length} Applicant{filteredApplicants.length !== 1 && 's'} Found
        </h1>
        <p className="text-gray-600">Manage all your job applicants in one place.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 justify-center mx-4 md:mx-25">

        <aside className="hidden md:block md:w-1/3 bg-white border rounded-xl p-6 shadow-sm sticky top-24 h-fit">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm text-muted-foreground">Job Title</label>
            <FaBriefcase className="absolute top-9 left-3 text-gray-400" />
            <input
              type="text"
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value)}
              placeholder="e.g. Designer"
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </aside>

        <main className="flex-1 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-500 animate-pulse">Loading applicants...</p>
          ) : currentApplicants.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              <p className="text-3xl mb-2">😕</p>
              <p>No applicants found for your search.</p>
            </div>
          ) : (
            currentApplicants.map(app => (
              <ApplicantCard key={app.id} applicantData={app} />
            ))
          )}

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
                  className={`px-3 py-1 rounded-lg border text-md ${currentPage === pageNum ? 'bg-primary text-white border-primary' : 'border-gray-400'}`}
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

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto pt-16 px-10">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-black"
            onClick={() => setShowMobileFilters(false)}
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-primary mb-4">Filters</h2>
          <div className="mb-6">
            <label className="block mb-1 text-sm text-muted-foreground">Job Title</label>
            <input
              type="text"
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value)}
              placeholder="e.g. Developer"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters(false)}
            className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Apply Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default ViewApplicants;