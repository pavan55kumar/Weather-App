import { motion } from "framer-motion";

export default function RainBackground() {
  // Create 120 rain drops
  const drops = Array.from({ length: 120 });

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      {/* Dark rainy sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />

      {/* Blue glow */}
      <div className="absolute top-10 left-20 w-[500px] h-[500px] rounded-full bg-sky-500/20 blur-[150px]" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[180px]" />

      {/* Rain */}
      {drops.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -150,
            x: Math.random() * window.innerWidth,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            y: window.innerHeight + 200,
          }}
          transition={{
            duration: Math.random() * 0.8 + 0.5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
          className="absolute w-[2px] h-20 bg-gradient-to-b from-sky-200 via-sky-400 to-transparent rotate-[12deg]"
        />
      ))}

      {/* Fog */}
      <motion.div
        animate={{
          x: [-80, 80, -80],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 w-full h-60 bg-white/5 blur-[80px]"
      />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px]" />

    </div>
  );
}