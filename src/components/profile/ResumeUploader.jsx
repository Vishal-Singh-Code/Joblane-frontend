import { FiUpload } from 'react-icons/fi';

export default function ResumeUploader({ editing, resume, onUpload, resumeLink }) {
  return (
    <div className="mb-6">
      <label className="block font-medium mb-2 text-secondary">Resume</label>

      {editing ? (
        <div className="flex items-center gap-4">
          <label
            htmlFor="resume"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-900"
          >
            <FiUpload /> Upload Resume
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx,.txt" 
            onChange={onUpload}
            className="hidden"
          />
          {resume && (
            <span className="text-sm text-gray-600 truncate max-w-xs">{resume.name}</span>
          )}
        </div>
      ) : resumeLink ? (
        <a
          href={resumeLink}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 underline"
        >
          📄 View Uploaded Resume
        </a>
      ) : (
        <p className="text-sm text-gray-500">No resume uploaded</p>
      )}
    </div>
  );
}
