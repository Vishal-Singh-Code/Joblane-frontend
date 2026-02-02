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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('applied_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const jobsPerPage = 6;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosJob.get(`/recruiter/jobs/${id}/applicants/`);
        setApplicants(response.data.results);
      } catch (error) {
        console.error('Failed to fetch applicant profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const name = app.applicant_name?.toLowerCase() || '';
      const email = app.applicant_email?.toLowerCase() || '';
      return (
        searchQuery === '' ||
        name.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase())
      );
    });
  }, [applicants, searchQuery]);


  const totalPages = Math.ceil(filteredApplicants.length / jobsPerPage);
  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedApplicants = [...currentApplicants].sort((a, b) => {
    let aVal, bVal;

    if (sortKey === 'applicant') {
      aVal = `${a.applicant?.first_name || ''} ${a.applicant?.last_name || ''}`.toLowerCase();
      bVal = `${b.applicant?.first_name || ''} ${b.applicant?.last_name || ''}`.toLowerCase();
    } else if (sortKey === 'status') {
      aVal = a.status?.toLowerCase?.() || '';
      bVal = b.status?.toLowerCase?.() || '';
    } else if (sortKey === 'applied_at') {
      aVal = new Date(a.applied_at);
      bVal = new Date(b.applied_at);
    } else {
      aVal = a[sortKey];
      bVal = b[sortKey];
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

 const renderSortIcon = (key) => {
  if (sortKey !== key) return <FaSort className="inline text-gray-400 ml-1" />;
  return sortOrder === 'asc'
    ? <FaSortUp className="inline text-primary ml-1" />
    : <FaSortDown className="inline text-primary ml-1" />;
};


  return (
    <div className="bg-background min-h-screen px-4 sm:px-10 py-6 text-textDark">
            <h1 className="section-heading mb-6">Applicant List</h1>

      {/* Search */}
      <div className="flex justify-center items-center w-full py-6">
        <div className="relative w-full max-w-6xl">
          <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name or email..."
            className="bg-white w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto overflow-x-auto shadow-sm rounded-xl">
        {loading ? (
          <p className="text-center text-gray-500 py-6 animate-pulse">Loading applicants...</p>
        ) : currentApplicants.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-3xl mb-2">😕</p>
            <p>No applicants found.</p>
          </div>
        ) : (
          <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-base font-medium">
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

            <tbody className="text-sm text-gray-800 divide-y divide-gray-200 text-center">
              {sortedApplicants.map((app) => (
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
                      className="text-primary hover:underline font-medium text-sm"
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
