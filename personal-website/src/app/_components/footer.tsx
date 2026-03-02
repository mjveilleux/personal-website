export function Footer() {
  const links = [
    { label: "Email", href: "mailto:masonjveilleux@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/masonveilleux" },
    { label: "GitHub", href: "https://github.com/masonveilleux" },
  ];

  return (
    <footer className="mt-24 border-t border-slate-200/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg text-[#1f403c]">
          Built with intention from Anchorage, Alaska.
        </p>
        <div className="flex flex-wrap gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-semibold text-[#1f403c] underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
