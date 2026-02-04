import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosJob from '../../api/axiosJob';
import { FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';


function ViewApplicants() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('applied_at');
  const [totalCount, setTotalCount] = useState(0);


  const PAGE_SIZE = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);


  useEffect(() => {
    setLoading(true);

    axiosJob.get(`/recruiter/jobs/${id}/applicants/`, {
      params: {
        page: currentPage,
        search: searchQuery,
        ordering: sortKey,
      },
    })
      .then((res) => {
        setApplicants(res.data.results);
        setTotalCount(res.data.count);
      })
      .catch(() => console.error('Failed to fetch applicants'))
      .finally(() => setLoading(false));
  }, [id, currentPage, searchQuery, sortKey]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);


  const handleSort = (key) => {
    if (sortKey === key) {
      setSortKey(key.startsWith('-') ? key.slice(1) : `-${key}`);
    } else {
      setSortKey(key);
    }
    setCurrentPage(1);
  };


  const renderSortIcon = (key) => {
    if (sortKey !== key && sortKey !== `-${key}`) {
      return <FaSort className="inline text-gray-400 ml-1" />;
    }

    return sortKey.startsWith('-')
      ? <FaSortDown className="inline text-primary ml-1" />
      : <FaSortUp className="inline text-primary ml-1" />;
  };

  const handleExport = (status = "all") => {
    const base = import.meta.env.VITE_REACT_APP_API_URL;

    const params = new URLSearchParams({
      job_id: id,
      status,
    });

    window.location.href =
      `${base}/api/recruiter/applicants/export/?${params.toString()}`;
  };


  return (
    <div className="bg-background min-h-screen px-4 sm:px-10 py-6 text-textDark">
      <h1 className="section-heading mb-6">Applicant List</h1>

      <div className="w-full ">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center">

          {/* Search + buttons*/}
          <div className="w-full py-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center">

              {/* Search bar */}
              <div className="relative w-full sm:flex-1">
                <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search applicants by name or email..."
                  className="bg-white w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                />
              </div>

              {/* Export buttons */}
              <div className="ml-0 sm:ml-auto grid grid-cols-2 gap-3 sm:flex sm:justify-end">
                <button
                  onClick={() => handleExport("all")}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-border bg-muted text-sm hover:bg-muted/80 transition"
                >
                  Export All
                </button>

                <button
                  onClick={() => handleExport("Shortlisted")}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm hover:brightness-110 transition"
                >
                  Export Shortlisted
                </button>
              </div>

            </div>
          </div>


        </div>
      </div>


      {/* Table */}
      <div className="max-w-6xl mx-auto overflow-x-auto shadow-sm rounded-xl">
        {loading ? (
          <p className="text-center text-gray-500 py-6 animate-pulse">Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-3xl mb-2">😕</p>
            <p>No applicants found.</p>
          </div>
        ) : (
          <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm sm:text-base font-medium">
              <tr>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('applicant_name')}>
                  Applicant {renderSortIcon('applicant')}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                  Status {renderSortIcon('status')}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('applied_at')}>
                  Applied On {renderSortIcon('applied_at')}
                </th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-xs sm:text-sm text-gray-800 divide-y divide-gray-200 text-center">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {app.applicant_name}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'}`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {format(new Date(app.applied_at), 'dd MMM yyyy')}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/recruiter/applicant/${app.id}`)}
                      className="text-primary hover:underline font-medium text-xs sm:text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
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
              className={`px-3 py-1 rounded-lg border text-md 
                ${currentPage === pageNum ? 'bg-primary text-white border-primary' : 'border-gray-400'}`}
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
    </div>
  );
}

export default ViewApplicants;
