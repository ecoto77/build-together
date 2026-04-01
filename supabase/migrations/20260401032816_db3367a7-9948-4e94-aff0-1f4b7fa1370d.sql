
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  active_ingredient TEXT,
  presentation TEXT,
  description TEXT,
  price NUMERIC(10,2),
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for search
CREATE INDEX idx_products_name ON public.products USING gin(to_tsvector('spanish', name));
CREATE INDEX idx_products_active_ingredient ON public.products USING gin(to_tsvector('spanish', coalesce(active_ingredient, '')));
CREATE INDEX idx_products_presentation ON public.products USING gin(to_tsvector('spanish', coalesce(presentation, '')));
CREATE INDEX idx_products_category ON public.products(category_id);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access (it's a pharmacy catalog)
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT TO anon, authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Medicamentos y Recetas', 'medicamentos', 'Amplio inventario de medicamentos con y sin receta.', 1),
  ('Dermocosmética y Belleza', 'dermocosmetica', 'Las mejores marcas en cuidado de piel, cabello y cosmética.', 2),
  ('Bebés y Niños', 'bebes', 'Todo para el cuidado de los más pequeños.', 3),
  ('Nutrición y Salud Natural', 'nutricion', 'Suplementos, vitaminas y productos naturales.', 4),
  ('Accesorios Médicos', 'accesorios', 'Tensiómetros, termómetros, botiquines y más.', 5),
  ('Atención Personalizada', 'atencion', 'Asesoría farmacéutica con dedicación y profesionalismo.', 6);
