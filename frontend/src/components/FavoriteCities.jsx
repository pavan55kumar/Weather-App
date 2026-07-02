import { Heart } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

const favorites = [
  {
    name: "Delhi",
    state: "Delhi",
    country: "India",
    lat: 28.6139,
    lon: 77.2090,
  },
  {
    name: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
  },
  {
    name: "London",
    state: "England",
    country: "United Kingdom",
    lat: 51.5072,
    lon: -0.1276,
  },
  {
    name: "New York",
    state: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.0060,
  },
];

export default function FavoriteCities() {

  const { loadDashboardTelemetry } = useWeather();

  return (

    <div className="premium-card mt-6">

      <div className="flex items-center gap-3 mb-5">

        <Heart className="text-rose-400" />

        <h2 className="text-2xl font-bold text-white">

          Favorite Cities

        </h2>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {favorites.map((city) => (

          <button
            key={city.name}
            onClick={() => loadDashboardTelemetry(city)}
            className="rounded-xl bg-white/5 border border-white/10 hover:bg-sky-500/10 hover:border-sky-400 transition-all p-4"
          >

            <p className="text-white font-semibold">

              {city.name}

            </p>

            <p className="text-xs text-slate-400">

              {city.country}

            </p>

          </button>

        ))}

      </div>

    </div>

  );

}