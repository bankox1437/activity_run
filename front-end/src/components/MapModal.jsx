import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from '@iconify/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Leaflet Icon Reset ────────────────────────────────────────────────────────
// Using standard Leaflet marker icons but ensuring they load correctly.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MAP_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MAP_ATTRIBUTION = "";

// ── Sub-components ──────────────────────────────────────────────────────────

function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
}

// ── Main Component ───────────────────────────────────────────────────────────

const MapModal = ({ isOpen, onClose, activity }) => {
    if (!isOpen || !activity) return null;

    const { title, location, latitude, longitude } = activity;
    const hasCoordinates = latitude && longitude;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container: Smaller, compact view */}
            <div className="relative w-full max-w-lg h-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden scale-in-center">

                {/* Compact Integrated Header */}
                <div className="absolute top-0 inset-x-0 z-[1001] bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100/50 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{title}</h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-tight line-clamp-2">
                            <Icon icon="mdi:map-marker" className="inline mr-1 text-blue-500" />
                            {location || 'No address provided'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-red-500 transition-all cursor-pointer"
                        title="Close"
                    >
                        <Icon icon="mdi:close" className="text-xl" />
                    </button>
                </div>

                {/* Map Body */}
                <div className="w-full h-full relative z-0">
                    {hasCoordinates ? (
                        <MapContainer
                            center={[latitude, longitude]}
                            zoom={15}
                            scrollWheelZoom={true}
                            attributionControl={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />

                            <Marker position={[latitude, longitude]}>
                                <Popup minWidth={180}>
                                    <div className="p-0.5">
                                        <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1 leading-tight">
                                            <Icon icon="mdi:map-marker" className="text-blue-500" />
                                            {location}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>

                            <RecenterMap lat={latitude} lng={longitude} />
                        </MapContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2 p-6 text-center">
                            <Icon icon="mdi:map-marker-off-outline" className="text-5xl opacity-20" />
                            <p className="text-sm font-semibold">Location coordinates unavailable</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapModal;
