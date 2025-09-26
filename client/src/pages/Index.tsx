import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import Components from "@/components/Components";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const id = target.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ImageCarousel />
        <Components />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;