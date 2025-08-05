import { MapPin, IndianRupee, Briefcase, User } from "lucide-react";

const CompactJobCard = ({ job }) => {
  const logoUrl = `https://logo.clearbit.com/${job.company.toLowerCase()}.com`;

  return (
      <div className="bg-card p-6 rounded-2xl border border-border shadow group hover:shadow-xl hover:scale-[1.015] transition-all duration-300 h-full flex flex-col gap-4 cursor-pointer">

        {/* Top - Info left, logo right */}
        <div className="flex justify-between items-start">
          <div className="flex-1 text-left pr-4">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-base text-muted-foreground">{job.company}</p>
          </div>

          <img
            src={logoUrl || "https://placehold.co/64x64?text=🏢"}
            alt={`${job.company} Logo`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/64x64?text=🏢";
            }}
            className="w-14 h-14 object-contain rounded bg-white p-1 flex-shrink-0"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            {job.ctc}
          </div>
          <div className="flex items-center gap-2 capitalize">
            <Briefcase className="w-4 h-4" />
            {job.job_type}
          </div>
          {(job.experience || job.experience === 0) && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {job.experience === 0 ? "Fresher" : `${job.experience}+ yrs`}
            </div>
          )}
        </div>

      </div>
  );
};

export default CompactJobCard;
