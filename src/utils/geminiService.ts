
// This is a simplified implementation for Gemini API integration
// In a production environment, API calls should be made through a backend service

interface GeminiServiceConfig {
  apiKey: string;
}

class GeminiService {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  configure(config: GeminiServiceConfig) {
    this.apiKey = config.apiKey;
  }

  async generateTravelPlan(prompt: string): Promise<string> {
    if (!this.apiKey) {
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert travel agent AI. Provide helpful, detailed, and personalized travel advice based on user queries. Be conversational and friendly.
                  
                  User query: ${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected response format:', data);
        return 'I apologize, but I encountered an issue processing your request. Please try again or refine your query.';
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getMockResponse(prompt);
    }
  }

  // This method provides mock responses when no API key is configured
  private getMockResponse(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('paris')) {
      return `Paris is a magnificent choice! Here's what you should know:

The best time to visit Paris is during spring (April to June) or fall (September to October) when the weather is pleasant and there are fewer tourists.

Must-see attractions:
- Eiffel Tower (pro tip: book tickets online to avoid long lines)
- Louvre Museum (don't miss the Mona Lisa)
- Notre-Dame Cathedral (currently under restoration but still impressive from outside)
- Montmartre and Sacré-Cœur Basilica
- Seine River cruise

I recommend staying in Le Marais or Saint-Germain-des-Prés neighborhoods for a quintessential Parisian experience. For a 5-day itinerary, consider day trips to Versailles Palace or the charming village of Giverny where Monet's garden is located.

Would you like more specific recommendations about cuisine, shopping, or other aspects of Paris?`;
    } else if (promptLower.includes('japan') || promptLower.includes('tokyo')) {
      return `Japan is an incredible destination that beautifully blends ancient traditions with cutting-edge technology!

The best times to visit are spring (March-May) for cherry blossoms or fall (September-November) for colorful autumn leaves.

For a 10-day Japan itinerary, I recommend:
- Tokyo (3 days): Explore Shibuya, Shinjuku, traditional Asakusa, and teamLab Borderless digital art museum
- Kyoto (3 days): Visit temples like Kinkaku-ji (Golden Pavilion), Fushimi Inari Shrine, and experience a traditional tea ceremony
- Osaka (2 days): Enjoy the food scene, Osaka Castle, and Universal Studios Japan
- Hiroshima & Miyajima (2 days): See the Peace Memorial Park and the floating torii gate

Japan has excellent public transportation, so I highly recommend getting a Japan Rail Pass if you'll be moving between cities.

Would you like more specific information about any of these places or aspects of Japanese culture?`;
    } else if (promptLower.includes('beach') || promptLower.includes('island') || promptLower.includes('tropical')) {
      return `For a tropical beach getaway, here are some top options:

1. Maldives: Perfect for luxury overwater bungalows and unparalleled snorkeling in crystal clear waters. Best from November to April.

2. Bali, Indonesia: Offers a great mix of beautiful beaches, cultural experiences, and affordable luxury. Visit during May to September for the best weather.

3. Phuket, Thailand: Great for beaches, nightlife, and Thai cuisine. The high season is November to February.

4. Hawaii: Offers diverse landscapes from volcanic terrain to lush rainforests and beautiful beaches. Good year-round but expensive during summer and holidays.

5. Costa Rica: Perfect if you want beaches plus adventure activities like zip-lining and hiking. The dry season is December to April.

All these destinations offer different experiences at various price points. What's your budget and what kind of activities are you interested in besides beach relaxation?`;
    } else {
      return `Thank you for your travel inquiry! I'd be happy to help you plan the perfect trip.

Without a Gemini API key configured, I'm providing a sample response, but I can offer much more personalized advice once connected to the Gemini API.

Based on current travel trends, some popular destinations include:

1. Portugal's Algarve Coast - Stunning beaches, delicious cuisine, and charming towns
2. Slovenia - A hidden gem with beautiful lakes, mountains, and a fraction of the crowds of nearby countries
3. Mexico City - Vibrant cultural scene, world-class museums, and incredible food
4. Japan - Perfect blend of tradition and modernity with excellent transportation

For the best experience, consider:
- Traveling during shoulder seasons (May-June or September-October) for better prices and fewer crowds
- Mixing popular attractions with local neighborhoods
- Allowing for downtime in your itinerary to truly experience each place

What destinations are you most interested in? Or what type of experience are you looking for (adventure, relaxation, cultural immersion)?`;
    }
  }

  isConfigured(): boolean {
    return this.apiKey !== null;
  }
}

export const geminiService = new GeminiService();
