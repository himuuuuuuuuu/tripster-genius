
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, isLoading }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load messages from localStorage on component mount
    const savedMessages = localStorage.getItem('travelAIMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage when they change
    if (messages.length > 0) {
      localStorage.setItem('travelAIMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingMessages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const loadingMessage: Message = {
      id: 'loading',
      role: 'assistant',
      content: 'Thinking...'
    };
    
    setLoadingMessages([loadingMessage]);
    
    try {
      const response = await onSendMessage(input.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingMessages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('travelAIMessages');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden glass-card transition-all duration-300 ease-in-out">
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 bg-travel-100 border-b border-travel-200">
        <div className="flex items-center">
          <Sparkles size={16} className="text-travel-600 mr-2" />
          <span className="text-sm font-medium text-travel-700">Travel Assistant</span>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-travel-600 hover:text-travel-800 hover:bg-travel-200"
          >
            Clear Chat
          </Button>
        )}
      </div>
      
      <div className="h-[400px] pt-12 pb-20 px-4 overflow-y-auto bg-white/60">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-10"
            >
              <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-travel-100">
                <Sparkles size={24} className="text-travel-600" />
              </div>
              <h3 className="text-lg font-medium text-travel-800 mb-2">How can I help with your travel plans?</h3>
              <p className="text-travel-600 max-w-sm">
                Try asking me about destinations, suggested itineraries, travel tips, or describe your ideal vacation.
              </p>
            </motion.div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex my-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-2 ${
                      message.role === 'user' ? 'bg-travel-600 ml-2' : 'bg-travel-200'
                    }`}>
                      {message.role === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Sparkles size={16} className="text-travel-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${
                      message.role === 'user' 
                        ? 'bg-travel-600 text-white rounded-tr-none' 
                        : 'bg-travel-100 text-travel-800 rounded-tl-none'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loadingMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex my-4 justify-start"
                >
                  <div className="flex max-w-[80%]">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-2 bg-travel-200">
                      <Loader2 size={16} className="text-travel-600 animate-spin" />
                    </div>
                    <div className="p-3 rounded-xl bg-travel-100 text-travel-800 rounded-tl-none">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-travel-400 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-travel-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-travel-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/60 border-t border-travel-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about destinations, itineraries, or travel tips..."
            className="resize-none pr-14 bg-white/80 border-travel-300 focus:border-travel-400 focus:ring-travel-400"
            rows={2}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            size="icon"
            className={`absolute right-2 bottom-2 rounded-full ${
              isLoading || !input.trim() 
                ? 'bg-travel-300 text-travel-100 cursor-not-allowed' 
                : 'bg-travel-600 text-white hover:bg-travel-700'
            }`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
