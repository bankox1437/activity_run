import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Icon as Iconify } from '@iconify/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Leaflet Icon Fix ────────────────────────────────────────────────────────
// This fixes the issue where the default Leaflet icons don't show up correctly with build tools (Vite/Webpack).
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY;
const BANGKOK_COORDS = [13.7367, 100.5231];

// ── Sub-components ──────────────────────────────────────────────────────────

/**
 * Updater component to handle map panning/zoom changes when target coords change.
 */
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 16);
    }, [center, map]);
    return null;
}

/**
 * Event listener for map-wide click interactions.
 */
function MapEventsHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

// ── Main Component ───────────────────────────────────────────────────────────

const LocationSearch = ({
    onLocationSelect,
    initialValue = '',
    initialLat = null,
    initialLng = null
}) => {
    // UI State
    const [inputValue, setInputValue] = useState(initialValue);
    
    // Geographical State
    const [coords, setCoords] = useState(initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null);
    const [mapCenter, setMapCenter] = useState(initialLat && initialLng ? [initialLat, initialLng] : BANGKOK_COORDS);
    
    // Lib References
    const autoCompleteRef = useRef(null);
    const inputRef = useRef(null);
    const geocoderRef = useRef(null);

    /**
     * Centralized update function to keep state and parent synchronized.
     */
    const updateLocation = (address, lat, lng, shouldUpdateMap = false) => {
        setInputValue(address);
        setCoords({ lat, lng });
        if (shouldUpdateMap) setMapCenter([lat, lng]);
        
        // Notify parent component
        onLocationSelect({ address, lat, lng });
    };

    /**
     * Converts coordinates back into a human-readable address.
     */
    const resolveAddress = useCallback((lat, lng) => {
        if (!geocoderRef.current) return;

        geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                updateLocation(results[0].formatted_address, lat, lng, false);
            }
        });
    }, [onLocationSelect]);

    // ── Initialization Logic ───────────────────────────────────────────────────

    useEffect(() => {
        const initializeGoogleMaps = () => {
            if (!window.google) return;
            
            geocoderRef.current = new window.google.maps.Geocoder();

            if (inputRef.current) {
                // Initialize autocomplete search box
                autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ['geocode', 'establishment'],
                    componentRestrictions: { country: 'th' },
                    fields: ['formatted_address', 'geometry', 'name']
                });

                autoCompleteRef.current.addListener('place_changed', () => {
                    const place = autoCompleteRef.current.getPlace();
                    if (place.geometry) {
                        const address = place.formatted_address || place.name;
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        updateLocation(address, lat, lng, true);
                    }
                });
            }
        };

        // Load script injection or initialize directly if already present
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleMaps;
            document.head.appendChild(script);
        } else {
            initializeGoogleMaps();
        }
    }, []);

    // Sync initial value if it changes externally (e.g. during form resets or async loads)
    useEffect(() => {
        if (initialValue && !inputValue) setInputValue(initialValue);
        if (initialLat && initialLng && !coords) {
            setCoords({ lat: initialLat, lng: initialLng });
            setMapCenter([initialLat, initialLng]);
        }
    }, [initialValue, initialLat, initialLng]);

    // ── Map Handlers ──────────────────────────────────────────────────────────

    const handleMarkerDragEnd = (e) => {
        const { lat, lng } = e.target.getLatLng();
        resolveAddress(lat, lng);
    };

    const handleMapClick = (latlng) => {
        resolveAddress(latlng.lat, latlng.lng);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-3">
            {/* Search Input Box */}
            <div className="relative">
                <Iconify icon="mdi:map-marker-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search location or drag marker on map..."
                    className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm"
                />
            </div>

            {/* Map Area */}
            <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner relative z-0">
                <MapContainer
                    center={coords}
                    zoom={15}
                    scrollWheelZoom={true}
                    attributionControl={false}
                    className="z-0"
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution=''
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    {coords && (
                        <Marker
                            position={[coords.lat, coords.lng]}
                            draggable={true}
                            eventHandlers={{ dragend: handleMarkerDragEnd }}
                        />
                    )}
                    <MapUpdater center={mapCenter} />
                    <MapEventsHandler onMapClick={handleMapClick} />
                </MapContainer>
                
                {/* Empty State Overlay */}
                {!coords && (
                    <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                            <Iconify icon="mdi:gesture-tap" className="text-blue-500 animate-bounce" />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Search or Click Map to Select</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Instructions */}
            <p className="text-[10px] text-gray-400 italic px-1 flex items-center gap-1">
                <Iconify icon="mdi:information-outline" />
                Tip: Select from suggestions or click the map. Marker can be dragged.
            </p>
        </div>
    );
};

export default LocationSearch;
