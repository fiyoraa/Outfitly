"use client";

type ColorPickerProps = {
  selected: string;
  onChange: (nextColor: string) => void;
  options?: Array<{ label: string; value: string }>;
};

const colorOptions = [
  { label: "Blush Pink", value: "#d4537e" },
  { label: "Cream", value: "#f5eee6" },
  { label: "Soft Gray", value: "#d7d5d8" },
  { label: "Mocha", value: "#9f8679" },
  { label: "Sky Blue", value: "#9dbcd4" },
  { label: "Olive", value: "#8a9968" },
];

export default function ColorPicker({ selected, onChange, options = colorOptions }: ColorPickerProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-[#1A1A1A]">Favorite Color</h3>
      <div className="flex flex-wrap gap-4">
        {options.map((color) => {
          const isActive = selected === color.value;

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange(color.value)}
              className={`group flex flex-col items-center gap-2 transition-all duration-200 ${
                isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
              aria-pressed={isActive}
            >
              <span
                className={`h-10 w-10 rounded-full border-2 shadow-sm transition-all duration-200 ${
                  isActive ? "border-[#D4537E] ring-2 ring-[#D4537E]/30" : "border-white hover:shadow-md"
                }`}
                style={{ backgroundColor: color.value }}
                aria-hidden
              />
              <span className="text-xs text-[#666666] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {color.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
