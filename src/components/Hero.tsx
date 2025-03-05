
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Key } from 'lucide-react';
import { geminiService } from '@/utils/geminiService';

const Hero: React.FC = () => {
  const apiConfigured = geminiService.isConfigured();
  
  return (
    <div className="relative w-full py-16 md:py-24 flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl px-6 sm:px-0"
      >
        <h2 className="inline-block font-medium text-sm md:text-base tracking-wider text-travel-600 mb-3">
          Powered by Gemini 1.5 Flash
        </h2>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gradient">
          Your Personal Travel Planner
        </h1>
        <p className="text-lg md:text-xl text-travel-700 mb-8 font-light max-w-2xl mx-auto">
          Experience effortless trip planning with our AI-powered travel assistant. Simply fill in your travel details below, and we'll handle the rest.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            className="bg-travel-600 hover:bg-travel-700 text-white" 
            size="lg"
            onClick={() => document.getElementById('travel-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Plan My Trip <ArrowRight className="ml-2" size={16} />
          </Button>
          
          {!apiConfigured && (
            <Button 
              variant="outline"
              size="lg"
              className="border-travel-600 text-travel-600 hover:bg-travel-50"
              onClick={() => document.getElementById('api-key-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Key className="mr-2" size={16} />
              Configure API Key
            </Button>
          )}
        </motion.div>
        
        <div className="w-24 h-1 bg-gradient-to-r from-travel-400 to-travel-600 mx-auto rounded-full mt-8" />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero;
