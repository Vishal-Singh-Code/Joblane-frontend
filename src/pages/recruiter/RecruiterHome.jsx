import { Briefcase, Users, FileText, PlusCircle, UserCheck, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

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
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      try {
        const response = await axios.get('https://joblane-backend-0eqs.onrender.com/api/jobs/recruiter/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const jobData = response.data;
        setJobs(jobData);

        const total = jobData.length;
        const active = jobData.filter(job => job.deadline === '' || new Date(job.deadline) > new Date()).length;
        const applicants = jobData.reduce((sum, job) => sum + (job.applicants_count || 0), 0);

        setStats({
          totalJobs: total,
          totalApplicants: applicants,
          activeJobs: active,
        });

      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchData();

    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      try {
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = response.data;
        const fullName = profileData.name || 'Recruiter';
        const firstName = fullName?.split(' ')[0] || 'Recruiter';
        setRecruiterName(firstName);

      } catch (err) {
        console.error('Failed to fetch recruiter profile:', err);
      }
    };


    fetchProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-background min-h-screen text-foreground space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-muted-foreground">Welcome Back,&nbsp;</span>
          <span className="text-primary text-4xl">{recruiterName}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
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
          onClick={() => navigate('/recruiter/applicants')}
          className="flex flex-col justify-center items-center sm:items-start bg-card border border-border p-6 rounded-2xl shadow group hover:bg-primary hover:text-white hover:scale-[1.02] transform transition cursor-pointer"
        >
          <UserCheck className="w-8 h-8 mb-4 text-primary group-hover:text-white transition" />

          <div className="text-xl font-semibold mb-1 group-hover:text-white transition">
            View Applicants
          </div>

          <p className="text-sm text-muted-foreground group-hover:text-white/80 transition">
            Review and manage applications easily.
          </p>
        </button>


        <button
          onClick={() => navigate('/recruiter/profile')}
          className="flex flex-col justify-center items-center sm:items-start bg-card border border-border p-6 rounded-2xl shadow group hover:bg-primary hover:text-white hover:scale-[1.02] transform transition cursor-pointer"
        >
          <Building2 className="w-8 h-8 mb-4 text-primary text-primary group-hover:text-white transition" />
          <div className="text-xl font-semibold mb-1">Company Profile</div>
          <p className="text-sm text-muted-foreground">Update your profile and company info.</p>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
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
      <div className="bg-card border border-border rounded-2xl shadow overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-3xl font-semibold">Recent Job Posts</h2>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-4 p-4 bg-muted font-bold text-base uppercase tracking-wider text-muted-foreground">
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
                {job.applicants_count} Applicant{job.applicants_count !== 1 && 's'}
              </div>

              <div className="text-muted-foreground">
                {new Date(job.created_at).toLocaleDateString()}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default RecruiterHome;
