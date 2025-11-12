// Global config for Google Maps loader
export const GOOGLE_MAPS_LIBRARIES = Object.freeze(["marker"]);

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GOOGLE_MAPS_LOADER_CONFIG = {
  id: "google-map-script",
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries: GOOGLE_MAPS_LIBRARIES,
};
