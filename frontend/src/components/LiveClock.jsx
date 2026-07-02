import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentDate = time.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel rounded-2xl px-5 py-4 text-center"
    >
      <p className="text-slate-400 text-sm">{currentDate}</p>

      <h2 className="text-3xl font-bold text-white mt-1">
        {currentTime}
      </h2>
    </motion.div>
  );
}