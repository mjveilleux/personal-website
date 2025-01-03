'use client';
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Search, Mail, Github } from 'lucide-react'
import { BlogPosts } from './BlogSummary'
import FeaturedPosts from './FeaturedPosts';

const featuredPosts = BlogPosts
  .filter(post => post.featured.includes('true'))
  .slice(0, 5);

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const allTags = Array.from(new Set(BlogPosts.flatMap(post => post.tags)))
  
  const filteredPosts = BlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const getLinkIcon = (type?: string) => {
    switch(type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-light"> Mason's Musings</h1>
        <p className="text-lg text-stone-700">
          I write my musings here.
        </p>
      </motion.div>

       <FeaturedPosts posts={featuredPosts} />

      <div className="space-y-4">


         <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        <motion.div 
          className="flex gap-2 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === tag 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <a
              href={post.link}
              className="group flex gap-6 p-4 rounded-lg bg-white hover:shadow-lg transition-shadow border border-stone-100 block"
            >
              <div className="relative w-32 h-24 flex-shrink-200">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-medium group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  {getLinkIcon(post.linkType)}
                </div>
                <p className="text-stone-600 mb-4">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </motion.article>
        ))}
      </div>
    </div>
  )
}