import { useState, useEffect, useRef } from "react";
import { Cross as Pharmacy, ShoppingCart, Menu, X, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLoginDialog from "@/components/AdminLoginDialog";
import AdminPanel from "@/components/AdminPanel";

const navLinks = [
  { label: "Inicio", href: "#inicio", sectionId: "inicio" },
  { label: "Productos", href: "#productos", sectionId: "productos" },
  { label: "Nosotros", href: "#nosotros", sectionId: "nosotros" },
  { label: "Contacto", href: "#contacto", sectionId: "contacto" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = navLinks.map((l) => l.sectionId);
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl shadow-sm border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <Pharmacy
              className="text-accent transition-transform duration-300 group-hover:rotate-12"
              size={28}
              strokeWidth={2.5}
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                Santa Mónica
              </span>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-secondary">
                Farmacia
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 ${
                    activeSection === link.sectionId
                      ? "text-accent after:w-full"
                      : "text-foreground/70 hover:text-accent after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Cart + Admin + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Admin button */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPanelOpen(true)}
                  className="text-accent hover:text-accent/80 transition-colors"
                  aria-label="Panel de administración"
                  title="Panel de administración"
                >
                  <Shield size={20} />
                </button>
                <button
                  onClick={signOut}
                  className="text-foreground/50 hover:text-destructive transition-colors"
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="text-foreground/30 hover:text-foreground/60 transition-colors"
                aria-label="Acceso administrador"
                title="Acceso administrador"
              >
                <Shield size={18} />
              </button>
            )}

            <button
              className="relative text-foreground/70 hover:text-accent transition-colors duration-200"
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden text-foreground/70 hover:text-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } bg-background/80 backdrop-blur-xl border-b border-border/50`}
        >
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    activeSection === link.sectionId
                      ? "text-accent"
                      : "text-foreground/70 hover:text-accent"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <AdminPanel open={panelOpen} onOpenChange={setPanelOpen} />
    </>
  );
};

export default Navbar;
