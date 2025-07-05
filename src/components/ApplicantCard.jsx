import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ApplicantCard = ({ applicantData }) => {
  const navigate = useNavigate();
  const { id, applicant, job, applied_at } = applicantData;

  const initials = applicant?.name
    ? applicant.name.split(' ').map(word => word[0]).join('').toUpperCase()
    : '👤';

  const profilePic = applicant?.profile_pic;
  const fullName = applicant?.name || 'Unknown';
  const email = applicant?.email || 'No email';
  const jobTitle = job?.title || 'N/A';
  const appliedDate = new Date(applied_at).toLocaleDateString();

  return (
    <div
      onClick={() => navigate(`/recruiter/applicants/${id}`)}
      className="text-left p-5 bg-card rounded-2xl shadow-md border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">

      {/* Top: Name, Email, Profile Pic or Initials */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-primary leading-tight">{fullName}</h3>
          <p className="text-md text-gray-700 truncate pt-1">{email}</p>
        </div>
        <div className="w-12 h-12 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center text-lg font-bold text-primary">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>


      {/* Tags */}
      <div className="flex flex-wrap gap-3 text-sm text-foreground opacity-90 mb-4 py-2">
        <span className="bg-background border border-border px-3 py-2 rounded-full">{jobTitle}</span>
        <span className="bg-background border border-border px-3 py-2 rounded-full">Applied: {appliedDate}</span>
      </div>

      {/* View details btn */}
      <div className="text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/recruiter/applicants/${id}`);
          }}
          className="text-primary text-sm font-medium hover:underline"
        >
          View Details
        </button>

        {/* View Details Button */}
      </div>

    </div>
  );
};

ApplicantCard.propTypes = {
  applicantData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    applicant: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      profile_pic: PropTypes.string,
    }),
    job: PropTypes.shape({
      title: PropTypes.string,
    }),
    applied_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default ApplicantCard;
