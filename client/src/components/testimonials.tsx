export default function Testimonials() {
  const testimonials = [
    {
      facilityName: "Sunset Senior Living",
      quote: "Golden Bingo Live has been a wonderful addition to our activities program. Our residents look forward to the games every week!",
      imageSrc: "https://images.unsplash.com/photo-1473893604213-3df9c15611c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      facilityName: "Oakview Care Center",
      quote: "The large print cards and clear number calling have made bingo accessible for all our residents, even those with visual impairments.",
      imageSrc: "https://images.unsplash.com/photo-1454418747937-bd95bb945625?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#f6ad55]">What Care Homes Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white text-gray-900 p-6 rounded-xl shadow-md">
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center overflow-hidden">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{testimonial.facilityName}</h3>
                  <p className="text-lg italic">{testimonial.quote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
