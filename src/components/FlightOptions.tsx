
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, CalendarClock, Map, DollarSign, ArrowRight, Leaf, AlertTriangle } from 'lucide-react';
import { FlightOption } from '@/types/flight';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

interface FlightOptionsProps {
  flights: FlightOption[];
  loading: boolean;
}

const FlightOptions: React.FC<FlightOptionsProps> = ({ flights, loading }) => {
  const { toast } = useToast();
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('table');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-travel-600"></div>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="p-6 text-center text-travel-600">
        No flight options available.
      </div>
    );
  }

  const handleBookFlight = (bookingToken: string) => {
    // In a real app, this would redirect to the booking page
    toast({
      title: "Booking Initiated",
      description: "In a real application, you would be redirected to complete your booking.",
    });
    console.log("Booking token:", bookingToken);
  };

  const formatDuration = (minutes: number) => {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-travel-700 flex items-center">
          <Plane className="mr-2" size={20} />
          Flight Options
        </h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={displayMode === 'cards' ? 'default' : 'outline'}
            onClick={() => setDisplayMode('cards')}
            className="text-xs"
          >
            Card View
          </Button>
          <Button 
            size="sm" 
            variant={displayMode === 'table' ? 'default' : 'outline'}
            onClick={() => setDisplayMode('table')}
            className="text-xs"
          >
            Table View
          </Button>
        </div>
      </div>

      {displayMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-travel-100 text-travel-800">
                <th className="p-3 text-left">Airline</th>
                <th className="p-3 text-left">Route</th>
                <th className="p-3 text-left">Departure</th>
                <th className="p-3 text-left">Arrival</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Emissions</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => {
                const departureAirport = flight.flights[0].departure_airport;
                const arrivalAirport = flight.flights[flight.flights.length - 1].arrival_airport;
                const hasLayovers = flight.layovers.length > 0;
                const hasWarnings = flight.flights.some(f => f.overnight || f.often_delayed_by_over_30_min);
                const isHighEmission = flight.carbon_emissions.difference_percent > 0;

                return (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-travel-100 hover:bg-travel-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <img 
                          src={flight.airline_logo} 
                          alt="Airline" 
                          className="h-6 mr-2"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/70x35?text=Airline";
                          }}
                        />
                        <span>{flight.flights[0].airline}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span>{departureAirport.id}</span>
                        <ArrowRight size={14} />
                        {hasLayovers && flight.layovers.map((layover, i) => (
                          <React.Fragment key={i}>
                            <span className="text-travel-500">{layover.id}</span>
                            <ArrowRight size={14} />
                          </React.Fragment>
                        ))}
                        <span>{arrivalAirport.id}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {formatDateTime(departureAirport.time)}
                    </td>
                    <td className="p-3">
                      {formatDateTime(arrivalAirport.time)}
                    </td>
                    <td className="p-3">
                      {formatDuration(flight.total_duration)}
                    </td>
                    <td className="p-3 text-travel-800 font-semibold">
                      ${flight.price}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Leaf 
                                size={16} 
                                className={isHighEmission ? "text-red-500 mr-1" : "text-green-500 mr-1"} 
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Carbon emissions: {flight.carbon_emissions.this_flight / 1000} kg</p>
                              <p>{isHighEmission 
                                  ? `${flight.carbon_emissions.difference_percent}% higher than average` 
                                  : `${Math.abs(flight.carbon_emissions.difference_percent)}% lower than average`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {hasWarnings && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertTriangle size={16} className="text-amber-500 ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {flight.flights.some(f => f.overnight) && "Overnight flight. "}
                                  {flight.flights.some(f => f.often_delayed_by_over_30_min) && "Often delayed."}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Button 
                        size="sm"
                        className="bg-travel-600 hover:bg-travel-700 text-white"
                        onClick={() => handleBookFlight(flight.booking_token)}
                      >
                        Book
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 rounded-lg"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <img 
                    src={flight.airline_logo} 
                    alt="Airline" 
                    className="h-6 mr-2"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/70x35?text=Airline";
                    }}
                  />
                  <span className="font-medium text-travel-800">
                    {flight.flights[0].airline} - {flight.flights.map(f => f.flight_number).join(', ')}
                  </span>
                </div>
                <div className="flex items-center text-travel-600 text-lg font-semibold">
                  <DollarSign size={16} className="mr-1" />
                  {flight.price}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Clock size={16} className="mr-2 mt-0.5 text-travel-500" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div>{Math.floor(flight.total_duration / 60)}h {flight.total_duration % 60}m</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Map size={16} className="mr-2 mt-0.5 text-travel-500" />
                    <div>
                      <div className="font-medium">Route</div>
                      <div>{flight.flights.map(f => f.departure_airport.id).join(' → ')} → {flight.flights[flight.flights.length - 1].arrival_airport.id}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <CalendarClock size={16} className="mr-2 mt-0.5 text-travel-500" />
                    <div>
                      <div className="font-medium">Departure</div>
                      <div>
                        {new Date(flight.flights[0].departure_airport.time).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarClock size={16} className="mr-2 mt-0.5 text-travel-500" />
                    <div>
                      <div className="font-medium">Arrival</div>
                      <div>
                        {new Date(flight.flights[flight.flights.length - 1].arrival_airport.time).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {flight.layovers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-travel-100">
                  <p className="text-travel-600 text-sm">
                    <span className="font-medium">Layovers:</span> {flight.layovers.map((layover, i) => (
                      <span key={i}>
                        {layover.name} ({Math.floor(layover.duration / 60)}h {layover.duration % 60}m)
                        {i < flight.layovers.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              )}
              
              <div className="mt-4 pt-2 flex justify-end">
                <Button 
                  className="bg-travel-600 hover:bg-travel-700 text-white"
                  onClick={() => handleBookFlight(flight.booking_token)}
                >
                  Book Flight
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightOptions;
