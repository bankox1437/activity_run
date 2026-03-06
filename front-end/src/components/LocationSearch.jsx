import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY;

const LocationSearch = ({ onLocationSelect, initialValue = '' }) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const autoCompleteRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => handleScriptLoad();
            document.head.appendChild(script);
        } else {
            handleScriptLoad();
        }

        function handleScriptLoad() {
            if (!inputRef.current) return;

            autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode', 'establishment'],
                componentRestrictions: { country: 'th' },
                fields: ['formatted_address', 'geometry', 'name'] // Optimization: Only request these fields
            });

            autoCompleteRef.current.addListener('place_changed', () => {
                const place = autoCompleteRef.current.getPlace();
                if (place.geometry) {
                    const address = place.formatted_address || place.name;
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    setInputValue(address);
                    onLocationSelect({ address, lat, lng });
                }
            });
        }
    }, [onLocationSelect]);

    return (
        <div className="relative">
            <Icon icon="mdi:map-marker-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
        </div>
    );
};

export default LocationSearch;
