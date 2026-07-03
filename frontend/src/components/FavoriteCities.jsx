import { Heart } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function FavoriteCities() {
  const { 
    favorites, 
    loadDashboardTelemetry, 
    removeFavoriteCity 
  } = useWeather();

  return (
    <div className="premium-card mt-6">
      <div className="flex items-center gap-3 mb-5">
        <Heart className="text-rose-400" />
        <h2 className="text-2xl font-bold text-white">
          Favorite Cities
        </h2>
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <Heart className="mx-auto mb-3 w-10 h-10 opacity-40" />
          <p className="text-lg font-semibold">
            No Favorite Cities
          </p>
          <p className="text-sm">
            Search a city and tap the ❤️ button.
          </p>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((city) => (
            <div
              key={city.name}
              className="rounded-xl bg-white/5 border border-white/10 hover:border-sky-400 transition-all p-4"
            >
              <div
                onClick={() => loadDashboardTelemetry(city)}
                className="cursor-pointer"
              >
                <p className="text-white font-semibold">
                  {city.name}
                </p>

                <p className="text-xs text-slate-400">
                  {city.country}
                </p>
              </div>

              <button
                onClick={() => removeFavoriteCity(city)}
                className="mt-3 text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}