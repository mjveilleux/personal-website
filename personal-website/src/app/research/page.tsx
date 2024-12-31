'use client';

import { motion } from 'framer-motion'

interface Paper {
  title: string
  status: string
  year: string
  description: string
}

const papers: Paper[] = [
  {
    title: "Innovative Knowledge, Firm Creation, and Local Growth",
    status: "MSc Dissertation",
    year: "2022",
    description: "US Cities from 1979-2010 exposed to innovative knowledge flows experience higher long-run firm entry. Heterogenous analysis finds that, through the firm entry channel, knowledge in computer-related technologies had the largest affect on local growth."
  },
  {
    title: "Transmission of Agricultural Income Shocks on Differentitated Marriage Market Decisions",
    status: "",
    year: "2022",
    description: "After harvests, female marriage age decreases and marriage rates increase. I introduce a model that illustrates the transmission of agricultural income shocks on differentiated female marriage markets to explain these phenomena. Negative agricultural income shocks impact female human capital stocks across generations throuh marriage market decisions."
  },
  {
    title: "Modeling Returns to Education: A Panel Data Methods Survey",
    status: "",
    year: "2021",
    description: "Using PSID data, I survey a variety of panel data estimators and compare these estimates using the classic Mincer model."
  }
]

export default function Research() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-light mb-12">Working Papers</h1>
      
      <div className="space-y-12">
        {papers.map((paper, index) => (
          <motion.article 
            key={paper.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-baseline gap-4 mb-2">
              <h2 className="text-xl font-medium group-hover:text-blue-600 transition-colors">
                {paper.title}
              </h2>
              <div className="flex gap-2 text-sm text-stone-500">
                {paper.status && (
                  <span className="bg-stone-100 px-2 py-1 rounded">
                    {paper.status}
                  </span>
                )}
                {paper.year && (
                  <span className="bg-stone-100 px-2 py-1 rounded">
                    {paper.year}
                  </span>
                )}
              </div>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {paper.description}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}