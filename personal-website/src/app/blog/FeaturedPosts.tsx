import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mail, Github } from 'lucide-react';
import { BlogPost } from './BlogSummary';

const FeaturedPosts = ({ posts }: { posts: BlogPost[] }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const getLinkIcon = (type?: string) => {
    switch(type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      default:
        return null
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Featured Posts</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.title}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-80"
          >
            <a
              href={post.link}
              className="block group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative w-full h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.linkType && getLinkIcon(post.linkType)}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;