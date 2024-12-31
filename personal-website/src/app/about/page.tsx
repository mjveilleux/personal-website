'use client';
import { motion } from 'framer-motion';
import React from 'react';
import {BridgeModel} from './models/BridgeModel';
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
    title: "There are dozens of other Full-Stack Economists, dozens!",
    content: (
      <>
        <p className="mb-4">
          A "Full-Stack Economist" is someone who has the toolset to
          build front-end applications, plumb analytics pipelines, and generate insights using a rigorous application of economic 
          theory, statistics, and software architecture.
        </p>
        <p className="mb-4">
          My full-stack economics toolkit includes a deep understanding of experimental design and data-intensive application architecture that helps
          combine rigourous analytics to build quality products and software that scales. 
        </p>
        <p className="mb-4">
        I am proficient in developing React Apps using Typescript, Python, SQL (Redshift, SQL Server, Postgres), R, and Stan. 
        I take pride in having the ability to contribute to all aspects of a data project.
        </p>
        
      </>
    ),
   component: <LaptopModel />
  },
  {
    title: "From the Ivory Tower to the Wild",
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
    title: "What Have I Been up to Recently?",
    content: (
      <div className="space-y-4">
        <p className="text-lg">What I'm doing outside my 9-5:</p>
        <ul className="space-y-2">
          <li>• Mostly re-writing my website in NextJS from the boring Google version</li>
          <li>• Full time daddy duty</li>
          <li>• Ideas of a plan for a series of blogs to be published throughout 2025</li>
        </ul>
      </div>
    ),
    component: <ProjectModel />
  },
  {
    title: "'Metrics on my Mind",
    content: (
      <p>
        I love economics and statistics. I think econometrics provides useful tools to think about research design and quantifiying treatment effects.
        I'm usually reading articles on these topics to keep up with the latest trends in the hopes to apply them to my day-to-day.
      </p>
    ),
    component: <BookModel />
  },
  {
    title: "Life in California",
    content: (
      <p>
        I'm currently based in the Bay Area with my family, I continue to 
        explore the intersection of economics and technology. When not coding or 
        analyzing data, you might find me cooking, walking, or enjoying both with the company of 
        my friends and family.
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
          transition={{ duration: 0 }}
          className="space-y-24 py-12"
        >
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 1, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0, ease: "easeOut" }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-12 items-center`}
            >
              <motion.div 
                className="flex-1 space-y-4"
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0, delay: 0 }}
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
                initial={{ opacity: 1, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: 0.3 }}
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