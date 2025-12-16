import { useState } from "react";
import axiosJob from "../../api/axiosJob"
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CompanyProfile() {
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      setFormData((prev) => ({
        ...prev,
        logo: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.logo) {
      toast.error("Please upload company logo");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("logo", formData.logo);

      await axiosJob.put("/recruiter/company/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Company profile saved successfully!");
    } catch (error) {
      toast.error("Failed to save company profile");
      console.error(error);
    }

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-gray space-y-4 max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow"
    >
      {/* Company Name */}
      <label className="block text-sm sm:text-lg font-medium text-gray-700">
        Company Name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md"
        placeholder="e.g., Google"
        required
      />

      {/* Logo Upload */}
      <label className="block text-sm sm:text-lg font-medium text-gray-700">
        Company Logo
      </label>
      <input
        type="file"
        name="logo"
        accept="image/*"
        onChange={handleChange}
        className="w-full"
        required
      />

      {/* Preview */}
      {formData.logo && (
        <img
          src={URL.createObjectURL(formData.logo)}
          alt="Logo Preview"
          className="h-14 object-contain mt-2"
        />
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
