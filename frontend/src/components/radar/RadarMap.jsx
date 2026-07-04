import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useWeather } from "../../context/WeatherContext";
import RadarControls from "./Radarcontrols";
import RadarLegend from "./RadarLegend";
import RadarTimeline from "./RadarTimeline";
s
// Leaflet's default marker icon references image paths that break under
// Vite/webpack bundling (a well-known react-leaflet gotcha). Rebuilding the
// icon from CDN URLs is the standard fix.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// MapContainer's `center` prop only applies on first mount — this component
// smoothly flies the map to the new city whenever it changes afterward.
function FlyToLocation({ lat, lon, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lon], zoom ?? map.getZoom(), { duration: 1.2 });
  }, [lat, lon, zoom, map]);

  return null;
}

const AUTOPLAY_INTERVAL_MS = 600;

export default function RadarMap() {
  const { currentLocation } = useWeather();
  const [activeLayer, setActiveLayer] = useState("rain");

  const [rainHost, setRainHost] = useState(null);
  const [rainFrames, setRainFrames] = useState([]); // combined past + nowcast
  const [rainNowIndex, setRainNowIndex] = useState(0); // index of the last "past" (real, non-forecast) frame
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

  const [satelliteFrame, setSatelliteFrame] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  const [flyTarget, setFlyTarget] = useState(null);
  const [locating, setLocating] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  // RainViewer's public API needs no key — it returns arrays of past radar
  // frames plus a short-term "nowcast" forecast, and a separate satellite
  // infrared list used for the Clouds layer.
  useEffect(() => {
    let cancelled = false;

    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        const past = data?.radar?.past ?? [];
        const nowcast = data?.radar?.nowcast ?? [];
        const combined = [...past, ...nowcast];

        if (combined.length > 0) {
          setRainHost(data.host);
          setRainFrames(combined);
          setRainNowIndex(past.length - 1);
          setSelectedFrameIndex(past.length - 1); // default to the most recent real frame
        }

        const latestSatellite = data?.satellite?.infrared?.slice(-1)[0];
        if (latestSatellite) {
          setSatelliteFrame(`${data.host}${latestSatellite.path}`);
        }
      })
      .catch((err) => {
        console.error("Failed to load RainViewer frames:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-play through the timeline when toggled on
  useEffect(() => {
    if (isPlaying && rainFrames.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setSelectedFrameIndex((prev) => (prev + 1) % rainFrames.length);
      }, AUTOPLAY_INTERVAL_MS);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, rainFrames.length]);

  // Stop auto-play if the user switches away from the rain layer
  useEffect(() => {
    if (activeLayer !== "rain") setIsPlaying(false);
  }, [activeLayer]);

  // Leaflet doesn't automatically notice its container changing size when
  // that happens programmatically (as with the Fullscreen API) — without
  // forcing invalidateSize(), the map stays rendered at its old dimensions
  // and tiles won't fill the new fullscreen area correctly.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement === containerRef.current;
      setIsFullscreen(isNowFullscreen);
      // Wait a tick for the browser to finish the fullscreen transition
      // before asking Leaflet to recalculate its size.
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 150);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFlyTarget({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          zoom: 10,
        });
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  if (!currentLocation) {
    return (
      <div className="w-full h-[420px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-500 text-sm">
        Search a city to load the radar map.
      </div>
    );
  }

  const { lat, lon } = flyTarget ?? currentLocation;
  const selectedRainFrame = rainFrames[selectedFrameIndex];

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden border border-white/10 relative z-0 ${
        isFullscreen ? "w-screen h-screen" : "w-full h-[420px] rounded-2xl"
      }`}
    >
      <MapContainer
        ref={mapRef}
        center={[lat, lon]}
        zoom={7}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeLayer === "rain" && selectedRainFrame && (
          <TileLayer
            key={selectedRainFrame.path} // forces the layer to refresh when the frame changes
            url={`${rainHost}${selectedRainFrame.path}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={0.65}
            zIndex={10}
          />
        )}

        {activeLayer === "clouds" && satelliteFrame && (
          <TileLayer
            url={`${satelliteFrame}/256/{z}/{x}/{y}/0/0_0.png`}
            opacity={0.55}
            zIndex={10}
          />
        )}

        <Marker position={[currentLocation.lat, currentLocation.lon]} />

        <FlyToLocation lat={lat} lon={lon} zoom={flyTarget ? 10 : undefined} />
      </MapContainer>

      <RadarControls
        activeLayer={activeLayer}
        onChangeLayer={setActiveLayer}
        onLocateMe={handleLocateMe}
        locating={locating}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {activeLayer === "rain" && rainFrames.length > 0 ? (
        <RadarTimeline
          frames={rainFrames}
          nowIndex={rainNowIndex}
          selectedIndex={selectedFrameIndex}
          onChange={(index) => {
            setIsPlaying(false);
            setSelectedFrameIndex(index);
          }}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
        />
      ) : (
        <RadarLegend activeLayer={activeLayer} />
      )}
    </div>
  );
}