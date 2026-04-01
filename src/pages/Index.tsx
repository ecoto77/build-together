import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesSection from "@/components/ServicesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroCarousel />
        <ServicesSection />
        <section id="nosotros" className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Nosotros — próximamente</p>
        </section>
        <section id="contacto" className="min-h-screen flex items-center justify-center bg-surface">
          <p className="text-muted-foreground text-lg">Contacto — próximamente</p>
        </section>
      </main>
    </div>
  );
};

export default Index;
