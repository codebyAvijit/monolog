// src/utils/localStorage.js
export const loadFromLocalStorage = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);

    //  handle invalid or "undefined"/"null" strings safely
    if (!data || data === "undefined" || data === "null") {
      return fallback;
    }

    return JSON.parse(data);
  } catch (e) {
    console.error("Error loading from localStorage:", e);
    return fallback;
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    if (data === undefined) {
      console.warn(`⚠️ Tried to save undefined data for key: ${key}`);
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
};
