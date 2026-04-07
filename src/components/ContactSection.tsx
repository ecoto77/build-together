import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  message: z.string().trim().min(1, "El mensaje es requerido").max(1000),
});

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "+506 2473-4110",
    href: "tel:+50624734110",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+506 8925-8555",
    href: "https://wa.me/50689258555",
  },
  {
    icon: Mail,
    label: "Email",
    value: "fsm.pital@gmail.com",
    href: "mailto:fsm.pital@gmail.com",
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Pital, San Carlos, Costa Rica",
    href: "https://www.google.com/maps?q=10.454389,-84.273139",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "L-S: 8am-8pm | Dom: 9am-7pm",
    href: null,
  },
];

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    setSending(false);

    if (error) {
      toast.error("Error al enviar el mensaje. Intenta de nuevo.");
    } else {
      toast.success("¡Mensaje enviado! Te responderemos pronto.");
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <section id="contacto" className="py-20 bg-surface">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Contáctanos</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Estamos aquí para ayudarte. Escríbenos o visítanos en nuestra farmacia.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps embed placeholder */}
            <div className="rounded-xl overflow-hidden border border-border h-64">
              <iframe
                title="Ubicación de la farmacia"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3000!2d-84.273139!3d10.454389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z!5e0!3m2!1ses!2scr!4v1700000000000&q=10.454389,-84.273139&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8 rounded-2xl bg-card border border-border space-y-5"
            >
              <h3 className="text-lg font-bold text-foreground">Envíanos un mensaje</h3>

              <div>
                <Input
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Textarea
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
