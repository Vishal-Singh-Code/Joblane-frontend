import PropTypes from 'prop-types';

function CheckboxGroup({ label, options, selected, onChange }) {
  const handleChange = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="block text-md font-medium text-secondary mb-2">
        {label}
      </label>
      <div className="space-y-2 text-sm text-foreground">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleChange(option)}
              className="accent-primary w-4 h-4"
            />
            <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

CheckboxGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxGroup;
