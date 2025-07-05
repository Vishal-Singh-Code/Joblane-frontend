import { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';  // ✅ Import toast

const JOB_TYPE_CHOICES = ["Internship", "Part-time", "Full-time", "Hybrid"];

function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    ctc: '',
    start_date: '',
    experience: '',
    deadline: '',
    job_type: '',
    logo_url: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    skills: [''],
    perks: [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'company') {
      setFormData({
        ...formData,
        company: value,
        logo_url: `https://logo.clearbit.com/${value.toLowerCase()}.com`,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field, index, value) => {
    const copy = [...formData[field]];
    copy[index] = value;
    setFormData({ ...formData, [field]: copy });
  };

  const addArrayField = (field) => setFormData({ ...formData, [field]: [...formData[field], ''] });

  const removeArrayField = (field, index) => {
    const copy = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: copy });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(sessionStorage.getItem('joblaneUser') || localStorage.getItem('joblaneUser') || '{}');
    const token = storedUser.token;

    if (!token) {
      toast.error('You must be logged in to post a job.');
      return;
    }

    if (!formData.title || !formData.company || !formData.location || !formData.job_type) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const loadingToast = toast.loading('Posting job...');

    try {
      await axios.post('https://joblane-backend-0eqs.onrender.com/api/jobs/create/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.update(loadingToast, { render: 'Job posted successfully!', type: 'success', isLoading: false, autoClose: 3000 });

      // Optional: Reset the form
      setFormData({
        title: '',
        company: '',
        location: '',
        ctc: '',
        start_date: '',
        experience: '',
        deadline: '',
        job_type: '',
        logo_url: '',
        description: '',
        responsibilities: [''],
        requirements: [''],
        skills: [''],
        perks: [''],
      });

    } catch (error) {
      console.error("Full error:", error.response?.data);
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Failed to post job. Please try again.';
      toast.update(loadingToast, { render: errorMessage, type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <div className="text-left min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 border border-gray">

        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Post a Job</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                { name: 'title', label: 'Job Title', placeholder: 'Frontend Developer', type: 'text' },
                { name: 'company', label: 'Company Name', placeholder: 'Google', type: 'text' },
                { name: 'location', label: 'Location', placeholder: 'Bengaluru', type: 'text' },
                { name: 'ctc', label: 'CTC (Salary)', placeholder: '₹10 LPA', type: 'text' },
                { name: 'start_date', label: 'Start Date', placeholder: '', type: 'date' },   // ✅ CHANGED
                { name: 'experience', label: 'Experience', placeholder: '2+ years', type: 'text' },
                { name: 'deadline', label: 'Deadline', placeholder: '', type: 'date' },       // ✅ CHANGED
              ].map(({ name, label, placeholder, type }) => (
                <div key={name}>
                  <label className="block text-md font-medium mb-1 text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={name === 'title' || name === 'company' || name === 'start_date' || name === 'deadline'} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              ))}

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
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField(field)}
                className="text-indigo-600 text-md mt-1 hover:underline"
              >
                + Add {label.slice(0, -1)}
              </button>
            </section>
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg cursor-pointer"
          >
            Post Job
          </button>

        </form>

      </div>
    </div>
  );
}

export default PostJob;
