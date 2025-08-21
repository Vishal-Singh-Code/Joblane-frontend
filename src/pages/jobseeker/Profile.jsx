import { useEffect, useState } from 'react';
import axios from "../../api/axios";
import { useAuth } from '../../contexts/AuthContext';
import ProfilePicture from '../../components/profile/ProfilePicture';
import ResumeUploader from '../../components/profile/ResumeUploader';
import SkillsEditor from '../../components/profile/SkillsEditor';
import { toast } from 'react-toastify';  

function JobseekerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    location: '',
    dob: '',
    gender: '',
    skills: [],
    resume: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [resume, setResume] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/profile/');
        setProfile(prev => ({ ...prev, ...res.data, skills: res.data.skills || [] }));
        setProfilePicPreview(res.data.profile_pic || null);
      } catch (err) {
        console.error('Error fetching profile', err);
        toast.error("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = () => {
    const skill = skillInput.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput('');
      toast.success("Skill added.");
    }
  };

  const handleSkillRemove = (skill) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    toast.info("Skill removed.");
  };

  const handleResumeUpload = (e) => setResume(e.target.files[0]);

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('role', user.role);
      formData.append('phone', profile.phone || '');
      formData.append('education', profile.education || '');
      formData.append('location', profile.location || '');
      formData.append('dob', profile.dob || '');
      formData.append('gender', profile.gender || '');
      formData.append('skills', JSON.stringify(profile.skills));

      if (resume && resume instanceof File) {
        formData.append('resume', resume);
      }

      if (profilePicFile && profilePicFile instanceof File) {
        formData.append('profile_pic', profilePicFile);
      }

      await axios.put('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Profile updated successfully!");
      setEditing(false);
      setProfilePicFile(null);
      setResume(null);

      const res = await axios.get('/profile/');
      setProfile(prev => ({ ...prev, ...res.data, skills: res.data.skills || [] }));
      setProfilePicPreview(res.data.profile_pic || null);

    } catch (error) {
      console.error('Failed to save profile', error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  const profileFields = [
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'education', label: 'Education', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'dob', label: 'Date of Birth', type: 'date' },
  ];

  return (
    <div className='bg-background p-4'>
    <div className=" bg-white max-w-5xl mx-auto p-6 font-inter shadow-lg rounded-xl border">

      <div className="text-sm sm:text-base flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-primary text-white px-5 py-2 rounded-md cursor-pointer">Edit Profile</button>
        ) : (
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-primary text-white px-5 py-2 rounded-md cursor-pointer">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md cursor-pointer">Cancel</button>
          </div>
        )}
      </div>

      <ProfilePicture preview={profilePicPreview} editing={editing} onUpload={handleProfilePicUpload} name={profile.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {profileFields.map(({ name, label, type }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={profile[name] ?? ''}
            onChange={(e) => handleProfileChange(name, e.target.value)}
            disabled={!editing}
            placeholder={label}
            className="border border-gray-300 rounded-md p-2"
          />
        ))}

        <select
          name="gender"
          value={profile.gender ?? ''}
          onChange={(e) => handleProfileChange('gender', e.target.value)}
          disabled={!editing}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <ResumeUploader editing={editing} resume={resume} onUpload={handleResumeUpload} resumeLink={profile.resume} />

      <SkillsEditor
        skills={profile.skills}
        editing={editing}
        onAdd={handleSkillAdd}
        onRemove={handleSkillRemove}
        skillInput={skillInput}
        setSkillInput={setSkillInput}
      />
    </div>
    </div>
  );
}

export default JobseekerProfile;
