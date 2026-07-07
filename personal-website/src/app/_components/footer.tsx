export function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <p className="text-[12px] text-slate-400">
          © {new Date().getFullYear()} Mason Veilleux (assisted with Claude)
        </p>
      </div>
    </footer>
  );
}

export default Footer;
