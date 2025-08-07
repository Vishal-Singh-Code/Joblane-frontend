import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-16">
            <div className="text-left max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                <div>
                    <h2 className="text-2xl font-bold mb-4">JobLane</h2>
                    <p className="text-sm leading-relaxed text-white">
                        India’s #1 Hiring Platform connecting millions of job seekers with top companies.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm list-disc ml-3">
                        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                        <li><Link to="/jobs" className="hover:text-gray-300">Browse Jobs</Link></li>
                        <li><Link to="/companies" className="hover:text-gray-300">Companies</Link></li>
                        <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">For Employers</h3>
                    <ul className="space-y-2 text-sm list-disc ml-3">
                        <li><Link to="/post-job" className="hover:text-gray-300">Post a Job</Link></li>
                        <li><Link to="/view-applicants" className="hover:text-gray-300">View Applicants</Link></li>
                        <li><Link to="/pricing" className="hover:text-gray-300">Pricing</Link></li>
                        <li><Link to="/faq" className="hover:text-gray-300">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold">Follow Us</h3>
                    <div className="flex space-x-5 mt-3">
                        <a href="#" className="hover:text-primary" aria-label="Follow us on Facebook" rel="noopener noreferrer"><FaFacebookF size={20} /></a>
                        <a href="#" className="hover:text-primary" aria-label="Follow us on Twitter" rel="noopener noreferrer"><FaTwitter size={20} /></a>
                        <a href="#" className="hover:text-primary" aria-label="Follow us on Instagram" rel="noopener noreferrer"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-primary" aria-label="Follow us on Linkedin" rel="noopener noreferrer"><FaLinkedinIn size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} JobLane. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
