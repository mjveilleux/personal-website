"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";

const links = [
  { href: "/", label: "Home" },
  { href: "/writings", label: "Writings" },
  { href: "/projects", label: "Projects" },
];

const VennGlyph = () => (
  <svg
    viewBox="0 0 60 32"
    className="h-8 w-14 text-[#1f403c]"
    aria-hidden
  >
    <g opacity="0.7">
      <circle cx="18" cy="16" r="12" fill="#dfe9e3" />
      <circle cx="30" cy="16" r="12" fill="#f2c6a0" />
      <circle cx="42" cy="16" r="12" fill="#c8dae2" />
    </g>
  </svg>
);

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 mx-auto mt-6 w-full max-w-6xl px-4">
      <nav className="hyggeligt-panel flex items-center justify-between rounded-full px-6 py-3 text-sm">
        <div className="flex items-center gap-3">
          <VennGlyph />
          <div>
            <Link
              href="/"
              className="font-display text-xl font-semibold text-[#1f403c]"
            >
              Mason Veilleux
            </Link>
            <p className="text-xs uppercase tracking-[0.5em] text-slate-500">
              Full-stack analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 font-medium transition duration-200",
                  active
                    ? "bg-[#26443b] text-white shadow-md"
                    : "text-[#1f403c] hover:bg-[#e9dfd3]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

export default TopNav;
