const STORAGE_KEY = "aerosky-favorites";

export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFavorite(city) {
  const favorites = getFavorites();

  const exists = favorites.some(
    (item) =>
      item.lat === city.lat &&
      item.lon === city.lon
  );

  if (!exists) {
    favorites.push(city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(lat, lon) {
  const favorites = getFavorites().filter(
    (city) => !(city.lat === lat && city.lon === lon)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(lat, lon) {
  return getFavorites().some(
    (city) => city.lat === lat && city.lon === lon
  );
}