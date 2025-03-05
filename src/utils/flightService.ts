
import { FlightApiResponse } from '../types/flight';

const mockFlightResponse: FlightApiResponse = {
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-03-06 22:05"
          },
          arrival_airport: {
            name: "Kuala Lumpur International Airport",
            id: "KUL",
            time: "2025-03-07 06:00"
          },
          duration: 325,
          airplane: "Boeing 737",
          airline: "Batik Air",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/OD.png",
          travel_class: "Economy",
          flight_number: "OD 206",
          legroom: "32 in",
          extensions: [
            "Above average legroom (32 in)",
            "In-seat USB outlet",
            "On-demand video",
            "Carbon emissions estimate: 328 kg"
          ],
          overnight: true
        },
        {
          departure_airport: {
            name: "Kuala Lumpur International Airport",
            id: "KUL",
            time: "2025-03-07 11:10"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-03-07 13:30"
          },
          duration: 200,
          airplane: "Boeing 737",
          airline: "Batik Air",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/OD.png",
          travel_class: "Economy",
          flight_number: "OD 571",
          legroom: "32 in",
          extensions: [
            "Above average legroom (32 in)",
            "In-seat USB outlet",
            "On-demand video",
            "Carbon emissions estimate: 195 kg"
          ],
          often_delayed_by_over_30_min: true
        }
      ],
      layovers: [
        {
          duration: 310,
          name: "Kuala Lumpur International Airport",
          id: "KUL"
        }
      ],
      total_duration: 835,
      carbon_emissions: {
        this_flight: 523000,
        typical_for_this_route: 224000,
        difference_percent: 133
      },
      price: 324,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/OD.png",
      booking_token: "WyJDalJJZUZaaFJscHRUWHBwZURCQlFuSXhMV2RDUnkwdExTMHRMUzB0TFhaMGVta3pPVUZCUVVGQlIyWkpUVVZqUzNVMlExVkJFZ3RQUkRJd05ueFBSRFUzTVJvTENMcjhBUkFDR2dOVlUwUTRISEM2L0FFPSIsW1siREVMIiwiMjAyNS0wMy0wNiIsIktVTCIsbnVsbCwiT0QiLCIyMDYiXSxbIktVTCIsIjIwMjUtMDMtMDciLCJIQU4iLG51bGwsIk9EIiwiNTcxIl1dXQ=="
    },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-03-06 15:00"
          },
          arrival_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-03-06 17:10"
          },
          duration: 130,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 543",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 92 kg"
          ]
        },
        {
          departure_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-03-06 22:05"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-03-07 02:10"
          },
          duration: 155,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 1631",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 117 kg"
          ],
          overnight: true
        }
      ],
      layovers: [
        {
          duration: 295,
          name: "Netaji Subhash Chandra Bose International Airport",
          id: "CCU"
        }
      ],
      total_duration: 580,
      carbon_emissions: {
        this_flight: 211000,
        typical_for_this_route: 224000,
        difference_percent: -6
      },
      price: 394,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
      booking_token: "WyJDalJJZUZaaFJscHRUWHBwZURCQlFuSXhMV2RDUnkwdExTMHRMUzB0TFhaMGVta3pPVUZCUVVGQlIyWkpUVVZqUzNVMlExVkJFZzQyUlRVME0zdzJSVEUyTXpFYUN3aTNzd0lRQWhvRFZWTkVPQnh3dDdNQyIsW1siREVMIiwiMjAyNS0wMy0wNiIsIkNDVSIsbnVsbCwiNkUiLCI1NDMiXSxbIkNDVSIsIjIwMjUtMDMtMDYiLCJIQU4iLG51bGwsIjZFIiwiMTYzMSJdXV0="
    },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-03-06 18:00"
          },
          arrival_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-03-06 20:10"
          },
          duration: 130,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 2057",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 92 kg"
          ]
        },
        {
          departure_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-03-06 22:05"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-03-07 02:10"
          },
          duration: 155,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 1631",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 117 kg"
          ],
          overnight: true
        }
      ],
      layovers: [
        {
          duration: 115,
          name: "Netaji Subhash Chandra Bose International Airport",
          id: "CCU"
        }
      ],
      total_duration: 400,
      carbon_emissions: {
        this_flight: 211000,
        typical_for_this_route: 224000,
        difference_percent: -6
      },
      price: 401,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
      booking_token: "WyJDalJJZUZaaFJscHRUWHBwZURCQlFuSXhMV2RDUnkwdExTMHRMUzB0TFhaMGVta3pPVUZCUVVGQlIyWkpUVVZqUzNVMlExVkJFZzAyUlRJd05UZDhOa1V4TmpNeEdnc0lpN2tDRUFJYUExVlRSRGdjY0l1NUFnPT0iLFtbIkRFTCIsIjIwMjUtMDMtMDYiLCJDQ1UiLG51bGwsIjZFIiwiMjA1NyJdLFsiQ0NVIiwiMjAyNS0wMy0wNiIsIkhBTiIsbnVsbCwiNkUiLCIxNjMxIl1dXQ=="
    }
  ]
};

export class FlightService {
  async getFlights(source: string, destination: string, date: string): Promise<FlightApiResponse> {
    // This is a mock implementation. In a real app, we would call the actual SerpAPI
    console.log(`Mock flight search: ${source} to ${destination} on ${date}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockFlightResponse;
  }
}

export const flightService = new FlightService();
