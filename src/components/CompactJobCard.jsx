const CompactJobCard = ({ job }) => {
  const logoUrl = `https://logo.clearbit.com/${job.company.toLowerCase()}.com`;

  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full min-h-[220px] flex flex-col justify-between cursor-pointer">

      {/* Top */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="text-xl font-semibold text-black group-hover:text-primary transition-colors duration-300">
            {job.title}
          </h3>
          <p className="text-lg text-foreground opacity-60 mt-1">{job.company}</p>
        </div>
        <img
          src={logoUrl || "https://placehold.co/64x64?text=🏢"}
          alt={`${job.company} Logo`}
          onError={(e) => {
            e.target.onerror = null;  
            e.target.src = "https://placehold.co/64x64?text=🏢";
          }}
          className="w-16 h-20 object-contain ml-2 rounded"
        />
      </div>

      {/* Middle - Tags */}
      <div className="flex flex-wrap gap-2 text-sm text-foreground opacity-70">
        <span className="bg-background px-2 py-1 rounded-full border border-border">
          {job.location}
        </span>
        <span className="bg-background px-2 py-1 rounded-full border border-border">
          {job.ctc}
        </span>
        <span className="bg-background px-2 py-1 rounded-full border border-border capitalize">
          {job.job_type}
        </span>
      </div>

      {/* CTA */}
      <div className="mt-4 text-right">
        <span className="text-primary text-sm font-medium hover:underline">
          View Details
        </span>
      </div>
    </div>
  );
};

export default CompactJobCard;
