
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, AlertCircle, Loader2 } from 'lucide-react';
import { geminiService } from '@/utils/geminiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatInterface from './ChatInterface';
import TripSuggestion from './TripSuggestion';
import { useToast } from '@/components/ui/use-toast';

const TravelAgent: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check for API key in localStorage
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      geminiService.configure({ apiKey: savedApiKey });
      setShowApiKeyInput(false);
    }
  }, []);

  const handleConfigureApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key or continue without one for demo responses.",
        variant: "destructive",
      });
      return;
    }

    setIsConfiguring(true);
    
    try {
      // Configure the service with the new API key
      geminiService.configure({ apiKey });
      
      // Save to localStorage for persistence
      localStorage.setItem('geminiApiKey', apiKey);
      
      toast({
        title: "API Key Configured",
        description: "Your Gemini API key has been saved successfully.",
      });
      
      setShowApiKeyInput(false);
    } catch (error) {
      console.error('Error configuring API key:', error);
      toast({
        title: "Configuration Error",
        description: "There was a problem setting up your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleContinueWithoutApiKey = () => {
    toast({
      title: "Demo Mode Activated",
      description: "Using sample responses. For full functionality, add your Gemini API key later.",
    });
    setShowApiKeyInput(false);
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const response = await geminiService.generateTravelPlan(message);
      
      // Check if the message is asking about a specific destination
      const destinations = ['paris', 'japan', 'tokyo', 'bali', 'hawaii', 'maldives', 'italy', 'greece'];
      const messageLower = message.toLowerCase();
      
      const matchedDestination = destinations.find(dest => messageLower.includes(dest));
      
      if (matchedDestination) {
        // Create a suggestion based on the matched destination
        const newSuggestion = createSuggestionForDestination(matchedDestination);
        setSuggestions([newSuggestion]);
      }
      
      return response;
    } catch (error) {
      console.error('Error generating travel plan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSuggestionForDestination = (destination: string) => {
    const suggestions: Record<string, any> = {
      paris: {
        destination: 'Paris, France',
        description: 'Experience the romance and charm of the City of Light with its iconic landmarks, world-class museums, and exquisite cuisine.',
        duration: '5-7 days',
        whenToGo: 'April-June, Sept-Oct',
        forWhom: 'Couples, Art Lovers',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      japan: {
        destination: 'Japan',
        description: 'Discover the perfect blend of ancient traditions and ultramodern life in Japan, from serene temples to bustling metropolises.',
        duration: '10-14 days',
        whenToGo: 'March-May, Oct-Nov',
        forWhom: 'Culture Seekers, Foodies',
        imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      tokyo: {
        destination: 'Tokyo, Japan',
        description: 'Immerse yourself in the energetic pace of Tokyo, where cutting-edge technology meets ancient traditions in this sprawling metropolis.',
        duration: '4-6 days',
        whenToGo: 'March-May, Sept-Nov',
        forWhom: 'Urban Explorers, Tech Enthusiasts',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      bali: {
        destination: 'Bali, Indonesia',
        description: 'Find your balance on the Island of the Gods, with its stunning beaches, spiritual temples, and lush rice terraces.',
        duration: '7-10 days',
        whenToGo: 'April-June, Sept-Oct',
        forWhom: 'Beach Lovers, Spiritual Seekers',
        imageUrl: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      hawaii: {
        destination: 'Hawaii, USA',
        description: 'Experience paradise on Earth with Hawaii\'s spectacular beaches, volcanic landscapes, and rich Polynesian culture.',
        duration: '7-12 days',
        whenToGo: 'April-June, Sept-Oct',
        forWhom: 'Adventure Seekers, Beach Lovers',
        imageUrl: 'https://images.unsplash.com/photo-1483168527879-c66136b56105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      maldives: {
        destination: 'Maldives',
        description: 'Escape to the ultimate luxury getaway with overwater bungalows, pristine beaches, and unparalleled marine life.',
        duration: '5-7 days',
        whenToGo: 'November-April',
        forWhom: 'Luxury Travelers, Honeymooners',
        imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      italy: {
        destination: 'Italy',
        description: 'Indulge in la dolce vita with Italy\'s artistic treasures, ancient ruins, remarkable cities, and delicious cuisine.',
        duration: '10-14 days',
        whenToGo: 'April-June, Sept-Oct',
        forWhom: 'History Buffs, Food Enthusiasts',
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      greece: {
        destination: 'Greece',
        description: 'Step into ancient history while enjoying the spectacular Mediterranean landscapes, iconic islands, and vibrant culture.',
        duration: '7-10 days',
        whenToGo: 'May-June, Sept-Oct',
        forWhom: 'History Lovers, Island Hoppers',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      }
    };
    
    return suggestions[destination] || suggestions.paris;
  };

  const handleShowApiKeyInput = () => {
    setShowApiKeyInput(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      {showApiKeyInput ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto glass-card p-6 rounded-xl"
        >
          <div className="flex items-center mb-4 text-travel-700">
            <Key size={20} className="mr-2" />
            <h3 className="text-lg font-medium">Gemini API Configuration</h3>
          </div>
          
          <p className="text-sm text-travel-600 mb-4">
            Enter your Gemini API key to enable full functionality. Without an API key, the application will use mock responses for demonstration purposes.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="bg-white/70 border-travel-300"
              />
              <p className="text-xs text-travel-500">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleConfigureApiKey}
                disabled={isConfiguring}
                className="bg-travel-600 hover:bg-travel-700 text-white flex-1"
              >
                {isConfiguring ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Configuring...
                  </>
                ) : (
                  'Save API Key'
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleContinueWithoutApiKey}
                className="border-travel-300 text-travel-700 hover:bg-travel-100 flex-1"
              >
                Continue Without API Key
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-10">
          <ChatInterface onSendMessage={handleSendMessage} isLoading={isLoading} />
          
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-travel-800">Suggested Destinations</h2>
              <div className="grid grid-cols-1 gap-6">
                {suggestions.map((suggestion, index) => (
                  <TripSuggestion key={index} {...suggestion} />
                ))}
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleShowApiKeyInput}
              className="text-travel-600 hover:text-travel-800 hover:bg-travel-100"
            >
              <Key size={16} className="mr-2" />
              Configure API Key
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelAgent;
