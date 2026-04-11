import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroSlide1,
    headline: "Tu salud, nuestra prioridad",
    subheadline: "Bienvenidos a Farmacia Santa Mónica — más de 20 años cuidando de tu familia con dedicación y confianza.",
  },
  {
    image: heroSlide2,
    headline: "Productos que cuidan de ti",
    subheadline: "Medicamentos, dermocosmética, suplementos y todo lo que necesitas para tu bienestar en un solo lugar.",
  },
  {
    image: heroSlide3,
    headline: "Atención personalizada",
    subheadline: "Nuestro equipo de profesionales te asesora para encontrar siempre la mejor solución para tu salud.",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section id="inicio" className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].headline}
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                  {slides[current].headline}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-primary-foreground/80 sm:text-lg max-w-md">
                  {slides[current].subheadline}
                </p>
                <a
                  href="https://wa.me/50689258555?text=Hola,%20me%20gustaría%20consultar%20sobre%20sus%20productos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-accent/30"
                >
                  <MessageCircle size={18} />
                  Escríbenos por WhatsApp
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
        <button
          onClick={prev}
          aria-label="Slide anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground/70 backdrop-blur-sm transition-all hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Siguiente slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground/70 backdrop-blur-sm transition-all hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-accent"
                : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
