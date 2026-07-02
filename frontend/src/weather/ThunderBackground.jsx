import { motion } from "framer-motion";

export default function ThunderBackground() {
  const rainDrops = Array.from({ length: 180 });

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      {/* Storm Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />

      {/* Purple Storm Glow */}
      <motion.div
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 right-20 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[180px]"
      />

      {/* Blue Glow */}
      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-sky-500/15 blur-[180px]"
      />

      {/* Lightning Flash */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        animate={{
          opacity: [0, 0, 0.85, 0, 0, 0.65, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
      />

      {/* Rain */}
      {rainDrops.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -200,
            x: Math.random() * 2000,
            opacity: Math.random() * 0.6 + 0.3,
          }}
          animate={{
            y: 1400,
          }}
          transition={{
            duration: Math.random() * 0.5 + 0.35,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
          className="absolute w-[2px] h-24 bg-gradient-to-b from-sky-100 via-sky-300 to-transparent rotate-[18deg]"
        />
      ))}

      {/* Moving Fog */}
      <motion.div
        animate={{
          x: [-120, 120, -120],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 w-full h-64 bg-white/5 blur-[90px]"
      />

      {/* Dot Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px]" />

    </div>
  );
}