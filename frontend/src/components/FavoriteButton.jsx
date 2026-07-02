import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoriteButton({
  active,
  onClick,
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md hover:border-red-400 transition"
    >
      <Heart
        size={22}
        className={
          active
            ? "fill-red-500 text-red-500"
            : "text-slate-300"
        }
      />
    </motion.button>
  );
}