import { Download } from "lucide-react";
import { motion } from "framer-motion";
import usePWAInstall from "../../pwa/usePWAInstall";

export default function InstallButton() {
  const { canInstall, isInstalled, install } = usePWAInstall();

  if (isInstalled || !canInstall) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={install}
      className="
        flex items-center gap-2
        rounded-2xl
        px-5 py-3
        bg-sky-500
        hover:bg-sky-600
        text-white
        font-semibold
        shadow-lg
        transition-all
      "
    >
      <Download size={20} />

      Install AeroSky
    </motion.button>
  );
}