import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { whatsappConfig } from '../mock';

export const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    // Placeholder for WhatsApp integration
    const message = encodeURIComponent(whatsappConfig.message);
    const whatsappUrl = `https://wa.me/${whatsappConfig.number}?text=${message}`;
    
    // For now, show alert since number is placeholder
    if (whatsappConfig.number === "WHATSAPP_NUMBER_PLACEHOLDER") {
      alert("WhatsApp integration ready! Please add your business WhatsApp number in the configuration.");
      return;
    }
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Chat bubble (shows when hovered) */}
          <div className={`absolute bottom-16 right-0 transform transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Chat with us!</h4>
                  <p className="text-xs text-gray-600">We're online</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Hi! Need help with logistics services? Chat with us on WhatsApp.
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Start Chat
              </button>
              {/* Arrow */}
              <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white transform rotate-45 shadow-lg"></div>
            </div>
          </div>

          {/* Main WhatsApp Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
          </button>

          {/* Pulse animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};