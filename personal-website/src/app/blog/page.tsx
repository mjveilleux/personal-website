'use client';
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Search, Mail, Github } from 'lucide-react'

interface BlogPost {
  title: string
  description: string
  link: string
  type: 'blog' | 'project'
  tags: string[]
  image: string
  linkType?: 'email' | 'github' | 'external'
}

const posts: BlogPost[] = [
  {
    title: "Multi-Collinearity is Weird",
    description: "I write about how increasing the correlation between two explantory variables skews your linear in the most unexpected ways.",
    link: "#",
    type: "blog",
    tags: ["econometrics", "statistics", "linear-regression"],
    image: "/blog/multicollinearity.jpg"
  },
  {
    title: "Predicting Hospital Readmissions",
    description: "I placed 1st in a DataCamp competition, this is my submission.",
    link: "#",
    type: "blog",
    tags: ["r", "shiny", "healthcare", "machine-learning"],
    image: "/blog/hospital.jpg"
  },
  {
    title: "RShiny App for Cash Businesses using P2P apps",
    description: "Made a Shiny App for P2P-based businesses to dashboard their revenue and customer info",
    link: "mailto:your@email.com",
    type: "project",
    tags: ["r", "shiny", "business", "dashboard"],
    image: "/blog/shiny.jpg",
    linkType: "email"
  },
  {
    title: "Using RSelenium with Docker",
    description: "A web-scraper in Docker just because Docker is beautiful.",
    link: "https://github.com/yourusername/rselenium-docker",
    type: "project",
    tags: ["docker", "r", "web-scraping"],
    image: "/blog/docker.jpg",
    linkType: "github"
  },
  {
    title: "Getting Started With Economics: A Guide for the Econ Curious",
    description: "I want to tell everyone about how amazing the field of economics and econometrics is. This is a little guide I made for someone starting an undergraduate degree and are curious about majoring in Economics.",
    link: "mailto:your@email.com",
    type: "project",
    tags: ["economics", "education", "guide"],
    image: "/blog/economics.jpg",
    linkType: "email"
  }
]

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))
  
  const filteredPosts = posts.filter(post => {
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
        <h1 className="text-4xl font-light">'Metrics Blog</h1>
        <p className="text-lg text-stone-700">
          I like to write about econometrics. Here are some posts I have written:
        </p>
      </motion.div>

      <motion.div 
        className="flex gap-4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
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
        </div>
      </motion.div>

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
              <div className="relative w-48 h-32 flex-shrink-0">
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