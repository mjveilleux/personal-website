'use client';
import Link from 'next/link';
import { useState } from 'react';

const TopNav = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="space-x-8">
      {['About', 'Research', 'Blog'].map((item) => (
        <Link
          key={item}
          href={`/${item.toLowerCase()}`}
          className={`relative inline-block transition-all duration-300 transform
            ${hoveredItem === item ? 'text-pink-500 scale-110 -translate-y-1' : 'text-stone-800'}`}
          onMouseEnter={() => setHoveredItem(item)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {item}
          <span 
            className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
              transition-all duration-500 ease-in-out rounded-full
              ${hoveredItem === item ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
          />
          <span 
            className={`absolute -z-10 inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-lg
              transition-all duration-300 ease-in-out blur-lg
              ${hoveredItem === item ? 'opacity-70 scale-150' : 'opacity-0 scale-0'}`}
          />
        </Link>
      ))}
    </div>
  );
};

export default TopNav;