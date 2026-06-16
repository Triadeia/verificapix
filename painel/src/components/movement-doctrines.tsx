"use client";

import { useState } from "react";
import { ChevronDown, BookOpenText } from "lucide-react";
import { MOVEMENT_DOCTRINES, type Doctrine } from "@/lib/movement-pillars";

export function MovementDoctrines() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-6 w-6 text-blue-700 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            As 10 Doutrinas Centrais
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Narrativas que fundamentam toda estratégia de campaña. Clique em cada
          uma para explorar.
        </p>
      </div>

      {/* Doctrines Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {MOVEMENT_DOCTRINES.map((doctrine, index) => (
          <DoctrinCard
            key={doctrine.id}
            doctrine={doctrine}
            isExpanded={expandedId === doctrine.id}
            onToggle={() => toggleExpanded(doctrine.id)}
            number={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

interface DoctrinCardProps {
  doctrine: Doctrine;
  isExpanded: boolean;
  onToggle: () => void;
  number: number;
}

function DoctrinCard({
  doctrine,
  isExpanded,
  onToggle,
  number,
}: DoctrinCardProps) {
  return (
    <button
      onClick={onToggle}
      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
    >
      {/* Accent Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700" />

      {/* Main Content */}
      <div className="flex items-start justify-between gap-4 p-6">
        <div className="flex-1 text-left">
          {/* Code & Category */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {doctrine.code}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {doctrine.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
            {doctrine.title}
          </h3>

          {/* Key Phrase */}
          <p className="mb-3 text-sm italic text-slate-600 dark:text-slate-400">
            "{doctrine.keyPhrase}"
          </p>

          {/* Short Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {doctrine.description}
          </p>

          {/* Framework - Only show when not expanded */}
          {!isExpanded && (
            <div className="mt-3 flex items-start gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Framework:
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {doctrine.framework}
              </span>
            </div>
          )}
        </div>

        {/* Chevron Icon */}
        <div className="mt-1 flex-shrink-0">
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform dark:text-slate-600 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">
                Framework
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {doctrine.framework}
              </p>
            </div>

            <div className="flex gap-4 rounded-lg bg-white p-4 dark:bg-slate-900">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Frase-Âncora
                </p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  "{doctrine.keyPhrase}"
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-500">
              📖 Doutrina completa disponível em{" "}
              <span className="font-mono text-blue-600 dark:text-blue-400">
                doutrinas/{doctrine.code.toLowerCase()}-...md
              </span>
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
