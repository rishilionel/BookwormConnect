import { RiStarFill, RiStarHalfFill } from 'react-icons/ri';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi",
    avatar: "https://i.pravatar.cc/100?img=1",
    text: "The diyas I ordered were even more beautiful than the pictures. They light up my home perfectly for Diwali celebrations. Will definitely order again next year!",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Verma",
    location: "Mumbai",
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "Fast delivery and great packaging. The LED string lights are perfect for my balcony decoration. They create such a festive ambiance. Very satisfied with my purchase.",
    rating: 4.5
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Bangalore",
    avatar: "https://i.pravatar.cc/100?img=33",
    text: "The gift hamper was perfect for my family. Everyone loved the assortment of items. The packaging was premium and festive. Will definitely recommend to friends!",
    rating: 5
  }
];

export function Testimonials() {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex text-secondary mb-4">
        {[...Array(fullStars)].map((_, i) => (
          <RiStarFill key={`full-${i}`} />
        ))}
        {hasHalfStar && <RiStarHalfFill key="half" />}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl text-neutral-dark mb-2">Customer Love</h2>
          <p className="text-neutral-gray">What our customers say about our Diwali collection</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-background rounded-lg p-6 shadow-md">
              {renderStars(testimonial.rating)}
              <p className="text-neutral-dark mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-neutral-dark">{testimonial.name}</h4>
                  <p className="text-neutral-gray text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
