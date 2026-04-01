import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import serviceMedicamentos from "@/assets/service-medicamentos.jpg";
import serviceDermocosmetica from "@/assets/service-dermocosmetica.jpg";
import serviceBebes from "@/assets/service-bebes.jpg";
import serviceNutricion from "@/assets/service-nutricion.jpg";
import serviceAccesorios from "@/assets/service-accesorios.jpg";
import serviceAtencion from "@/assets/service-atencion.jpg";
import ProductSearch from "@/components/ProductSearch";
import CategoryProductsDialog from "@/components/CategoryProductsDialog";
import { useCategories, useProducts, type SearchFilter } from "@/hooks/useProducts";
import { FlaskConical, Package } from "lucide-react";

const categoryImages: Record<string, string> = {
  medicamentos: serviceMedicamentos,
  dermocosmetica: serviceDermocosmetica,
  bebes: serviceBebes,
  nutricion: serviceNutricion,
  accesorios: serviceAccesorios,
  atencion: serviceAtencion,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ServicesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("name");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);

  const { data: categories } = useCategories();
  const { data: searchResults, isLoading: isSearching } = useProducts({
    searchQuery: searchQuery.length >= 2 ? searchQuery : undefined,
    searchFilter,
  });

  const isSearchActive = searchQuery.length >= 2;

  const handleSearch = (query: string, filter: SearchFilter) => {
    setSearchQuery(query);
    setSearchFilter(filter);
  };

  // Group search results by category
  const groupedResults = useMemo(() => {
    if (!searchResults || !isSearchActive) return null;
    const groups: Record<string, { name: string; products: typeof searchResults }> = {};
    for (const product of searchResults) {
      const cat = (product as any).categories;
      const catName = cat?.name || "Sin categoría";
      if (!groups[product.category_id]) {
        groups[product.category_id] = { name: catName, products: [] };
      }
      groups[product.category_id].products.push(product);
    }
    return groups;
  }, [searchResults, isSearchActive]);

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
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            En Farmacia Santa Mónica encontrarás una amplia variedad de productos y servicios pensados para tu bienestar.
          </p>

          {/* Search */}
          <ProductSearch onSearch={handleSearch} />
        </motion.div>

        {/* Search results */}
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            {isSearching ? (
              <div className="space-y-3 max-w-2xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-card animate-pulse" />
                ))}
              </div>
            ) : groupedResults && Object.keys(groupedResults).length > 0 ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <p className="text-sm text-muted-foreground">
                  {searchResults?.length} resultado{searchResults?.length !== 1 ? "s" : ""} encontrado{searchResults?.length !== 1 ? "s" : ""}
                </p>
                {Object.entries(groupedResults).map(([catId, group]) => (
                  <div key={catId}>
                    <h3 className="text-sm font-semibold text-accent mb-2">{group.name}</h3>
                    <div className="space-y-2">
                      {group.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm">{product.name}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                              {product.active_ingredient && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <FlaskConical className="w-3 h-3" />
                                  {product.active_ingredient}
                                </span>
                              )}
                              {product.presentation && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <Package className="w-3 h-3" />
                                  {product.presentation}
                                </span>
                              )}
                            </div>
                          </div>
                          {product.price !== null && product.price > 0 && (
                            <span className="text-sm font-bold text-accent">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No se encontraron productos.</p>
            )}
          </motion.div>
        )}

        {/* Category Grid */}
        {!isSearchActive && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(categories || []).map((category, i) => {
              const image = categoryImages[category.slug] || serviceMedicamentos;
              return (
                <motion.div
                  key={category.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  onClick={() =>
                    setSelectedCategory({
                      id: category.id,
                      name: category.name,
                      image,
                    })
                  }
                  className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={image}
                      alt={category.name}
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
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <span className="inline-block mt-3 text-accent text-sm font-medium group-hover:underline">
                      Ver productos →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category products dialog */}
      {selectedCategory && (
        <CategoryProductsDialog
          open={!!selectedCategory}
          onOpenChange={(open) => !open && setSelectedCategory(null)}
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          categoryImage={selectedCategory.image}
        />
      )}
    </section>
  );
};

export default ServicesSection;
