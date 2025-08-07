import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CompactJobCard from "../components/CompactJobCard";
import axiosJob from "../api/axiosJob";
import { companyLogos } from "../data/landingImg";
import CompactJobCardSkeleton from '../components/loaders/CompactJobCardSkeleton';

// Placeholder for the hero image URL
const heroImg = "https://internshala.com/static/images/homepage/banner/r767_v1.webp";

function LandingPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Shuffle jobs to display a random set
  const shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);

  // Fetch jobs data on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosJob.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err); // Using console.error for errors
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    // Main container with background and foreground colors from the theme
    <div className="bg-background text-foreground min-h-screen">

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-16 bg-card rounded-b-xl shadow-lg">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 animate-[fade-in_1s_ease-out]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-4">
            India’s #1 Hiring Platform.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground opacity-90 leading-relaxed">
            Find your dream job or the perfect hire in minutes.
          </p>
          <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-4">
            <button
              className="cosmic-button animate-[float_2s_ease-in-out_infinite] shadow-md hover:shadow-lg"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="cosmic-button-outline animate-[pulse-subtle_2s_ease-in-out_infinite] shadow-md hover:shadow-lg"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </div>
        <img
          src={heroImg}
          alt="Hero"
          className="w-full md:w-[48%] max-w-lg rounded-xl shadow-xl animate-[fade-in_1s_ease-out_0.2s]"
          // Fallback in case image fails to load
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/3B82F6?text=Image+Not+Found"; }}
        />
      </section>

      {/* Marquee Section - showcasing daily openings and company logos */}
      <section className="bg-card overflow-hidden border-b border-border flex flex-col sm:flex-row items-center py-6 sm:py-4 mt-8 rounded-xl mx-6 shadow-md">
        <div className="flex-shrink-0 min-w-[120px] px-4 sm:pl-8 sm:pr-6 text-primary text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="font-bold text-4xl sm:text-5xl leading-tight">10k+</h2>
          <p className="text-base sm:text-lg font-medium text-foreground opacity-90">openings daily</p>
        </div>
        <div className="hidden sm:block text-5xl font-bold text-primary mx-4">|</div> {/* Separator for larger screens */}
        <div className="overflow-hidden flex-1 w-full sm:w-auto">
          <div className="whitespace-nowrap animate-marquee flex gap-8 md:gap-16 items-center py-2">
            {[...companyLogos, ...companyLogos].map((logo, idx) => (
              <img
                key={`logo-${idx}`}
                src={logo}
                alt="Company Logo"
                className="h-10 sm:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                // Fallback for company logos
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x40/E0E7FF/3B82F6?text=Logo`; }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs Section */}
      <section className="py-16 px-6 bg-background text-center">
        <h2 className="text-primary text-3xl md:text-4xl font-bold mb-2">Trending Jobs</h2>
        <p className="text-muted-foreground mb-12 text-base sm:text-lg">
          Latest opportunities from top companies
        </p>
        {loading ? (
          <CompactJobCardSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {shuffledJobs.slice(0, 6).map((job) => (
              <Link key={job.id} to={`/job/${job.id}`} className="block">
                <CompactJobCard job={job} />
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/jobs" className="cosmic-button text-sm shadow-md hover:shadow-lg">
            View More Jobs
          </Link>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-6 bg-background text-center">
        <h2 className="text-primary text-3xl md:text-4xl font-bold mb-2">Success Stories</h2>
        <p className="text-muted-foreground mb-10 text-base sm:text-lg">28,48,723+ placements — read their stories</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Story Card 1 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-foreground mb-3">Landed My Dream Job</h3>
            <p className="text-muted-foreground italic leading-relaxed">
              “Thanks to JobLane, I secured my first software development role in just 10 days! The application process was smooth and stress-free.”
            </p>
            <div className="mt-5 flex items-center gap-4 text-left">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Rohit"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/E0E7FF/3B82F6?text=RV"; }}
              />
              <div>
                <p className="font-bold text-foreground">Rohit Verma</p>
                <p className="text-sm text-muted-foreground">Placed at Infosys</p>
              </div>
            </div>
          </div>

          {/* Story Card 2 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-foreground mb-3">Career Restart Success</h3>
            <p className="text-muted-foreground italic leading-relaxed">
              “After a career break, I was unsure how to get back into the workforce. JobLane made it possible — I’m now happily employed!”
            </p>
            <div className="mt-5 flex items-center gap-4 text-left">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="Neha"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/E0E7FF/3B82F6?text=NS"; }}
              />
              <div>
                <p className="font-bold text-foreground">Neha Sinha</p>
                <p className="text-sm text-muted-foreground">Placed at Wipro</p>
              </div>
            </div>
          </div>

          {/* Story Card 3 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-foreground mb-3">First Job After College</h3>
            <p className="text-muted-foreground italic leading-relaxed">
              “JobLane helped me find my very first job right after graduation. The platform is user-friendly and filled with opportunities.”
            </p>
            <div className="mt-5 flex items-center gap-4 text-left">
              <img
                src="https://randomuser.me/api/portraits/men/43.jpg"
                alt="Amit"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/E0E7FF/3B82F6?text=AK"; }}
              />
              <div>
                <p className="font-bold text-foreground">Amit Kumar</p>
                <p className="text-sm text-muted-foreground">Placed at TCS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
