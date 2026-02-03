import { useState, useEffect } from "react";
import axiosJob from "../../api/axiosJob"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CompanyProfile() {
  const [formData, setFormData] = useState({ name: "", logo: null, });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingLogo, setExistingLogo] = useState(null);
  const [loading, setLoading] = useState(true);


  // fetch company
  useEffect(() => {
    const fetchCompany = async () => {

      try {
        const res = await axiosJob.get("/recruiter/company/");
        setFormData({ name: res.data.name, logo: null });
        setExistingLogo(res.data.logo);

      } catch (err) {
        const status = err?.response?.status;

        if (status === 404) {
          setExistingLogo(null);
        } else if (status === 401 || status === 403) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Failed to load company details");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // Temporary local url
  useEffect(() => {
    if (!formData.logo) return;

    const objectUrl = URL.createObjectURL(formData.logo);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);

  }, [formData.logo]);

  // Image Resize to fit properly
  const resizeImage = (file, size = 128) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;

      ctx.drawImage(
        img,
        (size - w) / 2,
        (size - h) / 2,
        w,
        h
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Image processing failed");
          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
              type: "image/webp",
            })
          );
        },
        "image/webp",
        0.85
      );
    };

    img.onerror = () => reject("Invalid image file");
    img.src = URL.createObjectURL(file);
  });


  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      if (files[0].size > 2 * 1024 * 1024) {
        toast.error("Logo must be under 2MB");
        return;
      }
      const resizedLogo = await resizeImage(files[0]);

      setFormData((prev) => ({ ...prev, logo: resizedLogo, }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value, }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();

      if (formData.name) data.append("name", formData.name);
      if (formData.logo) data.append("logo", formData.logo);

      await axiosJob.patch("/recruiter/company/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Company profile updated successfully!");
    } catch {
      toast.error("Failed to save company profile");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center text-gray-500">
        Loading company profile…
      </div>
    );
  }


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
        required={!existingLogo}
      />

      {preview ? (
        <div className="w-14 h-14 mt-2 border rounded bg-white flex items-center justify-center">
          <img
            src={preview || existingLogo}
            alt="Company logo"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : existingLogo ? (
        <img src={existingLogo} className="h-14 mt-2" />
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : existingLogo ? "Update" : "Create"}
      </button>

    </form>
  );
}

export default CompanyProfile;
