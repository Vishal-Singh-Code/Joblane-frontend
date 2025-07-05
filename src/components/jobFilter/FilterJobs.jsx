import PropTypes from 'prop-types';
import MultiSelectDropdown from './MultiSelectDropdown';
import CheckboxGroup from './CheckboxGroup';

const ALL_LOCATIONS = ["Remote", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai"];
const ALL_PROFILES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Data Analyst",
  "UI/UX Designer",
  "ML Engineer",
  "Full Stack Developer"
];

function FilterJobs({
  profileFilter,
  setProfileFilter,
  experienceFilter,
  setExperienceFilter,
  setSearchQuery,
  closeMobileFilter,
  jobTypeFilter,
  setJobTypeFilter,
  setLocationSearch,
  locationSearch,
  locationFilter,
  setLocationFilter,
  showLocationDropdown,
  setShowLocationDropdown,
  showProfileDropdown,
  profileSearch,
  setProfileSearch,
  setShowProfileDropdown
}) {

  return (
    <div className="bg-card border border-border p-8 rounded-xl shadow-sm w-full md:w-auto text-foreground">
      <div className="space-y-5">

        {/* Profile Filter */}
        <div >
          <MultiSelectDropdown
            label="Job Roles"
            options={ALL_PROFILES}
            selected={profileFilter}
            onChange={setProfileFilter}
            searchValue={profileSearch}
            setSearchValue={(value) => {
              setProfileSearch(value);
              setShowLocationDropdown(false);  // Close location when typing/searching
            }}
            showDropdown={showProfileDropdown}
            setShowDropdown={(val) => {
              setShowProfileDropdown(val);
              if (val) setShowLocationDropdown(false);  // Close location when opening profile
            }} />
        </div>

        {/* Location Filter */}
        <div >
          <MultiSelectDropdown
            label="Preferred Locations"
            options={ALL_LOCATIONS}
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
          <label className="block text-md font-medium text-secondary mb-1">Experience</label>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          >
            <option value="">All</option>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
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
              setLocationFilter([]);
              setExperienceFilter('');
              setSearchQuery('');
              setJobTypeFilter([]);
              setLocationSearch('');
              setProfileFilter([]);
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
  profileFilter: PropTypes.array.isRequired,
  setProfileFilter: PropTypes.func.isRequired,
  experienceFilter: PropTypes.string.isRequired,
  setExperienceFilter: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  closeMobileFilter: PropTypes.func,
  jobTypeFilter: PropTypes.array.isRequired,
  setJobTypeFilter: PropTypes.func.isRequired,
  setLocationSearch: PropTypes.func.isRequired,
  locationSearch: PropTypes.string.isRequired,
  locationFilter: PropTypes.array.isRequired,
  setLocationFilter: PropTypes.func.isRequired,
  showLocationDropdown: PropTypes.bool.isRequired,
  setShowLocationDropdown: PropTypes.func.isRequired,
  showProfileDropdown: PropTypes.bool.isRequired,
  profileSearch: PropTypes.string.isRequired,
  setProfileSearch: PropTypes.func.isRequired,
  setShowProfileDropdown: PropTypes.func.isRequired
};

export default FilterJobs;
