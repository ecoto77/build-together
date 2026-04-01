import { motion } from "framer-motion";
import serviceMedicamentos from "@/assets/service-medicamentos.jpg";
import serviceDermocosmetica from "@/assets/service-dermocosmetica.jpg";
import serviceBebes from "@/assets/service-bebes.jpg";
import serviceNutricion from "@/assets/service-nutricion.jpg";
import serviceAccesorios from "@/assets/service-accesorios.jpg";
import serviceAtencion from "@/assets/service-atencion.jpg";

const services = [
  {
    title: "Medicamentos y Recetas",
    description: "Amplio inventario de medicamentos con y sin receta. Atención profesional garantizada.",
    image: serviceMedicamentos,
  },
  {
    title: "Dermocosmética y Belleza",
    description: "Las mejores marcas en cuidado de piel, cabello y cosmética dermatológica.",
    image: serviceDermocosmetica,
  },
  {
    title: "Bebés y Niños",
    description: "Todo para el cuidado de los más pequeños: pañales, cremas, alimentación y más.",
    image: serviceBebes,
  },
  {
    title: "Nutrición y Salud Natural",
    description: "Suplementos, vitaminas y productos naturales para un estilo de vida saludable.",
    image: serviceNutricion,
  },
  {
    title: "Accesorios Médicos",
    description: "Tensiómetros, termómetros, botiquines y dispositivos de monitoreo personal.",
    image: serviceAccesorios,
  },
  {
    title: "Atención Personalizada",
    description: "Nuestros farmacéuticos te asesoran con dedicación y profesionalismo.",
    image: serviceAtencion,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ServicesSection = () => {
  return (
    <section id="productos" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Nuestros Servicios
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En Farmacia Santa Mónica encontrarás una amplia variedad de productos y servicios pensados para tu bienestar.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  width={640}
                  height={512}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
