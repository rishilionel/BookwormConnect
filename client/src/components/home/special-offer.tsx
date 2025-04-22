import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function SpecialOffer() {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 51
  });

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                // Timer complete, reset to some future date
                days = 2;
                hours = 14;
                minutes = 36;
                seconds = 51;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-accent to-accent-dark rounded-xl overflow-hidden shadow-xl">
          <div className="md:flex items-center">
            <div className="md:w-1/2 p-8 md:p-12">
              <span className="inline-block bg-white text-accent font-heading font-semibold px-4 py-1 rounded-full text-sm mb-4">Limited Time Offer</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">Festive Season Sale!</h2>
              <p className="text-white/90 mb-6">Get up to 30% off on all decorative items and gift hampers. Use code DIWALI30 at checkout.</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{countdown.days}</div>
                  <div className="text-xs text-white/90">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{countdown.hours}</div>
                  <div className="text-xs text-white/90">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{countdown.minutes}</div>
                  <div className="text-xs text-white/90">Minutes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{countdown.seconds}</div>
                  <div className="text-xs text-white/90">Seconds</div>
                </div>
              </div>
              <Link href="/products?sale=true">
                <Button variant="secondary" className="inline-block bg-secondary hover:bg-secondary-dark text-accent font-medium py-3 px-6 rounded-full transition duration-300 shadow-lg">
                  Shop the Sale
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1590598016250-a144aa3b24a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Diwali special offers and discounts" 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
