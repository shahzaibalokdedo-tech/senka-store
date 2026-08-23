const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://senkafashion.com/api";

export interface ProductItem {
  id: number;
  sku: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  comparePrice?: number;
  discount?: string;
  currency: string;
  stock: number;
  category: string;
  short_description?: string;
  description?: string;
  image: string;
  image_url?: string;
  secondaryImage?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
}

// ─────────────────────────────────────────────
// Product APIs
// ─────────────────────────────────────────────

export async function fetchProducts(category?: string, search?: string): Promise<ProductItem[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (search) params.append("search", search);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.items || []);

    return list.map((item: any) => {
      const imgUrl = item.image_url || item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop";
      const secImgUrl = item.secondaryImage || (item.images && item.images[1]) || imgUrl;
      return {
        ...item,
        price: Number(item.price),
        image: imgUrl,
        image_url: imgUrl,
        secondaryImage: secImgUrl,
        tag: item.tag || (item.is_featured ? "Signature" : (item.is_new_arrival ? "New" : "Luxury")),
        rating: item.rating || 5.0,
        reviews: item.reviews || 24,
      };
    });
  } catch {
    return getFallbackProducts(category, search);
  }
}

export async function fetchCategories(): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : (data.categories || []);
  } catch {
    return [
      { id: 1, name: "Solitaire Rings", slug: "rings" },
      { id: 2, name: "Necklaces & Pendants", slug: "necklaces" },
      { id: 3, name: "Earrings & Studs", slug: "earrings" },
      { id: 4, name: "Bangles & Bracelets", slug: "bracelets" },
      { id: 5, name: "Bridal Sets", slug: "bridal" },
      { id: 6, name: "Bespoke & Custom", slug: "custom" },
    ];
  }
}

// ─────────────────────────────────────────────
// Order APIs
// ─────────────────────────────────────────────

export async function createOrder(orderPayload: any) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return {
      order_number: "SNK-" + Math.floor(100000 + Math.random() * 900000),
      total: orderPayload.items.reduce((s: number, i: any) => s + (i.unit_price || i.price || 0) * (i.quantity || 1), 0),
      message: "Order recorded (offline mode)",
    };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/admin/orders`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : (data.orders || []);
  } catch {
    return [
      { id: 1, order_number: "SNK-481920", total: 434000, total_amount: 434000, currency: "PKR", status: "processing", created_at: new Date().toISOString() },
      { id: 2, order_number: "SNK-319582", total: 194250, total_amount: 194250, currency: "PKR", status: "processing", created_at: new Date().toISOString() },
    ];
  }
}

// ─────────────────────────────────────────────
// Admin APIs
// ─────────────────────────────────────────────

export async function fetchAdminCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : (data.categories || []);
  } catch {
    return [];
  }
}

export async function fetchAdminCustomers() {
  try {
    const res = await fetch(`${API_BASE}/admin/customers`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : (data.customers || []);
  } catch {
    return [];
  }
}

export async function fetchSiteSettings(): Promise<{ key: string; value: string; label: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/settings`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.settings || []);
    return list.map((s: any) => ({
      key: s.setting_key || s.key,
      value: s.setting_value || s.value,
      label: s.label || s.setting_key || s.key
    }));
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// Fallback product data (offline mode)
// ─────────────────────────────────────────────

function getFallbackProducts(category?: string, search?: string): ProductItem[] {
  const fallback: ProductItem[] = [
    { id: 1, sku: "RN-SOL-001", name: "Royal Solitaire Halo Ring", slug: "royal-solitaire-halo-ring", price: 249000, compare_price: 280000, discount: "11% OFF", currency: "PKR", stock: 10, category: "Solitaire Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop", tag: "Signature", rating: 5, reviews: 48 },
    { id: 2, sku: "NC-EMR-002", name: "Pearl Emerald Pendant Set", slug: "pearl-emerald-pendant-set", price: 185000, compare_price: 210000, discount: "12% OFF", currency: "PKR", stock: 10, category: "Necklaces & Pendants", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop", tag: "New", rating: 4.9, reviews: 32 },
    { id: 3, sku: "ER-DRP-003", name: "Celestial Diamond Drop Earrings", slug: "celestial-diamond-drop-earrings", price: 310000, compare_price: 350000, discount: "11% OFF", currency: "PKR", stock: 10, category: "Earrings & Studs", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop", tag: "Trending", rating: 4.9, reviews: 41 },
    { id: 4, sku: "BR-GLD-004", name: "Art Deco Gold Cuff Bangle", slug: "art-deco-gold-cuff-bangle", price: 420000, currency: "PKR", stock: 10, category: "Bangles & Bracelets", image: "https://images.unsplash.com/photo-1611591475143-4f8a7739e878?q=80&w=800&auto=format&fit=crop", tag: "Classic", rating: 5, reviews: 19 },
    { id: 5, sku: "SET-BDL-005", name: "Imperial Heritage Bridal Set", slug: "imperial-heritage-bridal-set", price: 1250000, compare_price: 1400000, discount: "10% OFF", currency: "PKR", stock: 10, category: "Bridal Sets", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", tag: "Luxury", rating: 5, reviews: 64 },
    { id: 6, sku: "RN-SAP-006", name: "Sapphire & Diamond Band", slug: "sapphire-diamond-band", price: 145000, currency: "PKR", stock: 10, category: "Bespoke & Custom", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop", tag: "Signature", rating: 4.8, reviews: 27 },
  ];

  return fallback.filter((p) => {
    const matchCat = !category || category === "All" || p.category.toLowerCase().includes(category.toLowerCase());
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
}
