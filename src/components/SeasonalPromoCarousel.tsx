import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import promoGripe from "@/assets/promo-gripe.jpg";
import promoSolar from "@/assets/promo-proteccion-solar.jpg";
import promoVitaminas from "@/assets/promo-vitaminas.jpg";
import promoAlergias from "@/assets/promo-alergias.jpg";

const promos = [
  {
    image: promoGripe,
    title: "Temporada de Gripe",
    subtitle: "Protege a tu familia",
    description: "Hasta 25% de descuento en antigripales y descongestionantes",
    badge: "Oferta",
  },
  {
    image: promoSolar,
    title: "Protección Solar",
    subtitle: "Cuida tu piel este verano",
    description: "Protectores solares desde $8.99 — todas las marcas",
    badge: "Temporada",
  },
  {
    image: promoVitaminas,
    title: "Vitaminas y Suplementos",
    subtitle: "Refuerza tus defensas",
    description: "2x1 en vitaminas seleccionadas durante todo el mes",
    badge: "2x1",
  },
  {
    image: promoAlergias,
    title: "Temporada de Alergias",
    subtitle: "Respira tranquilo",
    description: "Antialérgicos y tratamientos con 20% de descuento",
    badge: "Descuento",
  },
];

const SeasonalPromoCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Promociones
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Ofertas de Temporada
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative group">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {promos.map((promo, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0">
                  <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-2xl">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      loading="lazy"
                      width={1280}
                      height={576}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
                      <span className="inline-block w-fit px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
                        {promo.badge}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                        {promo.title}
                      </h3>
                      <p className="text-white/90 text-base sm:text-lg font-medium mb-1">
                        {promo.subtitle}
                      </p>
                      <p className="text-white/70 text-sm sm:text-base max-w-md">
                        {promo.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "bg-accent w-7"
                    : "bg-border hover:bg-muted-foreground/40"
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalPromoCarousel;
