import React from 'react';

const FeaturedImages: React.FC = () => {
  // These will be served from a CDN in a real app
  const images = [
    {
      src: "https://images.unsplash.com/photo-1526378800651-c1a343297b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Elderly residents enjoying bingo in a care home",
      caption: "Residents enjoying weekly bingo at Sunnydale Care Home"
    },
    {
      src: "https://images.unsplash.com/photo-1530968463959-e0dff77447c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Care home common room setup for bingo",
      caption: "TV setup for Golden Bingo Live at Meadowbrook Care Center"
    },
    {
      src: "https://images.unsplash.com/photo-1527359443443-84a48aec73d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Bingo cards laid out on table",
      caption: "Our specially designed bingo cards are easy to read and mark"
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">Golden Bingo Live in Action</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-60">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-lg">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedImages;
