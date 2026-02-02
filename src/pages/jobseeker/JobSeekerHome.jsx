import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CompactJobCard from "../../components/CompactJobCard";
import axios from "../../api/axios";
import axiosJob from "../../api/axiosJob"
import CompactJobCardSkeleton from '../../components/loaders/CompactJobCardSkeleton'

function JobSeekerHome() {
  const [jobs, setJobs] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [userName, setUserName] = useState("User"); 

  const shuffleArray = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // Fetch recommended jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await axiosJob.get("/jobs/");
        const shuffledJobs = shuffleArray(jobsRes.data.results).slice(0, 6);
        setJobs(shuffledJobs);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setError("Unable to load jobs at the moment.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const [appliedRes, savedRes, profileRes] = await Promise.all([
          axiosJob.get("/applied/"),
          axiosJob.get("/saved/"),
          axios.get("/profile/")
        ]);

        setAppliedCount(appliedRes.data.results.length);
        setSavedCount(savedRes.data.results.length);

        const approved = appliedRes.data.results.filter(job => job.status === 'Shortlisted').length;
        setApprovedCount(approved);

        setUserName(profileRes.data.name || "User");
      } catch (err) {
        console.error("Failed to fetch application/saved stats:", err);
      }
    };

    fetchJobs();
    fetchStats();

  }, []);


  return (
    <div className="px-6 py-10 bg-background text-textDark min-h-screen">

      {/* Welcome Message */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        <span className="text-gray-700">Hi,&nbsp;</span>
        <span className="text-primary">{userName.split(' ')[0]}</span>
      </h1>

      <p className="text-muted-foreground text-sm sm:text-lg text-center">
        Let’s help you land your dream job.
      </p>

      {/* Recommended Jobs */}
      <section className="py-5 sm:px-6 bg-background text-center">
        <h2 className="section-heading text-2xl sm:text-3xl">Recommended Jobs</h2>
        <p className="text-muted-foreground mb-10 text-base sm:text-lg">As per your preference</p>

        {loading && <CompactJobCardSkeleton/>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {!loading && jobs.length === 0 && (
            <p className="text-gray-500 col-span-full">No recommended jobs available right now.</p>
          )}

          {jobs.map((job) => (
            <Link key={job.id} to={`/job/${job.id}`} className="block hover:no-underline">
              <CompactJobCard job={job} />
            </Link>
          ))}
        </div>
         <div className="mt-10 text-center">
        <Link
          to="/jobs"
          className="more-button"
        >
          Explore All Jobs
        </Link>
      </div>

      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center mt-10 sm:px-6">
        <div className="bg-white p-6 rounded-xl border shadow">
          <p className="text-2xl font-bold text-primary">{appliedCount}</p>
          <p className="text-gray-600">Applications Sent</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow">
          <p className="text-2xl font-bold text-primary">{savedCount}</p>
          <p className="text-gray-600">Saved Jobs</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow">
          <p className="text-2xl font-bold text-primary">{approvedCount}</p>
          <p className="text-gray-600">Interview Invites</p>
        </div>
      </section>

      {/* CTA Button */}
     

    </div>
  );
}

export default JobSeekerHome;
