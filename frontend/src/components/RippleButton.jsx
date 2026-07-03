import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Drop-in replacement for a plain <button>. Adds a material-style ripple
 * on click, a spring scale-down on tap, and an optional glow on hover.
 *
 * Usage:
 *   <RippleButton onClick={...} className="your-existing-classes">
 *     content
 *   </RippleButton>
 *
 * `className` is applied exactly as before — this only wraps behavior,
 * it doesn't impose its own visual style, so it's safe to drop into any
 * existing styled button without fighting your design.
 */
export default function RippleButton({
  children,
  onClick,
  className = "",
  disabled = false,
  glowColor = "rgba(56, 189, 248, 0.35)",
  as: Component = "button",
  ...rest
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback(
    (e) => {
      if (!disabled) {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const id = Date.now();

        setRipples((prev) => [...prev, { id, x, y, size }]);
        // Clean up after the animation finishes so the DOM doesn't grow forever
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 650);
      }

      onClick?.(e);
    },
    [onClick, disabled]
  );

  return (
    <motion.div
      className="relative inline-block"
      whileHover={
        !disabled
          ? { boxShadow: `0 0 24px ${glowColor}`, filter: "brightness(1.08)" }
          : undefined
      }
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ borderRadius: "inherit" }}
    >
      <Component
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden ${className}`}
        {...rest}
      >
        {children}

        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.55 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
                borderRadius: "9999px",
                background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>
      </Component>
    </motion.div>
  );
}