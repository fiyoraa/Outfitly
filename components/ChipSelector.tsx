"use client";

import { useEffect, useMemo, useState } from "react";

type ChipSelectorProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
  allowManualInput?: boolean;
};

export default function ChipSelector({ label, options, selected, onChange, allowManualInput = true }: ChipSelectorProps) {
  const [manualInput, setManualInput] = useState("");
  const [manualOptions, setManualOptions] = useState<string[]>([]);

  useEffect(() => {
    const extras = selected.filter((item) => !options.includes(item));

    if (extras.length === 0) {
      return;
    }

    setManualOptions((prev) => {
      const merged = [...prev];

      extras.forEach((extra) => {
        if (!merged.includes(extra)) {
          merged.push(extra);
        }
      });

      return merged;
    });
  }, [options, selected]);

  const mergedOptions = useMemo(() => {
    return [...options, ...manualOptions.filter((item) => !options.includes(item))];
  }, [manualOptions, options]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }

    onChange([...selected, option]);
  };

  const addManualOption = () => {
    const value = manualInput.trim();

    if (!value) {
      return;
    }

    if (!mergedOptions.includes(value)) {
      setManualOptions((prev) => [...prev, value]);
    }

    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }

    setManualInput("");
  };

  const removeManualOption = (option: string) => {
    setManualOptions((prev) => prev.filter((item) => item !== option));
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-[#1A1A1A]">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {mergedOptions.map((option) => {
          const isActive = selected.includes(option);
          const isManual = manualOptions.includes(option);

          return (
            <span
              key={option}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                isActive
                  ? "border-[#D4537E] bg-[#D4537E] text-white"
                  : "border-[#E8E4E0] bg-white text-[#1A1A1A] hover:border-[#D4537E]"
              }`}
            >
              <button type="button" onClick={() => toggleOption(option)} aria-pressed={isActive} className="font-medium">
                {option}
              </button>
              {isManual ? (
                <button
                  type="button"
                  onClick={() => removeManualOption(option)}
                  className="ml-2 text-xs leading-none opacity-70 hover:opacity-100"
                  aria-label={`Hapus ${option}`}
                >
                  ×
                </button>
              ) : null}
            </span>
          );
        })}
      </div>

      {allowManualInput ? (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={manualInput}
            onChange={(event) => setManualInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addManualOption();
              }
            }}
            placeholder="Ketik sendiri jika tidak ada..."
            className="w-full rounded-full border border-[#E8E4E0] px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-[#D4537E] focus:ring-1 focus:ring-[#D4537E]/20"
          />
          <button
            type="button"
            onClick={addManualOption}
            className="h-10 w-10 rounded-full border border-[#D4537E] text-sm font-medium text-[#D4537E] transition-all duration-200 hover:bg-[#F5F3F0]"
            aria-label="Tambah chip"
          >
            +
          </button>
        </div>
      ) : null}
    </section>
  );
}
