import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CompanyProfile() {
  const [formData, setFormData] = useState({
    company_name: "",
    logo_url: "",
  });

  const [isLogoLoading, setIsLogoLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company_name") {
      const domain = value.trim().toLowerCase();
      const fullDomain = domain.endsWith(".com") ? domain : `${domain}.com`;

      setIsLogoLoading(!!domain);

      setFormData({
        ...formData,
        company_name: value,
        logo_url: `https://logo.clearbit.com/${fullDomain}`,
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save in localStorage only
    localStorage.setItem(
      "joblaneCompany",
      JSON.stringify({
        company: formData.company_name,
        logo_url: formData.logo_url,
      })
    );

    toast.success("Company profile saved locally!");

    setFormData({
      company_name: "",
      logo_url: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-gray space-y-4 max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow"
    >
      <label
        htmlFor="company_name"
        className="block text-sm sm:text-lg  font-medium text-gray-700"
      >
        Company Name:
      </label>
      <input
        type="text"
        name="company_name"
        id="company_name"
        onChange={handleChange}
        value={formData.company_name}
        className="w-full px-3 py-2 border rounded-md"
        placeholder="e.g., google"
        required
      />

      {formData.logo_url && (
        <div className="mt-2">
          {isLogoLoading && (
            <p className="text-sm text-gray-400">Loading logo...</p>
          )}
          <img
            key={formData.logo_url}
            src={formData.logo_url}
            alt="Company Logo"
            className="h-10"
            onLoad={() => setIsLogoLoading(false)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-logo.png";
              setIsLogoLoading(false);
            }}
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}

export default CompanyProfile;
