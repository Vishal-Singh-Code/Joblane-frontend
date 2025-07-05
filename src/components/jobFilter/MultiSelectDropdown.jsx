import PropTypes from 'prop-types';

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  searchValue,
  setSearchValue,
  showDropdown,
  setShowDropdown
}) {
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
    setSearchValue('');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <label className="block text-md font-medium mb-1">{label}</label>
      <div
        className="w-full border border-border rounded-md p-2 bg-card flex flex-wrap gap-2 min-h-[44px] cursor-text text-sm text-foreground"
        onClick={() => setShowDropdown(true)}
        role="combobox"
        aria-expanded={showDropdown}
      >
        {selected.map((item) => (
          <span
            key={item}
            className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-xs"
          >
            {item}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(selected.filter(val => val !== item));
              }}
              className="hover:scale-110 transition"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder={selected.length === 0 ? `Search ${label.toLowerCase()}...` : ""}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 min-w-[100px] bg-transparent focus:outline-none text-sm text-foreground"
        />
      </div>

      {showDropdown && (
        <div className="absolute mt-1 w-full z-10 bg-card border border-border rounded-md shadow-lg max-h-64 overflow-y-auto text-sm text-foreground">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-foreground/60">No results found</div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer transition ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-foreground/5'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {option}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

MultiSelectDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  setShowDropdown: PropTypes.func.isRequired,
};

export default MultiSelectDropdown;
