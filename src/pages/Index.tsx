
import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import TravelAgent from '@/components/TravelAgent';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatedBackground />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto py-8"
      >
        <Hero />
        <TravelAgent />
      </motion.main>
    </div>
  );
};

export default Index;
