
import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, CalendarClock, Map, DollarSign } from 'lucide-react';
import { FlightOption } from '@/types/flight';

interface FlightOptionsProps {
  flights: FlightOption[];
  loading: boolean;
}

const FlightOptions: React.FC<FlightOptionsProps> = ({ flights, loading }) => {
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

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-semibold text-travel-700 flex items-center">
        <Plane className="mr-2" size={20} />
        Flight Options
      </h3>
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
              <button className="bg-travel-600 hover:bg-travel-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Select Flight
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlightOptions;
