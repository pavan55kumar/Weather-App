import { motion } from "framer-motion";
import { CloudLightning, Heart } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 max-w-7xl mx-auto mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-900/60"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
            <CloudLightning className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">
              AeroSky <span className="text-sky-400">Premium</span>
            </p>
            <p className="text-xs text-slate-500">
              Weather powered by Open-Meteo
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          Designed with <Heart size={12} className="text-rose-400 fill-rose-400" /> by
          <span className="text-slate-300 font-semibold">Pavan Kumar</span>
        </p>

        <p className="text-xs font-semibold text-slate-600 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          Version 2.5
        </p>

      </div>
    </motion.footer>
  );
}