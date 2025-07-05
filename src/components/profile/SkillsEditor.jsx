import { FaPlus, FaTimes } from 'react-icons/fa';

export default function SkillsEditor({ skills, editing, onAdd, onRemove, skillInput, setSkillInput }) {
  return (
    <div className="mb-8">
      <label className="block font-semibold text-lg mb-3">Skills</label>

      {editing && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill (e.g., React)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
          >
            <FaPlus className="text-sm" /> Add Skill
          </button>
        </div>
      )}

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <span key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              {skill}
              {editing && (
                <button onClick={() => onRemove(skill)} className="text-gray-500 hover:text-red-600">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No skills added yet.</p>
      )}
    </div>
  );
}