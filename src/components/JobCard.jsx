import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobCard = ({ job }) => {

  const logoUrl = job.company_logo || "https://placehold.co/64x64?text=🏢";

  return (
    <Link to={`/job/${job.id}`} className="block hover:no-underline">
      <div className="p-5 bg-card rounded-2xl shadow-md border border-border hover:shadow-xl hover:scale-[1.01] transition-all duration-300 h-full flex flex-col justify-between group">
        
        {/* Top Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left flex-grow pr-2">
            <h3 className="text-lg sm:text-xl font-semibold text-black leading-tight mb-1 group-hover:text-primary">
              {job.title}
            </h3>
            <p className=" text-md sm:text-lg text-foreground opacity-70">
              {job.company_name}
            </p>
          </div>
          
          <img
          src={logoUrl}
          alt={`${job.company_name} Logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/64x64?text=🏢";
          }}
          className="w-14 h-14 object-contain rounded bg-white p-1 flex-shrink-0"
        />

        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="px-3 py-1 rounded-full border border-border">
          {job.location}
          </span>
          <span className="hidden sm:block px-3 py-1 rounded-full border border-border">
          {job.ctc}
          </span>
          <span className="px-3 py-1 rounded-full border border-border capitalize">
          {job.job_type}
          </span>
          {(job.experience || job.experience === 0) && (
            <span className="px-3 py-1 rounded-full border border-border">
            {job.experience === 0 ? "Fresher" : `${job.experience} yrs`}
            </span>
          )}
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
