import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CompactJobCard from "../components/CompactJobCard";
import axiosJob from "../api/axiosJob";
import { companyLogos } from "../data/landingImg"
import CompactJobCardSkeleton from '../components/loaders/CompactJobCardSkeleton'

const heroImg = "https://internshala.com/static/images/homepage/banner/r767_v1.webp";

function LandingPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchJobs = async ()=>{
      try{
        const res = await axiosJob.get('/jobs');
        setJobs(res.data);
      }catch(err){
        console.log('Failed to fetch jobs', err);
      }finally{
        setLoading(false)
      }
    }
    fetchJobs()
  }, []);

  return (
    <div className="bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 sm:px-15 bg-card">
        <div className="md:w-1/2 text-center md:text-left mt-20 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
            India’s #1 Hiring Platform.
          </h1>
          <p className="mt-4 text-lg text-foreground opacity-80">
            Find your dream job or the perfect hire in minutes.
          </p>
          <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-4">
            <button
              className="cosmic-button cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </button>

            <button
              className="cosmic-button-outline cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </div>
        <img src={heroImg} alt="Hero" className="w-full md:w-[44%] mt-10 md:mt-0 " />
      </section>

      {/* Marquee Section */}
      <section className="bg-white overflow-hidden border-b flex items-center">
        <div className="flex-shrink-0 min-w-[120px] pl-4 pr-5 sm:pr-8 pt-4 pb-4 text-primary">
          <h2 className="font-bold text-3xl sm:text-5xl leading-tight">10k+</h2>
          <p className="text-sm sm:text-lg font-medium">openings daily</p>
        </div>
        <div className="text-4xl sm:text-5xl font-bold flex items-center text-primary sm:mx-4">|</div>
        <div className="overflow-hidden flex-1">
          <div className="whitespace-nowrap animate-marquee flex gap-8 md:gap-16">
            {[...companyLogos, ...companyLogos].map((logo, idx) => (
              <img key={`logo-${idx}`} src={logo} alt="Company" className="h-10 sm:h-12 w-auto object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs */}
      <section className="py-16 px-6 bg-background text-center">
        <h2 className="section-heading mb-2">Trending Jobs</h2>
        <p className="text-foreground opacity-80 mb-12 text-base sm:text-lg">
          Latest opportunities from top companies
        </p>
        {loading && <CompactJobCardSkeleton/>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {shuffledJobs.slice(0, 6).map((job) => (
            <Link key={job.id} to={`/job/${job.id}`} className="block hover:no-underline">
              <CompactJobCard job={job} />
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/jobs" className="cosmic-button text-sm">
            View More Jobs
          </Link>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-6 bg-background text-center">
        <h2 className="section-heading">Success Stories</h2>
        <p className="text-gray-600 mb-10 text-base sm:text-lg">28,48,723+ placements — read their stories</p>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Landed My Dream Job</h3>
            <p className="text-gray-600 italic">
              “Thanks to JobLane, I secured my first software development role in just 10 days! The application process was smooth and stress-free.”
            </p>
            <div className="mt-5 flex items-center gap-4 text-left">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rohit" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-800">Rohit Verma</p>
                <p className="text-sm text-gray-500">Placed at Infosys</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Career Restart Success</h3>
            <p className="text-gray-600 italic">
              “After a career break, I was unsure how to get back into the workforce. JobLane made it possible — I’m now happily employed!”
            </p>
            <div className="mt-5 flex items-center gap-4 text-left">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Neha" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-800">Neha Sinha</p>
                <p className="text-sm text-gray-500">Placed at Wipro</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">First Job After College</h3>
            <p className="text-gray-600 italic">
              “JobLane helped me find my very first job right after graduation. The platform is user-friendly and filled with opportunities.”
            </p>
            <div className="mt-5 flex items-center gap-4 text-left">
              <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Amit" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-800">Amit Kumar</p>
                <p className="text-sm text-gray-500">Placed at TCS</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default LandingPage;
