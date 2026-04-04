import { motion } from "framer-motion";
import { Heart, Shield, Clock, Award } from "lucide-react";
import aboutImage from "@/assets/about-pharmacy.jpg";

const values = [
  {
    icon: Heart,
    title: "Compromiso",
    description: "Nos importa tu bienestar. Cada paciente es tratado con calidez y dedicación.",
  },
  {
    icon: Shield,
    title: "Confianza",
    description: "Más de 20 años respaldando a nuestra comunidad con productos de calidad.",
  },
  {
    icon: Clock,
    title: "Disponibilidad",
    description: "Siempre listos para atenderte con horarios extendidos y servicio ágil.",
  },
  {
    icon: Award,
    title: "Profesionalismo",
    description: "Personal farmacéutico capacitado y en constante actualización.",
  },
];

const AboutSection = () => {
  return (
    <section id="nosotros" className="py-24 bg-background">
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
            Nuestra Historia
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Farmacia Santa Mónica
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Más de dos décadas cuidando la salud de nuestras familias
          </p>
        </motion.div>

        {/* Content: Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={aboutImage}
              alt="Interior de Farmacia Santa Mónica"
              loading="lazy"
              width={1280}
              height={720}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/50 to-transparent p-6">
              <span className="text-primary-foreground font-display text-lg font-bold">
                Desde 2003
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6"
          >
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Tu farmacia de confianza en la comunidad
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Farmacia Santa Mónica nació con la misión de ofrecer a nuestras familias un espacio 
              cercano, profesional y confiable donde encontrar todo lo que necesitan para su salud 
              y bienestar. Desde nuestros inicios hemos apostado por un servicio personalizado, 
              con atención farmacéutica de calidad y un catálogo amplio que abarca desde 
              medicamentos hasta productos de cuidado personal y nutrición.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Con el paso de los años hemos crecido junto a nuestra comunidad, incorporando 
              nuevas líneas de productos y modernizando nuestras instalaciones, pero sin perder 
              lo que nos distingue: el trato humano, la asesoría profesional y el compromiso 
              genuino con tu bienestar.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <span className="block text-3xl font-bold text-accent">20+</span>
                <span className="text-sm text-muted-foreground">Años</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="block text-3xl font-bold text-accent">5K+</span>
                <span className="text-sm text-muted-foreground">Familias</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="block text-3xl font-bold text-accent">2K+</span>
                <span className="text-sm text-muted-foreground">Productos</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Nuestros Valores
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-display text-lg font-bold text-foreground mb-2">
                {value.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
