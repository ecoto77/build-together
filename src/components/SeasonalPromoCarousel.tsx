import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePromotions, useSiteSettings } from "@/hooks/usePromotions";

// Lazy-load background images to prevent module crash on transient 503s
const backgroundImages: Record<string, () => Promise<{ default: string }>> = {
  summer: () => import("@/assets/bg-summer.jpg"),
  winter: () => import("@/assets/bg-winter.jpg"),
  christmas: () => import("@/assets/bg-christmas.jpg"),
};

const SeasonalPromoCarousel = () => {
  const { data: promotions } = usePromotions();
  const { data: settings } = useSiteSettings();
  const theme = settings?.find((s) => s.key === "promo_background_theme")?.value || "summer";

  const [bgImage, setBgImage] = useState<string>("");

  useEffect(() => {
    const loader = backgroundImages[theme] || backgroundImages.summer;
    loader().then((m) => setBgImage(m.default)).catch(() => setBgImage(""));
  }, [theme]);

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

  if (!promotions || promotions.length === 0) return null;

  return (
    <section
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {promotions.map((promo, i) => (
                <div key={promo.id} className="flex-[0_0_100%] min-w-0">
                  <div className="relative h-56 sm:h-64 lg:h-80 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80">
                    <div className="absolute inset-0 flex">
                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
                        {promo.badge && (
                          <span className="inline-block w-fit px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
                            {promo.badge}
                          </span>
                        )}
                        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                          {promo.title}
                        </h3>
                        {promo.subtitle && (
                          <p className="text-primary-foreground/90 text-base sm:text-lg font-medium mb-1">
                            {promo.subtitle}
                          </p>
                        )}
                        {promo.description && (
                          <p className="text-primary-foreground/70 text-sm sm:text-base max-w-md">
                            {promo.description}
                          </p>
                        )}
                      </div>
                      {/* Image */}
                      <div className="hidden sm:flex w-2/5 items-center justify-center p-6">
                        {promo.image_url ? (
                          <img
                            src={promo.image_url}
                            alt={promo.title}
                            className="max-h-full max-w-full object-contain rounded-xl drop-shadow-lg"
                          />
                        ) : (
                          <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-xl bg-primary-foreground/10 border-2 border-dashed border-primary-foreground/30 flex items-center justify-center">
                            <span className="text-primary-foreground/40 text-xs text-center px-2">Imagen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {promotions.length > 1 && (
            <>
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
            </>
          )}

          {/* Dots */}
          {promotions.length > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {promotions.map((_, i) => (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default SeasonalPromoCarousel;
