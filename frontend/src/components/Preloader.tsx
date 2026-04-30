"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRELOADER_COOLDOWN_MS = 10 * 60 * 1000;

const Preloader = () => {
  // Inisialisasi state dari sessionStorage untuk menentukan langkah animasi awal
  const [step, setStep] = useState(() =>
    typeof window !== "undefined" &&
    window.sessionStorage.getItem("hasSeenFullPreloader") === "true"
      ? 1
      : 0
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lastShownTime =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("lastPreloaderShown")
        : null;
    const currentTime = Date.now();

    // Lewati preloader jika masih dalam masa cooldown
    if (
      lastShownTime &&
      currentTime - Number(lastShownTime) < PRELOADER_COOLDOWN_MS
    ) {
      setIsLoading(false);
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const timers: NodeJS.Timeout[] = [];

    // Jika dimulai dari bentuk 'V' (step 1)
    if (step === 1) {
      timers.push(
        setTimeout(() => {
          setStep(2);
        }, 1000) // V untuk menghilang
      );
      timers.push(
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
          window.sessionStorage.setItem(
            "lastPreloaderShown",
            Date.now().toString()
          );
        }, 1500) // Durasi total untuk animasi yang lebih pendek ini
      );
    } else {
      // Jika dimulai dari bentuk '><' (step 0)
      timers.push(
        setTimeout(() => {
          setStep(1); // >< menjadi V
          // Atur flag agar lain kali kita mulai dari step 1
          window.sessionStorage.setItem("hasSeenFullPreloader", "true");
        }, 500)
      );
      timers.push(
        setTimeout(() => {
          setStep(2);
        }, 1500) // V untuk menghilang
      );
      timers.push(
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
          window.sessionStorage.setItem(
            "lastPreloaderShown",
            Date.now().toString()
          );
        }, 2000) // Durasi total untuk animasi penuh
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []); // Hanya berjalan sekali saat komponen dimuat

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#0a0f1c]"
        >
          <div className="relative flex items-center justify-center h-48 w-full">
            <AnimatePresence mode="wait">
              {step < 2 && (
                <motion.svg
                  key="logo"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-32 h-32 md:w-40 md:h-40 text-white drop-shadow-[0_0_25px_rgba(79,124,255,0.5)]"
                  initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    scale: 3,
                    filter: "blur(25px)",
                    transition: { duration: 0.7 },
                  }}
                >
                  {/* LEFT SHAPE */}
                  <motion.path
                    initial={{ d: "M 25 25 L 45 50 L 25 75" }}
                    animate={{
                      d:
                        step === 0
                          ? "M 25 25 L 45 50 L 25 75"
                          : "M 25 25 L 37.5 50 L 50 75",
                    }}
                    transition={{ duration: 1 }}
                  />

                  {/* RIGHT SHAPE */}
                  <motion.path
                    initial={{ d: "M 75 25 L 55 50 L 75 75" }}
                    animate={{
                      d:
                        step === 0
                          ? "M 75 25 L 55 50 L 75 75"
                          : "M 75 25 L 62.5 50 L 50 75",
                    }}
                    transition={{ duration: 1 }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
