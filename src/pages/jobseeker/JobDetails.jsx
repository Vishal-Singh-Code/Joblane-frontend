import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShareAlt, FaRegBookmark, FaBookmark } from "react-icons/fa";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/jobs/${id}/`)
            .then((res) => {
                setJob(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Job fetch error", err);
                toast.error("Failed to load job details.");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`/jobs/${id}/is_saved/`)
            .then((res) => setSaved(res.data.saved))
            .catch(() => { });
    }, [id]);

    if (loading || !job) {
        return <div className="text-center py-10 text-gray-600">Loading job details...</div>;
    }

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: job.title,
                    text: `Check out this job at ${job.company}`,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            toast.error("Unable to share the job.");
        }
    };

    const toggleSave = async () => {
        try {
            const url = `/jobs/${id}/save/`;

            if (saved) {
                await axios.delete(url);
                setSaved(false);
                toast.success("Job removed from saved list.");
            } else {
                await axios.post(url);
                setSaved(true);
                toast.success("Job saved successfully!");
            }

        } catch (error) {
            console.error("Save job error", error);
            toast.error("You must be logged in to save jobs.");
        }
    };


    const applyToJob = async () => {
        try {
            const res = await axios.post(`/jobs/${id}/apply/`);
            toast.success(res.data.message || "Applied successfully.");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || "Already applied to this job.");
            } else {
                console.error("Unexpected error:", error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    const formatFullDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        // Output: August 1, 2025
    };


    return (
        <div className="bg-background min-h-screen py-10 px-4 sm:px-8 md:px-16 font-inter">
            <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg border border-border p-8 space-y-8">

                <div className="flex flex-row flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                            {job.title}
                        </h1>
                        <p className="text-xl text-foreground opacity-70 mt-1">
                            {job.company} · {job.location}
                        </p>
                    </div>
                    <img
                        src={job.logo_url}
                        alt={`${job.company} Logo`}
                        className="w-16 h-16 object-contain rounded-md bg-background p-2 border border-border"
                    />
                </div>

                <hr className="border-border" />

                <div className="grid grid-cols-4 gap-4 text-foreground opacity-80 text-sm">
                    <div className="flex flex-col">
                        <span className="font-medium">CTC</span>
                        <span>{job.ctc}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">Start Date</span>
                        <span>{formatFullDate(job.start_date)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">Experience</span>
                        <span>{job.experience}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">Apply By</span>
                        <span>{formatFullDate(job.deadline)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-foreground opacity-60 font-medium">Be early applicant</p>
                    <div className="flex gap-3">
                        <button
                            onClick={toggleSave}
                            className="p-2 rounded-full border border-border bg-background hover:bg-card text-primary cursor-pointer"
                            title={saved ? "Unsave Job" : "Save Job"}
                        >
                            {saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full border border-border bg-background hover:bg-card text-primary cursor-pointer"
                            title="Share Job"
                        >
                            <FaShareAlt size={20} />
                        </button>
                        <button
                            onClick={applyToJob}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:brightness-110 transition cursor-pointer"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>

                {["description", "responsibilities", "requirements"].map((section, idx) => (
                    <section key={idx} className="text-left">
                        <h2 className="text-lg font-semibold text-foreground mb-2">
                            {{
                                description: "About the Job",
                                responsibilities: "Key Responsibilities",
                                requirements: "Requirements",
                            }[section]}
                        </h2>
                        {Array.isArray(job[section]) ? (
                            <ul className="list-disc list-inside space-y-1 text-foreground opacity-80">
                                {job[section].map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-foreground opacity-80 leading-relaxed">{job[section]}</p>
                        )}
                    </section>
                ))}

                <section className="text-left">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="bg-background text-foreground px-3 py-1 rounded-full text-sm border border-border"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="text-left">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Perks</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.perks.map((perk, i) => (
                            <span
                                key={i}
                                className="bg-background text-foreground px-3 py-1 rounded-full text-sm border border-border"
                            >
                                {perk}
                            </span>
                        ))}
                    </div>
                </section>

                <div className="text-center mt-10">
                    <button
                        onClick={applyToJob}
                        className="bg-primary hover:brightness-110 text-primary-foreground text-lg px-8 py-3 rounded-full transition font-semibold shadow cursor-pointer"
                    >
                        Apply Now
                    </button>
                </div>

            </div>
        </div>
    );
}

export default JobDetails;
