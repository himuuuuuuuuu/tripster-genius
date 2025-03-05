
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPin, Clock, User, Plane } from 'lucide-react';

interface TripSuggestionProps {
  destination: string;
  description: string;
  duration: string;
  whenToGo: string;
  forWhom: string;
  imageUrl?: string;
}

const TripSuggestion: React.FC<TripSuggestionProps> = ({
  destination,
  description,
  duration,
  whenToGo,
  forWhom,
  imageUrl = 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-xl overflow-hidden glass-card shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={destination} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-travel-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-xl font-bold mb-1">{destination}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>Popular Destination</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-travel-700 mb-4 line-clamp-3">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center text-travel-600">
            <Clock size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{duration}</span>
          </div>
          <div className="flex items-center text-travel-600">
            <CalendarIcon size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{whenToGo}</span>
          </div>
          <div className="flex items-center text-travel-600">
            <User size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{forWhom}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-travel-200">
          <button className="w-full flex items-center justify-center space-x-2 py-2 bg-travel-100 hover:bg-travel-200 text-travel-700 rounded-lg transition-colors duration-200">
            <Plane size={16} />
            <span>View Full Itinerary</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripSuggestion;
