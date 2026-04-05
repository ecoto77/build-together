import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesSection from "@/components/ServicesSection";
import SeasonalPromoCarousel from "@/components/SeasonalPromoCarousel";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroCarousel />
        <ServicesSection />
        <SeasonalPromoCarousel />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
