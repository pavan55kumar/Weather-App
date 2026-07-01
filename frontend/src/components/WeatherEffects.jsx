import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';

/**
 * WeatherEffects
 * Realistic, self-contained weather overlay (rain, snow, storm, fog, clear sky).
 * All keyframes are injected via a local <style> block so it works out of the
 * box even if your tailwind.config.js has no custom `animate-*` utilities.
 */
export default function WeatherEffects() {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.current) return null;

  const code = weatherData.current.weather_code;
  const hasValidCode = typeof code === 'number' && !Number.isNaN(code);

  // Only fall back to fuzzy string-matching on the payload when there's no
  // usable numeric WMO code at all — otherwise stray keys like "rain": 0 or
  // "precipitation": 0 elsewhere in the JSON would falsely trigger effects
  // even on a clear day.
  const rawDataString = hasValidCode ? '' : JSON.stringify(weatherData).toLowerCase();

  const isThunderstorm = hasValidCode
    ? [95, 96, 99].includes(code)
    : rawDataString.includes('thunder') || rawDataString.includes('storm');

  const isHeavyRain = hasValidCode
    ? [65, 67, 82].includes(code) || isThunderstorm
    : rawDataString.includes('heavy rain');

  const isLightRain = hasValidCode
    ? [51, 53, 55, 56, 57, 61, 63, 66, 80, 81].includes(code)
    : rawDataString.includes('rain') || rawDataString.includes('drizzle');

  const isSnow = hasValidCode
    ? [71, 73, 75, 77, 85, 86].includes(code)
    : rawDataString.includes('snow') || rawDataString.includes('blizzard');

  const isCloudy = hasValidCode
    ? [1, 2, 3, 45, 48].includes(code)
    : rawDataString.includes('cloud') || rawDataString.includes('fog');

  const isClear = hasValidCode
    ? code === 0
    : rawDataString.includes('clear') || rawDataString.includes('sunny');

  // ---------- Rain streaks (front + back parallax layers) ----------
  const rainParticles = useMemo(() => {
    if (!isLightRain && !isHeavyRain) return { front: [], back: [] };

    const countFront = isHeavyRain ? 70 : 25;
    const countBack = isHeavyRain ? 100 : 40;
    const windSkew = isHeavyRain ? -14 : -8; // deg, gives rain a wind-blown diagonal fall

    const front = Array.from({ length: countFront }).map((_, i) => ({
      id: `rf-${i}`,
      left: `${Math.random() * 115 - 5}%`,
      delay: `${Math.random() * 1.2}s`,
      duration: `${isHeavyRain ? 0.45 + Math.random() * 0.2 : 0.7 + Math.random() * 0.3}s`,
      height: isHeavyRain ? `${100 + Math.random() * 40}px` : `${65 + Math.random() * 25}px`,
      width: isHeavyRain ? '2px' : '1.4px',
      opacity: isHeavyRain ? 0.45 + Math.random() * 0.35 : 0.2 + Math.random() * 0.25,
      skew: windSkew + (Math.random() * 4 - 2),
    }));

    const back = Array.from({ length: countBack }).map((_, i) => ({
      id: `rb-${i}`,
      left: `${Math.random() * 115 - 5}%`,
      delay: `${Math.random() * 1.6}s`,
      duration: `${isHeavyRain ? 0.7 + Math.random() * 0.3 : 1 + Math.random() * 0.4}s`,
      height: isHeavyRain ? `${60 + Math.random() * 20}px` : `${38 + Math.random() * 16}px`,
      opacity: isHeavyRain ? 0.18 + Math.random() * 0.12 : 0.08 + Math.random() * 0.08,
      skew: windSkew,
    }));

    return { front, back };
  }, [isLightRain, isHeavyRain]);

  // Splash rings that pop where "heavy" front raindrops hit the bottom
  const splashes = useMemo(() => {
    if (!isHeavyRain) return [];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: `sp-${i}`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.4}s`,
      duration: `${0.5 + Math.random() * 0.4}s`,
      size: `${10 + Math.random() * 14}px`,
    }));
  }, [isHeavyRain]);

  // ---------- Snow ----------
  const snowParticles = useMemo(() => {
    if (!isSnow) return [];
    return Array.from({ length: 60 }).map((_, i) => ({
      id: `sn-${i}`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${5 + Math.random() * 5}s`,
      swayDuration: `${3 + Math.random() * 3}s`,
      size: `${2 + Math.random() * 5}px`,
      opacity: 0.25 + Math.random() * 0.55,
      blur: Math.random() > 0.55 ? '1px' : '0px',
    }));
  }, [isSnow]);

  // ---------- Drifting cloud blobs (cloudy / storm) ----------
  const clouds = useMemo(() => {
    if (!isCloudy && !isHeavyRain && !isThunderstorm) return [];
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `cl-${i}`,
      top: `${5 + Math.random() * 30}%`,
      width: `${300 + Math.random() * 300}px`,
      duration: `${40 + Math.random() * 30}s`,
      delay: `${-Math.random() * 40}s`,
      opacity: 0.12 + Math.random() * 0.15,
    }));
  }, [isCloudy, isHeavyRain, isThunderstorm]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30 select-none">
      <style>{`
        @keyframes wx-fall-front {
          0%   { transform: translateY(-15vh) skewX(var(--skew, -10deg)); }
          100% { transform: translateY(115vh) skewX(var(--skew, -10deg)); }
        }
        @keyframes wx-fall-back {
          0%   { transform: translateY(-15vh) skewX(var(--skew, -8deg)); }
          100% { transform: translateY(115vh) skewX(var(--skew, -8deg)); }
        }
        @keyframes wx-splash {
          0%   { transform: scale(0); opacity: 0.6; }
          70%  { opacity: 0.35; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes wx-snow-fall {
          0%   { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
        @keyframes wx-snow-sway {
          0%, 100% { margin-left: 0px; }
          50%      { margin-left: 30px; }
        }
        @keyframes wx-cloud-drift {
          0%   { transform: translateX(-20vw); }
          100% { transform: translateX(120vw); }
        }
        @keyframes wx-mist-breathe {
          0%, 100% { opacity: 0.28; transform: translateY(0px); }
          50%      { opacity: 0.42; transform: translateY(-8px); }
        }
        @keyframes wx-lightning {
          0%   { opacity: 0; }
          2%   { opacity: 0.85; }
          4%   { opacity: 0.1; }
          6%   { opacity: 0.7; }
          9%   { opacity: 0; }
          70%  { opacity: 0; }
          72%  { opacity: 0.55; }
          74%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes wx-solar-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        @keyframes wx-sun-rays {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* CLEAR SKY: soft glow + slow-rotating light rays */}
      {isClear && (
        <>
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(249,115,22,0.06) 45%, transparent 70%)',
              animation: 'wx-solar-pulse 6s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-20"
            style={{
              background:
                'repeating-conic-gradient(from 0deg, rgba(253,224,71,0.25) 0deg 4deg, transparent 4deg 18deg)',
              borderRadius: '50%',
              animation: 'wx-sun-rays 90s linear infinite',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Ambient color grade for overcast / rain / storm */}
      {(isCloudy || isLightRain || isHeavyRain) && (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/25 to-sky-950/10 mix-blend-multiply" />
      )}

      {/* Drifting cloud layer */}
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-full blur-3xl bg-slate-400"
          style={{
            top: c.top,
            width: c.width,
            height: '120px',
            opacity: c.opacity,
            animation: `wx-cloud-drift ${c.duration} linear infinite`,
            animationDelay: c.delay,
          }}
        />
      ))}

      {/* Low fog / mist for cloudy or heavy rain */}
      {(isCloudy || isHeavyRain) && (
        <div className="absolute -inset-10" style={{ animation: 'wx-mist-breathe 7s ease-in-out infinite' }}>
          <div className="absolute bottom-0 left-0 right-0 h-[45vh] bg-gradient-to-t from-slate-900/50 via-sky-900/10 to-transparent blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-slate-900/60 via-transparent to-transparent blur-2xl" />
        </div>
      )}

      {/* Background rain (parallax, softer) */}
      {(isLightRain || isHeavyRain) && (
        <div className="absolute inset-0">
          {rainParticles.back.map((p) => (
            <div
              key={p.id}
              className="absolute bg-gradient-to-b from-transparent via-sky-400/30 to-sky-200/50"
              style={{
                width: '1px',
                height: p.height,
                left: p.left,
                top: '-15vh',
                opacity: p.opacity,
                animation: `wx-fall-back ${p.duration} linear infinite`,
                animationDelay: p.delay,
                ['--skew']: `${p.skew}deg`,
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning flash */}
      {isThunderstorm && (
        <div
          className="absolute inset-0 bg-white mix-blend-overlay"
          style={{ animation: 'wx-lightning 6s ease-in-out infinite' }}
        />
      )}

      {/* Foreground rain (crisp, fast, wind-skewed) */}
      {(isLightRain || isHeavyRain) && (
        <div className="absolute inset-0">
          {rainParticles.front.map((p) => (
            <div
              key={p.id}
              className="absolute bg-gradient-to-b from-transparent via-sky-300 to-white/90 shadow-[0_0_3px_rgba(14,165,233,0.35)]"
              style={{
                width: p.width,
                height: p.height,
                left: p.left,
                top: '-15vh',
                opacity: p.opacity,
                animation: `wx-fall-front ${p.duration} linear infinite`,
                animationDelay: p.delay,
                ['--skew']: `${p.skew}deg`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ground splash rings for heavy rain */}
      {isHeavyRain && (
        <div className="absolute inset-x-0 bottom-0 h-1 overflow-visible">
          {splashes.map((s) => (
            <div
              key={s.id}
              className="absolute bottom-0 rounded-full border border-sky-200/60"
              style={{
                left: s.left,
                width: s.size,
                height: s.size,
                animation: `wx-splash ${s.duration} ease-out infinite`,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow: fall + independent horizontal sway for a natural drift */}
      {isSnow && (
        <div className="absolute inset-0">
          {snowParticles.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                left: p.left,
                top: '-10vh',
                animation: `wx-snow-fall ${p.duration} linear infinite`,
                animationDelay: p.delay,
              }}
            >
              <div
                className="rounded-full bg-white"
                style={{
                  width: p.size,
                  height: p.size,
                  opacity: p.opacity,
                  filter: `blur(${p.blur})`,
                  animation: `wx-snow-sway ${p.swayDuration} ease-in-out infinite`,
                  animationDelay: p.delay,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
