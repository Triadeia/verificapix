"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MOVEMENT_PILLARS, type Pillar } from "@/lib/movement-pillars";

export function MovementPillarsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const current = MOVEMENT_PILLARS[currentIndex];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOVEMENT_PILLARS.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex(
      (prev) => (prev - 1 + MOVEMENT_PILLARS.length) % MOVEMENT_PILLARS.length
    );
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % MOVEMENT_PILLARS.length);
  };

  const goToIndex = (index: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
      {/* Carousel Container */}
      <div className="relative min-h-96 w-full p-8 sm:p-12">
        {/* Content */}
        <div className="relative h-full">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Pilar {currentIndex + 1} de {MOVEMENT_PILLARS.length}
              </div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                {current.name}
              </h2>
            </div>

            <p className="text-lg text-slate-600 dark:text-slate-300">
              {current.description}
            </p>

            <div className="rounded-lg bg-white/60 px-6 py-4 backdrop-blur dark:bg-slate-800/40">
              <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                {current.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-8 right-8 flex gap-3">
          <button
            onClick={goToPrevious}
            className="rounded-full bg-white/80 p-2.5 backdrop-blur transition-all hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
            aria-label="Previous pillar"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={goToNext}
            className="rounded-full bg-white/80 p-2.5 backdrop-blur transition-all hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
            aria-label="Next pillar"
          >
            <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2.5 bg-white/50 px-8 py-4 backdrop-blur dark:bg-slate-900/50">
        {MOVEMENT_PILLARS.map((pillar, index) => (
          <button
            key={pillar.id}
            onClick={() => goToIndex(index)}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-blue-600 dark:bg-blue-500"
                : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
            }`}
            aria-label={`Go to pillar ${index + 1}: ${pillar.name}`}
            title={pillar.name}
          />
        ))}
      </div>
    </div>
  );
}
