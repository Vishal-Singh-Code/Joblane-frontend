import {useState , useEffect} from 'react'
import axiosJob from '../../api/axiosJob'
import PropTypes from 'prop-types';
import MultiSelectDropdown from './MultiSelectDropdown';
import CheckboxGroup from './CheckboxGroup';

function FilterJobs({
  // serach bar
  profileSearch,
  setProfileSearch,

  locationSearch,
  setLocationSearch,

  // Filters
  profileFilter,
  setProfileFilter,

  locationFilter,
  setLocationFilter,

  experienceFilter,
  setExperienceFilter,

  jobTypeFilter,
  setJobTypeFilter,

  // dropdown
  showLocationDropdown,
  setShowLocationDropdown,

  showProfileDropdown,
  setShowProfileDropdown,

  // mobile view
  setSearchQuery,
  closeMobileFilter,
}) {
  const [locations, setLocations] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
  const fetchFilters = async () => {
    try {
      const response = await axiosJob.get('/filters/');
      setLocations(response.data.locations);
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  fetchFilters();
}, []);

  return (
    <div className="bg-card border border-border p-8 rounded-xl shadow-sm w-full md:w-auto text-foreground">
      <div className="space-y-5">

        {/* Profile Filter */}
        <div >
          <MultiSelectDropdown
            label="Job Roles"
            options={profiles}
            selected={profileFilter}
            onChange={setProfileFilter}
            searchValue={profileSearch}
            setSearchValue={(value) => {
              setProfileSearch(value);
              setShowLocationDropdown(false);  
            }}
            showDropdown={showProfileDropdown}
            setShowDropdown={(val) => {
              setShowProfileDropdown(val);
              if (val) setShowLocationDropdown(false);
            }} />
        </div>

        {/* Location Filter */}
        <div >
          <MultiSelectDropdown
            label="Preferred Locations"
            options={locations}
            selected={locationFilter}
            onChange={setLocationFilter}
            searchValue={locationSearch}
            setSearchValue={setLocationSearch}
            showDropdown={showLocationDropdown}
            setShowDropdown={setShowLocationDropdown}
          />
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-md font-medium text-black mb-1">Experience</label>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          >
            <option value="">All</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>

        {/* Job Type */}
        <CheckboxGroup
          label="Job Type"
          options={["Internship", "Part-time", "Full-time", "Hybrid"]}
          selected={jobTypeFilter}
          onChange={setJobTypeFilter}
        />

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:brightness-110 transition"
            onClick={() => {
              setSearchQuery((prev) => prev + '');
              if (closeMobileFilter) closeMobileFilter();
            }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setLocationSearch('');
              setProfileFilter([]);
              setLocationFilter([]);
              setExperienceFilter('');
              setJobTypeFilter([]);
              setShowLocationDropdown(false);
              setShowProfileDropdown(false);
            }}
            className="text-primary border border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition"
          >
            Reset Filters
          </button>
        </div>

      </div>
    </div>

  );
}

FilterJobs.propTypes = {
  // searchbar
  profileSearch: PropTypes.string.isRequired,
  setProfileSearch: PropTypes.func.isRequired,

  locationSearch: PropTypes.string.isRequired,
  setLocationSearch: PropTypes.func.isRequired,

  // Filters
  profileFilter: PropTypes.array.isRequired,
  setProfileFilter: PropTypes.func.isRequired,

  locationFilter: PropTypes.array.isRequired,
  setLocationFilter: PropTypes.func.isRequired,

  experienceFilter: PropTypes.string.isRequired,
  setExperienceFilter: PropTypes.func.isRequired,

  jobTypeFilter: PropTypes.array.isRequired,
  setJobTypeFilter: PropTypes.func.isRequired,

  // dropdowns
  showProfileDropdown: PropTypes.bool.isRequired,
  setShowProfileDropdown: PropTypes.func.isRequired,

  showLocationDropdown: PropTypes.bool.isRequired,
  setShowLocationDropdown: PropTypes.func.isRequired,

  // mobile phone
  setSearchQuery: PropTypes.func.isRequired,
  closeMobileFilter: PropTypes.func,
};

export default FilterJobs;
