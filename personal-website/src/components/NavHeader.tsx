'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NavHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href="/" 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text-xl font-medium transition-all duration-500 inline-block
        ${isHovered ? 'transform scale-110 rotate-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500' : 'text-stone-800'}`}
      >
        Mason Veilleux
      </span>
      {/* Sparkle effects */}
      <span className={`absolute -inset-2 bg-gradient-to-r from-fuchsia-200 via-pink-200 to-purple-200 rounded-lg
        transition-all duration-500 -z-10 blur-xl
        ${isHovered ? 'opacity-70 scale-110 animate-pulse' : 'opacity-0 scale-0'}`}
      />
      {/* Rainbow underline */}
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 
        bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 rounded-full
        transition-all duration-500 ease-out
        ${isHovered ? 'transform scale-x-100 translate-x-0 opacity-100' : 'scale-x-0 translate-x-full opacity-0'}`}
      />
      {/* Floating particles */}
      <span className={`absolute -inset-4 transition-opacity duration-500
        ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`absolute w-2 h-2 rounded-full bg-pink-400
            animate-ping`} style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 200}ms`,
            animationDuration: '1s'
          }} />
        ))}
      </span>
    </Link>
  );
}