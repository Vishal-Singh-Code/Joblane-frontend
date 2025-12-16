import { useState, useEffect } from "react";
import axiosJob from "../../api/axiosJob";
import { toast } from "react-toastify";

const JOB_TYPE_CHOICES = ["Internship", "Part-time", "Full-time", "Hybrid"];

function PostJob() {
  const [hasCompany, setHasCompany] = useState(null); // null = loading
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    ctc: "",
    experience: "",
    deadline: "",
    job_type: "",
    description: "",
    responsibilities: [""],
    requirements: [""],
    skills: [""],
    perks: [""],
  });

  /* 🔍 CHECK COMPANY PROFILE (BACKEND SOURCE OF TRUTH) */
  useEffect(() => {
    const checkCompany = async () => {
      try {
        const res = await axiosJob.get("/recruiter/company/");
        setHasCompany(!!res.data?.id);
      } catch (error) {
        setHasCompany(false);
      }
    };

    checkCompany();
  }, []);

  /* BASIC FIELD CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ARRAY FIELD HANDLERS */
  const handleArrayChange = (field, index, value) => {
    const copy = [...formData[field]];
    copy[index] = value;
    setFormData((prev) => ({ ...prev, [field]: copy }));
  };

  const addArrayField = (field) =>
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));

  const removeArrayField = (field, index) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.job_type) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Posting job...");

    try {
      await axiosJob.post("/recruiter/jobs/", formData);

      toast.update(toastId, {
        render: "Job posted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setFormData({
        title: "",
        location: "",
        ctc: "",
        experience: "",
        deadline: "",
        job_type: "",
        description: "",
        responsibilities: [""],
        requirements: [""],
        skills: [""],
        perks: [""],
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to post job.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ⏳ LOADING STATE */
  if (hasCompany === null) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        Checking company profile...
      </div>
    );
  }

  /* 🚫 NO COMPANY PROFILE */
  if (!hasCompany) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg font-semibold">
        Please set your company details in your profile before posting a job.
      </div>
    );
  }


  return (
    <div className="text-left min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8 border border-gray-200">

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Post New Job</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* BASIC INFO */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'title', label: 'Job Title', placeholder: 'Frontend Developer', type: 'text' },
                  { name: 'location', label: 'Location', placeholder: 'Bengaluru', type: 'text' },
                  { name: 'ctc', label: 'CTC (Salary)', placeholder: '₹10 LPA', type: 'text' },
                  { name: 'experience', label: 'Experience', placeholder: '2+ years', type: 'text' },
                  { name: 'deadline', label: 'Deadline', type: 'date' },
                ].map(({ name, label, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-md font-medium mb-1 text-gray-700">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={['title', 'deadline'].includes(name)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />

                  </div>
                ))}

                {/* Job Type Dropdown */}
                <div>
                  <label className="block text-md font-medium mb-1 text-gray-700">Job Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    {JOB_TYPE_CHOICES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* DESCRIPTION */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">Job Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Briefly describe the role, expectations, and mission."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </section>

            {/* MULTI-FIELD ARRAYS */}
            {[
              { field: 'responsibilities', label: 'Responsibilities' },
              { field: 'requirements', label: 'Requirements' },
              { field: 'skills', label: 'Skills' },
              { field: 'perks', label: 'Perks' },
            ].map(({ field, label }) => (
              <section key={field}>
                <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">{label}</h2>
                {formData[field].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(field, index, e.target.value)}
                      placeholder={`${label} ${index + 1}`}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(field, index)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField(field)}
                  className="text-indigo-600 text-md mt-1 hover:underline "
                >
                  + Add {label.slice(0, -1)}
                </button>
              </section>
            ))}

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              Post Job
            </button>

          </form>

      </div>
    </div>
  );
}

export default PostJob;
