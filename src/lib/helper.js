import { State, City } from "country-state-city";

export const createSlug = (city, state) => {
  if (!city || !state) return "";

  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  const stateSlug = state.toLowerCase().replace(/\s+/g, "-");
  return `${citySlug}-${stateSlug}`;
};
export function parsedLocationSlug(slug) {
  if (!slug || typeof slug !== "string")
    return {
      city: null,
      state: null,
      isValid: false,
    };
  const parts = slug.split("-");

  if (parts.length < 2) {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  const cityName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const stateName = parts
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const indianStates = State.getStatesOfCountry("IN");

  const state = indianStates.find(
    (state) => state.name.toLowerCase() === stateName.toLowerCase()
  );

  if (!state) {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  const cities = City.getCitiesOfState("IN", state.isoCode);
  const city = cities.some(
    (city) => city.name.toLowerCase() === cityName.toLowerCase()
  );

  if (!city) {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  return {
    city: cityName,
    state: stateName,
    isValid: true,
  };
}

//debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

//color presets - show all for pro , only default for free
export const colorPresetsFunction = (hasPro) => {
  if (hasPro) {
    return [
      "#1e3a8a",
      "#1e293b",
      "#991b1b",
      "#c2410c",
      "#ca8a04",
      "#65a30d",
      "#15803d",
      "#0d9488",
      "#06b6d4",
      "#0284c7",
      "#86198f",
      "#6d28d9",
      "#3b82f6",
      "#e879f9",
      "#a5b4fc",
      "#a78bfa",
      "#082f49",
    ];
  } else {
    return ["#1e3a8a"];
  }
};

//to combine date and time to single ISO string
export const combineDateAndTime = (date, time) => {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};
