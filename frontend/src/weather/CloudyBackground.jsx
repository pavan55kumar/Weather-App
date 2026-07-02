import { motion } from "framer-motion";

export default function CloudyBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-800 to-slate-900" />

      {/* Glow */}
      <div className="absolute top-20 left-24 w-96 h-96 rounded-full bg-slate-400/10 blur-[120px]" />

      {/* Cloud 1 */}
      <motion.div
        animate={{ x: [-250, 1600] }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-24 left-0"
      >
        <div className="w-72 h-28 rounded-full bg-white/10 blur-xl" />
      </motion.div>

      {/* Cloud 2 */}
      <motion.div
        animate={{ x: [1500, -400] }}
        transition={{
          duration: 95,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-64 right-0"
      >
        <div className="w-96 h-32 rounded-full bg-white/8 blur-xl" />
      </motion.div>

      {/* Cloud 3 */}
      <motion.div
        animate={{ x: [-300, 1700] }}
        transition={{
          duration: 110,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-40 left-0"
      >
        <div className="w-80 h-32 rounded-full bg-white/8 blur-2xl" />
      </motion.div>

      {/* Atmospheric haze */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px]" />

    </div>
  );
}