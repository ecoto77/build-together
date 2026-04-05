import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { usePromotions, useSiteSettings } from "@/hooks/usePromotions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Sun, Snowflake, TreePine, Save, Upload, Image, Mail, MailOpen, Eye } from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminPanel = ({ open, onOpenChange }: AdminPanelProps) => {
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const { data: products } = useProducts();
  const { data: promotions } = usePromotions();
  const { data: settings } = useSiteSettings();
  const currentTheme = settings?.find((s) => s.key === "promo_background_theme")?.value || "summer";

  const { data: contactMessages } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleMarkAsRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
  };

  const handleDeleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    toast.success("Mensaje eliminado");
  };

  // Product form
  const [productForm, setProductForm] = useState({
    name: "",
    active_ingredient: "",
    presentation: "",
    price: "",
    category_id: "",
  });

  // Promo form
  const [promoForm, setPromoForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    badge: "",
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("products").insert({
      name: productForm.name,
      active_ingredient: productForm.active_ingredient || null,
      presentation: productForm.presentation || null,
      price: productForm.price ? parseFloat(productForm.price) : null,
      category_id: productForm.category_id,
    });
    if (error) {
      toast.error("Error al agregar producto");
    } else {
      toast.success("Producto agregado");
      setProductForm({ name: "", active_ingredient: "", presentation: "", price: "", category_id: "" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar producto");
    } else {
      toast.success("Producto eliminado");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("promotions").insert({
      title: promoForm.title,
      subtitle: promoForm.subtitle || null,
      description: promoForm.description || null,
      badge: promoForm.badge || null,
      display_order: (promotions?.length || 0) + 1,
    });
    if (error) {
      toast.error("Error al agregar promoción");
    } else {
      toast.success("Promoción agregada");
      setPromoForm({ title: "", subtitle: "", description: "", badge: "" });
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  };

  const handleDeletePromo = async (id: string) => {
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar promoción");
    } else {
      toast.success("Promoción eliminada");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  };

  const handleUploadPromoImage = async (promoId: string, file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${promoId}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("promotions")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast.error("Error al subir imagen");
      return;
    }
    const { data: urlData } = supabase.storage
      .from("promotions")
      .getPublicUrl(filePath);
    const { error: updateError } = await supabase
      .from("promotions")
      .update({ image_url: urlData.publicUrl })
      .eq("id", promoId);
    if (updateError) {
      toast.error("Error al actualizar promoción");
    } else {
      toast.success("Imagen subida correctamente");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    }
  };

  const handleChangeTheme = async (theme: string) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: theme })
      .eq("key", "promo_background_theme");
    if (error) {
      toast.error("Error al cambiar tema");
    } else {
      toast.success(`Fondo cambiado a: ${theme === "summer" ? "Verano" : theme === "winter" ? "Invierno" : "Navidad"}`);
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    }
  };

  const themes = [
    { value: "summer", label: "Verano", icon: <Sun className="w-4 h-4" /> },
    { value: "winter", label: "Invierno", icon: <Snowflake className="w-4 h-4" /> },
    { value: "christmas", label: "Navidad", icon: <TreePine className="w-4 h-4" /> },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Panel de Administración</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="products" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="promos">Ofertas</TabsTrigger>
            <TabsTrigger value="theme">Fondo</TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              Mensajes
              {(contactMessages || []).filter((m) => !m.is_read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {(contactMessages || []).filter((m) => !m.is_read).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-4 mt-4">
            <form onSubmit={handleAddProduct} className="space-y-3 p-4 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-sm text-foreground">Agregar Producto</h4>
              <Input
                placeholder="Nombre *"
                value={productForm.name}
                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <Input
                placeholder="Ingrediente activo"
                value={productForm.active_ingredient}
                onChange={(e) => setProductForm((p) => ({ ...p, active_ingredient: e.target.value }))}
              />
              <Input
                placeholder="Presentación"
                value={productForm.presentation}
                onChange={(e) => setProductForm((p) => ({ ...p, presentation: e.target.value }))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={productForm.price}
                onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
              />
              <Select
                value={productForm.category_id}
                onValueChange={(v) => setProductForm((p) => ({ ...p, category_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría *" />
                </SelectTrigger>
                <SelectContent>
                  {(categories || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" /> Agregar
              </Button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {(products || []).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-card text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{p.name}</span>
                    {p.price !== null && <span className="text-muted-foreground ml-2">${p.price}</span>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="shrink-0 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* PROMOS TAB */}
          <TabsContent value="promos" className="space-y-4 mt-4">
            <form onSubmit={handleAddPromo} className="space-y-3 p-4 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-sm text-foreground">Agregar Promoción</h4>
              <Input
                placeholder="Título *"
                value={promoForm.title}
                onChange={(e) => setPromoForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <Input
                placeholder="Subtítulo"
                value={promoForm.subtitle}
                onChange={(e) => setPromoForm((p) => ({ ...p, subtitle: e.target.value }))}
              />
              <Input
                placeholder="Descripción"
                value={promoForm.description}
                onChange={(e) => setPromoForm((p) => ({ ...p, description: e.target.value }))}
              />
              <Input
                placeholder="Badge (ej: 2x1, Oferta)"
                value={promoForm.badge}
                onChange={(e) => setPromoForm((p) => ({ ...p, badge: e.target.value }))}
              />
              <Button type="submit" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" /> Agregar
              </Button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {(promotions || []).map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card text-sm">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{p.title}</span>
                    {p.badge && <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">{p.badge}</span>}
                  </div>
                  <label className="shrink-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadPromoImage(p.id, file);
                      }}
                    />
                    <div className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Upload className="w-4 h-4" />
                    </div>
                  </label>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePromo(p.id)} className="shrink-0 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!promotions || promotions.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay promociones aún</p>
              )}
            </div>
          </TabsContent>

          {/* THEME TAB */}
          <TabsContent value="theme" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Selecciona el fondo de la sección de ofertas de temporada:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleChangeTheme(t.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    currentTheme === t.value
                      ? "border-accent bg-accent/10"
                      : "border-border bg-card hover:border-accent/50"
                  }`}
                >
                  {t.icon}
                  <span className="font-medium text-foreground">{t.label}</span>
                  {currentTheme === t.value && (
                    <span className="ml-auto text-xs text-accent font-medium">Activo</span>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">Mensajes recibidos del formulario de contacto:</p>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(contactMessages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border text-sm space-y-2 ${
                    msg.is_read ? "border-border bg-card opacity-70" : "border-accent bg-accent/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {msg.is_read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-accent" />
                      )}
                      <span className="font-semibold text-foreground">{msg.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString("es-CR")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                  <p className="text-foreground">{msg.message}</p>
                  <div className="flex gap-2 pt-1">
                    {!msg.is_read && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(msg.id)}>
                        <Eye className="w-3 h-3 mr-1" /> Marcar leído
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteMessage(msg.id)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              ))}
              {(!contactMessages || contactMessages.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No hay mensajes aún</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AdminPanel;
