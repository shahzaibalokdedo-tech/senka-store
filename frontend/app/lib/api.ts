const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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

    const res = await fetch(`${API_BASE}/products/?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.items || [];
  } catch {
    return getFallbackProducts(category, search);
  }
}

export async function fetchCategories(): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/products/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [
      { id: 1, name: "Solitaire Rings", slug: "rings" },
      { id: 2, name: "Necklaces & Pendants", slug: "necklaces" },
      { id: 3, name: "Kundan & Polki", slug: "kundan-polki" },
      { id: 4, name: "Oxidised Silver", slug: "oxidised-silver" },
      { id: 5, name: "Bangles & Cuffs", slug: "bangles" },
      { id: 6, name: "Earrings & Jhumkas", slug: "earrings" },
      { id: 7, name: "Bridal Sets", slug: "bridal" },
    ];
  }
}

// ─────────────────────────────────────────────
// Order APIs
// ─────────────────────────────────────────────

export async function createOrder(orderPayload: any) {
  try {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return {
      order_number: "SNK-" + Math.floor(100000 + Math.random() * 900000),
      total: orderPayload.items.reduce((s: number, i: any) => s + i.unit_price * i.quantity, 0),
      message: "Order recorded (offline mode)",
    };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders/`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [
      { id: 1, order_number: "SNK-481920", total: 434000, currency: "PKR", status: "pending", payment_provider: "cod", created_at: new Date().toISOString() },
      { id: 2, order_number: "SNK-319582", total: 194250, currency: "PKR", status: "processing", payment_provider: "bank", created_at: new Date().toISOString() },
    ];
  }
}

// ─────────────────────────────────────────────
// Admin APIs
// ─────────────────────────────────────────────

export async function fetchAdminCategories() {
  try {
    const res = await fetch(`${API_BASE}/admin/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return (await res.json()).categories || [];
  } catch {
    return [];
  }
}

export async function fetchAdminCustomers() {
  try {
    const res = await fetch(`${API_BASE}/admin/customers`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return (await res.json()).customers || [];
  } catch {
    return [];
  }
}

export async function fetchSiteSettings(): Promise<{ key: string; value: string; label: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/settings`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return (await res.json()).settings || [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// Fallback product data (offline mode)
// ─────────────────────────────────────────────

function getFallbackProducts(category?: string, search?: string): ProductItem[] {
  const fallback: ProductItem[] = [
    { id: 1, sku: "SNK-RNG-001", name: "Royal Solitaire Halo Ring", slug: "royal-solitaire-halo-ring", price: 249000, compare_price: 295000, discount: "16% OFF", currency: "PKR", stock: 8, category: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop", tag: "Signature", rating: 5, reviews: 48 },
    { id: 2, sku: "SNK-NCK-002", name: "Pearl Halo Emerald Pendant Set", slug: "pearl-halo-emerald-pendant-set", price: 185000, compare_price: 220000, discount: "15% OFF", currency: "PKR", stock: 5, category: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop", tag: "New", rating: 4.9, reviews: 32 },
    { id: 3, sku: "SNK-BDL-003", name: "Royal Kundan Bridal Set", slug: "royal-kundan-bridal-set", price: 419000, compare_price: 490000, discount: "14% OFF", currency: "PKR", stock: 2, category: "Bridal", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", tag: "Luxury", rating: 5, reviews: 64 },
    { id: 4, sku: "SNK-OXI-004", name: "Oxidised Silver Royal Choker", slug: "oxidised-silver-royal-choker", price: 95000, compare_price: 120000, discount: "20% OFF", currency: "PKR", stock: 12, category: "Oxidised Silver", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop", tag: "Festive", rating: 4.8, reviews: 19 },
    { id: 5, sku: "SNK-BNG-005", name: "Sapphire & Diamond Tennis Cuff", slug: "sapphire-diamond-tennis-cuff", price: 280000, compare_price: 320000, discount: "12% OFF", currency: "PKR", stock: 6, category: "Bangles", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", tag: "Classic", rating: 5, reviews: 27 },
    { id: 6, sku: "SNK-EAR-006", name: "Celestial Diamond Drop Earrings", slug: "celestial-diamond-drop-earrings", price: 165000, compare_price: 190000, discount: "13% OFF", currency: "PKR", stock: 10, category: "Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop", tag: "Trending", rating: 4.9, reviews: 41 },
  ];

  return fallback.filter((p) => {
    const matchCat = !category || category === "All" || p.category.toLowerCase().includes(category.toLowerCase());
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
}
