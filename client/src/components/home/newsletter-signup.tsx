import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 px-4 bg-primary">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="font-heading font-bold text-3xl mb-3">Get Festival Updates</h2>
          <p className="mb-6">Subscribe to our newsletter for exclusive deals, new arrivals, and Diwali celebration tips</p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow py-3 px-4 rounded-lg focus:outline-none text-neutral-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-white/70 text-sm mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from us.</p>
        </div>
      </div>
    </section>
  );
}
