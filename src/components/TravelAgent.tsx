import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, AlertCircle, Loader2, MapPin, Calendar, Users, Wallet, Tags, Plane } from 'lucide-react';
import { geminiService } from '@/utils/geminiService';
import { flightService } from '@/utils/flightService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ChatInterface from './ChatInterface';
import TripSuggestion from './TripSuggestion';
import FlightOptions from './FlightOptions';
import { useToast } from '@/components/ui/use-toast';
import { FlightOption } from '@/types/flight';

interface TravelFormData {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string;
  includeFlights: boolean;
}

const TravelAgent: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFlights, setIsLoadingFlights] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    interests: '',
    includeFlights: false
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, includeFlights: checked }));
  };

  const fetchFlights = async () => {
    if (!formData.source || !formData.destination || !formData.startDate) {
      return;
    }

    setIsLoadingFlights(true);
    try {
      const flightData = await flightService.getFlights(
        formData.source,
        formData.destination,
        formData.startDate
      );
      setFlights(flightData.best_flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast({
        title: "Flight Search Error",
        description: "There was a problem searching for flights. Using mock data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFlights(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['source', 'destination', 'startDate', 'endDate', 'budget'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof TravelFormData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${emptyFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // If user wants flight information, fetch it
    if (formData.includeFlights) {
      await fetchFlights();
    }
    
    // Format the travel request for Gemini
    const travelQuery = `
      Create a detailed travel plan with the following requirements:
      - Starting from: ${formData.source}
      - Destination: ${formData.destination}
      - Travel dates: ${formData.startDate} to ${formData.endDate}
      - Budget: ${formData.budget}
      - Number of travelers: ${formData.travelers}
      - Interests: ${formData.interests || 'General sightseeing'}
      
      Please include:
      1. Transportation options and estimated costs
      2. Recommended accommodations
      3. Must-see attractions and activities
      4. Daily itinerary
      5. Local food recommendations
      6. Estimated total cost breakdown
      7. Travel tips specific to the destination
    `;
    
    try {
      const response = await geminiService.generateTravelPlan(travelQuery);
      
      // Create a mock suggestion to display alongside the AI response
      if (formData.destination) {
        const destinations = ['paris', 'japan', 'tokyo', 'bali', 'hawaii', 'maldives', 'italy', 'greece'];
        const destinationLower = formData.destination.toLowerCase();
        
        const matchedDestination = destinations.find(dest => destinationLower.includes(dest));
        
        if (matchedDestination) {
          const newSuggestion = createSuggestionForDestination(matchedDestination);
          setSuggestions([newSuggestion]);
        } else {
          // Create a generic suggestion
          setSuggestions([{
            destination: formData.destination,
            description: `Explore the wonders of ${formData.destination} based on your travel preferences.`,
            duration: `${getDaysBetween(formData.startDate, formData.endDate)} days`,
            whenToGo: getSeasonFromDates(formData.startDate),
            forWhom: formData.travelers === '1' ? 'Solo traveler' : 'Group of ' + formData.travelers,
            imageUrl: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          }]);
        }
      }
      
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate your travel plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysBetween = (startDate: string, endDate: string): number => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 7; // Default to 7 if calculation fails
    } catch {
      return 7;
    }
  };

  const getSeasonFromDates = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const month = date.getMonth();
      
      if (month >= 2 && month <= 4) return 'Spring';
      if (month >= 5 && month <= 7) return 'Summer';
      if (month >= 8 && month <= 10) return 'Fall';
      return 'Winter';
    } catch {
      return 'Year-round';
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Append the context of the travel details to follow-up questions
      let contextEnhancedMessage = message;
      
      if (formSubmitted) {
        contextEnhancedMessage = `
          Regarding my trip from ${formData.source} to ${formData.destination} 
          (${formData.startDate} to ${formData.endDate}, budget: ${formData.budget}), 
          with ${formData.travelers} traveler(s) interested in ${formData.interests || 'general sightseeing'}:
          
          ${message}
        `;
      }
      
      const response = await geminiService.generateTravelPlan(contextEnhancedMessage);
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
        duration: getDaysBetween(formData.startDate, formData.endDate) + ' days',
        whenToGo: getSeasonFromDates(formData.startDate),
        forWhom: formData.travelers === '1' ? 'Solo traveler' : 'Group of ' + formData.travelers,
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
          {!formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              id="travel-form"
              className="w-full glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-travel-800 mb-6">Plan Your Perfect Trip</h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <MapPin size={16} className="mr-2 text-travel-600" />
                      Starting Location
                    </label>
                    <Input
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="e.g., New York, USA"
                      className="bg-white/70 border-travel-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <MapPin size={16} className="mr-2 text-travel-600" />
                      Destination
                    </label>
                    <Input
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="e.g., Paris, France"
                      className="bg-white/70 border-travel-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <Calendar size={16} className="mr-2 text-travel-600" />
                      Start Date
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="bg-white/70 border-travel-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <Calendar size={16} className="mr-2 text-travel-600" />
                      End Date
                    </label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="bg-white/70 border-travel-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <Wallet size={16} className="mr-2 text-travel-600" />
                      Budget
                    </label>
                    <Input
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="e.g., $3000 USD"
                      className="bg-white/70 border-travel-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <Users size={16} className="mr-2 text-travel-600" />
                      Number of Travelers
                    </label>
                    <Select
                      value={formData.travelers}
                      onValueChange={(value) => handleSelectChange('travelers', value)}
                    >
                      <SelectTrigger className="bg-white/70 border-travel-300">
                        <SelectValue placeholder="Select number of travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'traveler' : 'travelers'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-travel-700 flex items-center">
                      <Tags size={16} className="mr-2 text-travel-600" />
                      Interests
                    </label>
                    <Textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      placeholder="e.g., historical sites, local cuisine, outdoor activities, museums, photography"
                      className="bg-white/70 border-travel-300 resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeFlights" 
                        checked={formData.includeFlights}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor="includeFlights"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <Plane size={16} className="mr-2 text-travel-600" />
                        Include flight options
                      </label>
                    </div>
                    <p className="text-xs text-travel-500 pl-6">
                      Search for available flights using SerpAPI (currently showing mock data)
                    </p>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-travel-600 hover:bg-travel-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Generating Your Travel Plan...
                    </>
                  ) : (
                    'Create My Travel Plan'
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <>
              <ChatInterface onSendMessage={handleSendMessage} isLoading={isLoading} />
              
              {formData.includeFlights && (
                <FlightOptions flights={flights} loading={isLoadingFlights} />
              )}
            </>
          )}
          
          {suggestions.length > 0 && formSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-travel-800">Your Trip Summary</h2>
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
