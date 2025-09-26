import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ruralDevelopment from "@/assets/rural-development.jpg";
import hostelConstruction from "@/assets/hostel-construction.jpg";
import adarshGram from "@/assets/adarsh-gram.jpg";
import grantsInAid from "@/assets/grants-in-aid.jpg";
import schemeImplementation from "@/assets/scheme-implementation.jpg";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: ruralDevelopment,
      title: "Rural Development Progress",
      description: "Transforming rural landscapes through PM-AJAY initiatives"
    },
    {
      src: hostelConstruction,
      title: "Hostel Construction",
      description: "Building quality educational infrastructure for SC students"
    },
    {
      src: adarshGram,
      title: "Adarsh Gram Development",
      description: "Creating model villages with comprehensive development"
    },
    {
      src: grantsInAid,
      title: "Grants-in-Aid Distribution",
      description: "Empowering communities through targeted financial assistance"
    },
    {
      src: schemeImplementation,
      title: "Scheme Implementation",
      description: "Coordinated execution across multiple agency levels"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            PM-AJAY in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Witness the transformative impact of coordinated agency implementation across India
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-govt">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 relative">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-[500px] lg:h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                      {image.title}
                    </h3>
                    <p className="text-lg text-white/90 max-w-2xl">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              onClick={prevSlide}
              variant="outline"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              onClick={nextSlide}
              variant="outline"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-primary scale-110" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;