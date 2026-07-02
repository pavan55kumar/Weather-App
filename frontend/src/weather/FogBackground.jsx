import { motion } from "framer-motion";

export default function FogBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      {/* Fog Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900" />

      {/* Fog Layer 1 */}
      <motion.div
        animate={{ x: [-300, 300, -300] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 w-[2200px] h-72 bg-white/10 blur-[90px]"
      />

      {/* Fog Layer 2 */}
      <motion.div
        animate={{ x: [300, -300, 300] }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-52 w-[2200px] h-80 bg-white/8 blur-[110px]"
      />

      {/* Fog Layer 3 */}
      <motion.div
        animate={{ x: [-250, 250, -250] }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 w-[2200px] h-96 bg-white/10 blur-[130px]"
      />

      {/* Ambient Glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute left-20 top-10 w-[450px] h-[450px] rounded-full bg-cyan-300/20 blur-[180px]"
      />

      {/* Mist Overlay */}
      <div className="absolute inset-0 bg-white/[0.03]" />

      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px]" />

    </div>
  );
}