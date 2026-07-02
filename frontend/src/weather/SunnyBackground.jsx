import { motion } from "framer-motion";

export default function SunnyBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-600 to-slate-900" />

      {/* Sun Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-16 right-24 w-72 h-72 rounded-full bg-yellow-300 blur-[120px]"
      />

      {/* Cyan Glow */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-cyan-400/20 blur-[150px]"
      />

      {/* Floating Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: 800,
            opacity: 0,
            x: Math.random() * window.innerWidth,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          className="absolute w-2 h-2 rounded-full bg-white/40"
        />
      ))}

    </div>
  );
}