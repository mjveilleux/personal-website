'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NavHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href="/" 
      className={`relative inline-block transition-all duration-300 transform
        ${isHovered ? 'text-pink-500 scale-110 -translate-y-1' : 'text-stone-800'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-xl font-medium">
        Mason Veilleux
      </span>
      
      {/* Gradient underline - matching your existing style */}
      <span 
        className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
          transition-all duration-500 ease-in-out rounded-full
          ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
      />
      
      {/* Gradient glow effect - matching your existing style */}
      <span 
        className={`absolute -z-10 inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-lg
          transition-all duration-300 ease-in-out blur-lg
          ${isHovered ? 'opacity-70 scale-150' : 'opacity-0 scale-0'}`}
      />
    </Link>
  );
}