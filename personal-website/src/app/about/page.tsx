'use client';
import { motion } from 'framer-motion';
import React from 'react';
import BridgeModel from './models/BridgeModel';
import { LaptopModel } from './models/LaptopModel';
import { BookModel } from './models/BookModel';
import { UniversityModel } from './models/UniversityModel';
 import { ProjectModel } from './models/ProjectModel';

interface Section {
  title: string;
  content: React.ReactNode;
  component: React.ReactNode;
}

const sections: Section[] = [
  {
    title: "The Data Journey",
    content: (
      <>
        <p className="mb-4">
          I'm Mason Veilleux, a Data Analyst at Game Data Pros where I design experiments 
          and engineer data pipelines. I consider myself a "full-stack economist" - someone who 
          can build front-end applications, analytics pipelines, and analyze data using economic 
          theory and empirics.
        </p>
        <p>
          My toolkit includes R, Python, and a deep understanding of experimental design that helps
          me bridge the gap between economic theory and practical applications.
        </p>
      </>
    ),
   component: <LaptopModel />
  },
  {
    title: "Academic Foundations",
    content: (
      <p>
        At the University of Kent, I earned my MSc in Econometrics, diving deep into firm dynamics 
        as a Research Assistant. My dissertation on local exposure to heterogeneous technologies 
        and long-run growth in the US won best in class, marking my commitment to understanding 
        how technology shapes economic growth.
      </p>
    ),
    component: <UniversityModel />
  },
  {
    title: "Recent Projects",
    content: (
      <div className="space-y-4">
        <p className="text-lg">Some highlights from my recent work:</p>
        <ul className="space-y-2">
          <li>• Developed a multi-collinearity analysis tool for econometric research</li>
          <li>• Created a hospital readmissions prediction model (1st place in DataCamp competition)</li>
          <li>• Built a RShiny dashboard for P2P-based businesses</li>
        </ul>
      </div>
    ),
    component: <ProjectModel />
  },
  {
    title: "Teaching & Writing",
    content: (
      <p>
        I'm passionate about making economics accessible. My guide "Getting Started With Economics" 
        helps undergraduates navigate the field. Through my blog, I break down complex econometric 
        concepts and share insights from my research and practical applications.
      </p>
    ),
    component: <BookModel />
  },
  {
    title: "Life in the Bay",
    content: (
      <p>
        Currently based in the San Francisco Bay Area with my wife and baby boy, I continue to 
        explore the intersection of economics, data science, and technology. When not coding or 
        analyzing data, you might find me writing about economics or working on my next project.
      </p>
    ),
    component: <BridgeModel />
  }
];

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-24 py-12"
        >
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-12 items-center`}
            >
              <motion.div 
                className="flex-1 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-light text-gray-900 mb-6">
                  {section.title}
                </h2>
                <div className="text-stone-700 leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
              <motion.div 
                className="relative w-80 h-80 flex-shrink-0"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {section.component}
              </motion.div>
            </motion.section>
          ))}
        </motion.div>
      </div>
    </main>
  );
}