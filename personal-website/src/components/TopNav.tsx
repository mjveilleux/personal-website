// src/components/TopNav.tsx
import Link from 'next/link';

const TopNav = () => {
  return (
    <div className="space-x-8">
      {['About', 'Research', 'Blog'].map((item) => (
        <Link
          key={item}
          href={`/${item.toLowerCase()}`}
          className="hover:text-stone-600 transition-colors"
        >
          {item}
        </Link>
      ))}
    </div>
  );
};

export default TopNav;