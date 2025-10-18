import { useState, useRef, useEffect, useMemo } from 'react';
import './selectLang.css';
import useGeoLocation from '../../hooks/useGeoLocation';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../Service/redux/languageSlice';

const SelectLang = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const selectRef = useRef(null);
  const dispatch = useDispatch();
  const { geoLocation } = useGeoLocation();

  const options = [
    { value: 'en-us', label: 'EN (US)' },
    { value: 'en-uk', label: 'EN (UK)' },
    { value: 'en-au', label: 'EN (AU)' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'Deutsch' }, //german
    { value: 'fr', label: 'French' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
  ];

  const selectedOption = options.find(option => option.value === selectedValue);

  const languageMatch = useMemo(() => ["es", "de", "fr", "it", "pt"], []);

  useEffect(() => {
    if (!geoLocation?.country_code) return;
    const countryCode = geoLocation?.country_code;
    if (countryCode === "GB") {
      setSelectedValue("en-uk")
    }
    else if (countryCode === "AU") {
      setSelectedValue("en-au")
    } else if (languageMatch.includes(countryCode?.toLowerCase())) {
      setSelectedValue(countryCode?.toLowerCase());
    }
    else {
      setSelectedValue("en-us");
    }
  }, [geoLocation, languageMatch]);

  useEffect(() => {
    dispatch(setLanguage(selectedValue));
  }, [selectedValue, dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="custom-select-container" ref={selectRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`custom-select-button ${isOpen ? 'active' : ''}`}
      >
        <span className={`custom-select-label ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : 'Select an option...'}
        </span>
        <span className={`custom-select-icon ${isOpen ? 'rotate' : ''}`}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      {isOpen && (
        <div className="custom-select-dropdown">
          <div className="custom-select-options">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className={`custom-select-option ${selectedValue === option.value ? 'selected' : ''}`}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectLang;
