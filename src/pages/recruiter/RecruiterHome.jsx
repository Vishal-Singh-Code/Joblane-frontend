import { Briefcase, Users, FileText, PlusCircle, UserCheck, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosJob from '../../api/axiosJob';
import axios from '../../api/axios'

function RecruiterHome() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [recruiterName, setRecruiterName] = useState('Recruiter');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosJob.get("/recruiter/jobs");
        const jobData = response.data;
        setJobs(jobData);

        const total = jobData.length;
        const active = jobData.filter(job => job.deadline === '' || new Date(job.deadline) > new Date()).length;
        const applicants = jobData.reduce((sum, job) => sum + (job.applicant_count || 0), 0);

        setStats({
          totalJobs: total,
          totalApplicants: applicants,
          activeJobs: active,
        });

      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile"); // <- shorter, clean
        const profileData = response.data;
        const fullName = profileData.name || 'Recruiter';
        const firstName = fullName?.split(' ')[0] || 'Recruiter';
        setRecruiterName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());

      } catch (err) {
        console.error('Failed to fetch recruiter profile:', err);
      }
    };

    fetchData();
    fetchProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-background min-h-screen text-foreground space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          <span className="text-gray-700">Welcome Back,&nbsp;</span>
          <span className="text-primary">{recruiterName}</span>
        </h1>
        <p className="text-gray-600 mb-10">
          Manage your job posts, track applicants, and grow your team effortlessly.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/recruiter/post-job')}
          className="flex flex-col justify-center items-center sm:items-start bg-primary text-white p-6 rounded-2xl shadow-md hover:bg-primary/90 hover:scale-[1.02] transition transform active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-8 h-8 mb-4 justify-center" />
          <div className="text-xl font-semibold mb-1">Post a New Job</div>
          <p className="text-sm opacity-90">Create a job post to attract top talent.</p>
        </button>

        <button
          onClick={() => navigate('/recruiter/joblist')}
          className="flex flex-col justify-center items-center sm:items-start bg-card border border-border p-6 rounded-2xl shadow group hover:bg-primary hover:text-white hover:scale-[1.02] transform transition cursor-pointer"
        >
          <Briefcase className="w-8 h-8 mb-4 text-primary group-hover:text-white transition" />

          <div className="text-xl font-semibold mb-1 group-hover:text-white transition">
            View Jobs Posts
          </div>

          <p className="text-sm text-muted-foreground group-hover:text-white/80 transition">
            Review and manage applications easily.
          </p>
        </button>


        <button
          onClick={() => navigate('/recruiter/company_profile')}
          className="flex flex-col justify-center items-center sm:items-start bg-card border border-border p-6 rounded-2xl shadow group hover:bg-primary hover:text-white hover:scale-[1.02] transform transition cursor-pointer"
        >
          <Building2 className="w-8 h-8 mb-4 text-primary text-primary group-hover:text-white transition" />
          <div className="text-xl font-semibold mb-1">Company Profile</div>
          <p className="text-sm text-muted-foreground">Update your profile and company info.</p>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Briefcase className="text-primary w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <div className="text-muted-foreground text-sm">Total Jobs Posted</div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Users className="text-primary w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            <div className="text-muted-foreground text-sm">Total Applicants</div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <FileText className="text-primary w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <div className="text-muted-foreground text-sm">Active Job Posts</div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-card border border-border rounded-2xl shadow overflow-x-auto">

<div className="min-w-[600px]">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl sm:text-3xl font-semibold">Recent Job Posts</h2>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-4 p-4 bg-muted font-bold text-sm sm:text-base uppercase tracking-wider text-muted-foreground ">
          <div>Title</div>
          <div>Status</div>
          <div>Applicants</div>
          <div>Posted On</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-4 p-4 hover:bg-muted transition text-sm">
              <div className="font-medium text-foreground">{job.title}</div>

              <div className={new Date(job.deadline) > new Date() ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                {new Date(job.deadline) > new Date() ? 'Open' : 'Closed'}
              </div>

              <div className="text-foreground">
                {job.applicant_count} Applicant{job.applicant_count !== 1 && 's'}
              </div>

              <div className="text-muted-foreground">
                {new Date(job.created_at).toLocaleDateString()}
              </div>

            </div>
          ))}
        </div>

      </div>
</div>
    </div>
  );
}

export default RecruiterHome;
