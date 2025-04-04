'use client';
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, TwitterIcon, XIcon} from 'lucide-react'

const socials = [
  { href: 'https://github.com/mjveilleux', label: 'GitHub', icon: Github },
  { href: 'https://x.com/VeilleuxMason', label: 'The Bad Place', icon: XIcon },
  { href: 'https://linkedin.com/in/mason-veilleux', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://bsky.app/profile/fullstackeconomist.bsky.social', label: 'NotTwitter', icon: TwitterIcon }
] as const

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid md:grid-cols-[1.5fr,1fr] gap-12 items-start">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            My name is{' '}
            <span className="text-blue-600 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 after:transition-transform hover:after:scale-x-100">
              Mason Veilleux
            </span>{' '}
            and I am a data engineer, statistician, economist, back-end developer, and father. I like building cool stuff with cool people. 
          </motion.h1>

          <motion.div 
            className="space-y-6 text-lg leading-relaxed"
          >
            {[
              <>
                I consider myself a {" "}
                <span className="text-blue-600 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 after:transition-transform hover:after:scale-x-100">
                  full-stack economist
                </span>{" "}
                who can build back-end applications, analytics pipelines, and analyze data using my expertise in economic theory and statistics.
              </>,
              <>
                I earned my MSc in Econometrics where I researched
                <span className="text-blue-600 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 after:transition-transform hover:after:scale-x-100">
                macroeconomics and industrial organization
                </span>{","} particularly focusing on how firm-level characteristics and strategic behaviour shape macroeconomic outcomes.
      
              </>,
              "I currently live in the San Francisco Bay Area with my wife and baby boy.",
              <>
                I sometimes write{' '}
                <Link href="/blog" className="text-blue-600 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 after:transition-transform hover:after:scale-x-100">blogs</Link>
                {' '}and share my{' '}
                <Link href="/research" className="text-blue-600 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 after:transition-transform hover:after:scale-x-100">research</Link>
                {' '}on here.
              </>
            ].map((content, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {content}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            className="relative aspect-[3/4] w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/anon-pic.jpg"
              alt="Mason Veilleux"
              fill
              sizes='20x10'
              priority
              className="object-cover rounded-lg hover:shadow-xl transition-shadow duration-300"
            />
          </motion.div>

          <motion.div 
            className="flex justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {socials.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group relative p-2 hover:-translate-y-1 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {label}
                </span>
                <Icon className="w-6 h-6 text-stone-600 group-hover:text-stone-900 transition-colors" />
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
