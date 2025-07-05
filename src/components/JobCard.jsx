import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobCard = ({ job }) => {
  const getCompanyLogoUrl = (companyName) => {
    const sanitizedCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const clearbitUrl = `https://logo.clearbit.com/${sanitizedCompanyName}.com`;
    return sanitizedCompanyName.length < 2
      ? "https://via.placeholder.com/40?text=🏢"
      : clearbitUrl;
  };

  const logoUrl = getCompanyLogoUrl(job.company);

  return (
    <Link to={`/job/${job.id}`} className="block hover:no-underline">
      <div className="p-5 bg-card rounded-2xl shadow-md border border-border hover:shadow-xl hover:scale-[1.01] transition-all duration-300 h-full flex flex-col justify-between group">
        
        {/* Top Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left flex-grow pr-2">
            <h3 className="text-xl font-semibold text-black leading-tight mb-1 group-hover:text-primary">
              {job.title}
            </h3>
            <p className="text-lg text-foreground opacity-70">
              {job.company}
            </p>
          </div>
          <img
            src={logoUrl || "https://placehold.co/40x40?text=🏢"}
            alt={`${job.company} Logo`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/40x40?text=🏢";
            }}
            className="w-10 h-10 object-contain flex-shrink-0 rounded"
          />

        </div>

        {/* Tags Section */}
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-foreground opacity-80">
          <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-full border border-border">
            {job.location}
          </span>
          <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-full border border-border">
            {job.ctc}
          </span>
          <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-full border border-border capitalize">
            {job.job_type}
          </span>
          {(job.experience !== undefined && job.experience !== null && job.experience !== "") && (
            <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-full border border-border">
              {job.experience === 0 || String(job.experience) === "0" ? "Fresher" : `${job.experience}+ yrs`}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-right">
          <span className="text-primary text-sm font-medium hover:underline">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    ctc: PropTypes.string,
    job_type: PropTypes.string.isRequired,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default JobCard;
