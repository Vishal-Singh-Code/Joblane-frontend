import { FaCamera } from 'react-icons/fa';

function ProfilePicture({ preview, editing, onUpload , name}) {
  const firstLetter = name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative w-24 h-24 mb-8">
      {preview ? (
        <img
          src={preview}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border shadow"
        />
      ) : (
        <div className="w-full h-full bg-indigo-500 text-white rounded-full flex items-center justify-center text-5xl font-semibold shadow border">
          {firstLetter}
        </div>
      )}

      {editing && (
        <>
          <label
            htmlFor="profilePic"
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-blue-900"
          >
            <FaCamera size={14} />
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}

export default ProfilePicture;
