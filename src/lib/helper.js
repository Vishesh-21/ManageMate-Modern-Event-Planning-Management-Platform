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
