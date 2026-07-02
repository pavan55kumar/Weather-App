import { motion } from "framer-motion";

export default function SnowBackground() {

  const flakes = Array.from({ length: 180 });

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      {/* Winter Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-sky-900 to-slate-950" />

      {/* Cold Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute top-0 left-10 w-[500px] h-[500px] rounded-full bg-cyan-300/20 blur-[180px]"
      />

      {/* Blue Glow */}
      <motion.div
        animate={{
          x: [-40, 40, -40],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-300/10 blur-[180px]"
      />

      {/* Snow */}
      {flakes.map((_, i) => (

        <motion.div
          key={i}
          initial={{
            y: -100,
            x: Math.random() * 2000,
            opacity: Math.random() * 0.8 + 0.2,
          }}
          animate={{
            y: 1300,
            x: [
              Math.random() * 2000,
              Math.random() * 2000 + 30,
              Math.random() * 2000 - 30,
            ],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 8,
          }}
          className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
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
        className="absolute bottom-0 w-full h-72 bg-white/5 blur-[90px]"
      />

      {/* Ice texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />

    </div>
  );
}