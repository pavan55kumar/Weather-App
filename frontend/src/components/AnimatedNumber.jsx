import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

/**
 * Animates a number counting up/down to `value` whenever it changes.
 * Drop-in replacement for a plain "{value}" anywhere a metric is displayed.
 *
 * Usage:
 *   <AnimatedNumber value={displayTemp} />°C
 *   <AnimatedNumber value={humidity} suffix="%" />
 *   <AnimatedNumber value={pressure} decimals={0} className="text-4xl font-black" />
 */
export default function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  springConfig = { stiffness: 90, damping: 20 },
}) {
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;

  // Always start the underlying spring at 0. Previously this was created
  // at `numericValue` and then manually reset to 0 + set back — since both
  // calls happened within the same tick, the browser never actually
  // painted the intermediate "0" state, so it looked like no animation was
  // happening at all (just an instant snap to the final number).
  const spring = useSpring(0, springConfig);
  const display = useTransform(spring, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}