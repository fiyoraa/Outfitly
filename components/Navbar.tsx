"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/generate", label: "Generate" },
  { href: "/gallery", label: "Gallery" },
  { href: "/couple", label: "Couple Mode" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E4E0] bg-[#FAFAF8]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="text-xl font-semibold text-[#D4537E] font-[family-name:var(--font-playfair)]">
            outfitly
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-[#D4537E] font-medium"
                    : "text-[#1A1A1A] hover:text-[#D4537E]"
                } after:absolute after:bottom-0 after:left-3 after:h-0.5 after:w-0 after:bg-[#D4537E] after:transition-all after:duration-300 hover:after:w-[calc(100%-24px)]`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/generate"
          className="rounded-full bg-[#D4537E] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#c1476f] hover:shadow-lg"
        >
          Generate
        </Link>
      </div>

      <nav className="mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-4 pb-3 md:hidden sm:px-6 lg:px-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${
                isActive
                  ? "border-[#D4537E] bg-[#F5F3F0] text-[#D4537E] font-medium"
                  : "border-[#E8E4E0] bg-white text-[#1A1A1A] hover:border-[#D4537E]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
