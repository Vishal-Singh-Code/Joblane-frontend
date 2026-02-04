import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosJob from '../../api/axiosJob';
import { toast } from 'react-toastify'

function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicantData, setApplicantData] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const res = await axiosJob.get(`/recruiter/applicants/${id}/`)
        setApplicantData(res.data)
        setStatus(res.data.status || '');
      } catch (err) {
        console.error('Failed to load applicant details:', err)
      }
    }
    fetchApplicantDetails()
  }, [id])

  const handleStatusChange = useCallback(async (newStatus) => {
    try {
      await axiosJob.patch(`/recruiter/applicants/${id}/status/`, { status: newStatus });
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`, { id: 'status-toast' });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status', { id: 'status-error' });
    }
  }, [id]);


  if (!applicantData) {
    return <div className="min-h-screen text-center py-10 text-gray-600">Loading applicant details...</div>;
  }

  const { applicant, job } = applicantData;
  const skillsArray = Array.isArray(applicant?.skills)
    ? applicant.skills
    : (typeof applicant?.skills === 'string' && applicant.skills
      ? applicant.skills.split(',')
      : []);

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-8 md:px-16 font-inter">
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg border border-border p-8 space-y-8">

        {/* Profile Pic + Name & Email */}
        <div className=" text-left flex flex-row flex-wrap justify-left items-start gap-4">
          {applicant?.profile_pic ? (
            <img src={applicant.profile_pic} alt="Profile" className=" w-20 h-20 rounded-full object-cover border" />
          ) : (
            <span className=" w-16 h-16 object-contain rounded-md bg-background p-2 border border-border">
              {applicant?.name ? applicant.name.split(' ').map(w => w[0]).join('').toUpperCase() : '👤'}
            </span>
          )}
          <div>
            <h1 className="text-xl text-center sm:text-left sm:text-2xl md:text-3xl font-bold text-foreground">
              {applicant?.name || 'Unknown Name'}
            </h1>
            <p className="text:lg text-center sm:text-left sm:text-xl text-foreground opacity-70 mt-1">{applicant?.email || 'No Email'}</p>
          </div>

        </div>

        <hr className="border-border" />

        {/* Other Details */}
        <div className="text-left text-lg grid grid-cols-1 gap-6 text-foreground opacity-80 ">
          <div className="text-lg space-y-3">
            <div><span className="font-medium">Applied for:</span> {job?.title || 'N/A'}</div>
            <div><span className="font-medium">Phone:</span> {applicant?.phone || 'N/A'}</div>
            <div><span className="font-medium">Location:</span> {applicant?.location || 'N/A'}</div>
            <div><span className="font-medium">Education:</span> {applicant?.education || 'N/A'}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-lg font-medium">Skills:</span>
              {skillsArray.length > 0 ? (
                skillsArray.map((skill, i) => (
                  <span key={i} className="bg-background px-3 py-1 rounded-full text-sm border border-border">
                    {skill.trim()}
                  </span>
                ))
              ) : ' N/A'}
            </div>
            <div >
              <label className="font-medium text-md">Application Status:</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm sm:text-base border border-border rounded-lg p-1 bg-background text-foreground ml-3"
              >
                <option value="">Select Status</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>

              {status && (
                <p className="mt-2 text-sm text-gray-700">
                  Current Status: <span className="font-semibold">{status}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 border border-border/60 bg-muted text-foreground px-5 py-3 rounded-full hover:bg-muted/80 transition"
          >
            Back to Applicants
          </button>


          {applicant?.resume && (
            <a
              href={applicant.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow hover:brightness-110 transition"
            >
              View Resume
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

export default ApplicantDetail;