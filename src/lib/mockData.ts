import type { Invoice, Product, ActivityItem } from "@/types";

const IMG = (q: string) =>
  `https://images.unsplash.com/${q}?w=400&h=400&fit=crop&auto=format`;

const photos: Record<string, string[]> = {
  Sarees: [
    "photo-1610030469983-98e550d6193c",
    "photo-1583391733956-3750e0ff4e8b",
    "photo-1610189025857-99d68ebf3b53",
    "photo-1617059062941-91ed68754dec",
    "photo-1590736969955-71cc94901144",
  ],
  Kurtis: [
    "photo-1583391733975-b29c1f4079a9",
    "photo-1602810318383-e386cc2a3ccf",
    "photo-1583391733981-3f5dc7e7f93e",
    "photo-1606760227091-3dd870d97f1d",
  ],
  "Dress Materials": [
    "photo-1620799140188-3b2a02fd9a77",
    "photo-1606760227091-3dd870d97f1d",
    "photo-1612722432474-b971cdcea546",
  ],
  Blouses: [
    "photo-1591047139829-d91aecb6caea",
    "photo-1556909114-44e3e70034e2",
    "photo-1583391733941-1ef6e4cca58a",
  ],
  "Kids Collection": [
    "photo-1518831959646-742c3a14ebf7",
    "photo-1503944583220-79d8926ad5e2",
    "photo-1543854704-783ccca4ea3a",
  ],
  Accessories: [
    "photo-1601121141461-9d6647bca1ed",
    "photo-1611591437281-460bfbe1220a",
    "photo-1599643477877-530eb83abc8e",
  ],
};

const productNames: Record<string, string[]> = {
  Sarees: [
    "Kanchipuram Silk Saree",
    "Banarasi Tissue Saree",
    "Chettinad Cotton Saree",
    "Mysore Silk Saree",
    "Pochampally Ikat Saree",
    "Soft Silk Saree - Maroon",
    "Linen Zari Saree",
    "Tussar Silk Saree",
    "Organza Floral Saree",
    "Kalamkari Cotton Saree",
    "Half Saree - Pista Green",
    "Designer Net Saree",
  ],
  Kurtis: [
    "Anarkali Kurti Set",
    "Straight Cut Kurti",
    "A-Line Cotton Kurti",
    "Embroidered Silk Kurti",
    "Chikankari Kurti Set",
    "Rayon Printed Kurti",
    "Long Kurta Pant Set",
    "Designer Sharara Set",
  ],
  "Dress Materials": [
    "Unstitched Cotton Suit",
    "Pure Chanderi Material",
    "Banarasi Dress Material",
    "Cotton Patiala Suit Piece",
    "Georgette Suit Piece",
    "Silk Salwar Material",
  ],
  Blouses: [
    "Designer Blouse - Gold",
    "Embroidered Blouse - Red",
    "Plain Cotton Blouse",
    "Brocade Blouse - Wine",
    "Aari Work Blouse",
    "High Neck Designer Blouse",
  ],
  "Kids Collection": [
    "Kids Lehenga - Pink",
    "Kids Pattu Pavadai",
    "Boys Kurta Set",
    "Kids Half Saree",
    "Frock - Floral Print",
    "Kids Sherwani",
  ],
  Accessories: [
    "Temple Jewellery Set",
    "Antique Choker Set",
    "Silk Dupatta - Mustard",
    "Pearl Maang Tikka",
    "Banarasi Dupatta",
    "Bridal Jhumka Set",
    "Waist Belt - Gold",
    "Hair Accessory Set",
  ],
};

const baseSelling: Record<string, [number, number]> = {
  Sarees: [3500, 28000],
  Kurtis: [1200, 4800],
  "Dress Materials": [1400, 6500],
  Blouses: [800, 3200],
  "Kids Collection": [900, 4200],
  Accessories: [450, 5400],
};

const colorsByCategory: Record<string, string[]> = {
  Sarees: ["Maroon", "Peacock Blue", "Gold", "Cream", "Red", "Green", "Purple", "Pink", "Navy", "Off-White"],
  Kurtis: ["Pink", "White", "Sky Blue", "Yellow", "Peach", "Mint", "Lavender", "Coral"],
  "Dress Materials": ["Beige", "Teal", "Rust", "Indigo", "Mustard", "Olive", "Burgundy"],
  Blouses: ["Gold", "Red", "Black", "Wine", "Silver", "Green", "Blue"],
  "Kids Collection": ["Pink", "Blue", "Yellow", "Red", "Purple", "Orange", "Multi"],
  Accessories: ["Gold", "Silver", "Multi", "Antique", "Mustard", "Ivory"],
};

const sizesByCategory: Record<string, string[]> = {
  Sarees: ["Free Size"],
  Kurtis: ["XS", "S", "M", "L", "XL", "XXL"],
  "Dress Materials": ["2.5m", "3m", "3.5m", "4m"],
  Blouses: ["32", "34", "36", "38", "40", "42"],
  "Kids Collection": ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  Accessories: ["Free Size"],
};

const materialsByCategory: Record<string, string[]> = {
  Sarees: ["Pure Silk", "Cotton", "Tissue Silk", "Georgette", "Net", "Linen", "Organza", "Tussar"],
  Kurtis: ["Cotton", "Rayon", "Silk", "Georgette", "Chanderi", "Chikankari"],
  "Dress Materials": ["Cotton", "Chanderi", "Banarasi Silk", "Georgette", "Silk"],
  Blouses: ["Silk", "Cotton", "Brocade", "Velvet", "Net"],
  "Kids Collection": ["Cotton", "Silk", "Net", "Georgette", "Polyester"],
  Accessories: ["Gold Plated", "Sterling Silver", "Silk", "Brass", "Fabric"],
};

const gstByCategory: Record<string, number> = {
  Sarees: 5,
  Kurtis: 5,
  "Dress Materials": 5,
  Blouses: 5,
  "Kids Collection": 5,
  Accessories: 12,
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickPhoto(cat: string, idx: number) {
  const list = photos[cat];
  return IMG(list[idx % list.length]);
}

function makeBarcode(seed: number) {
  // EAN-13 styled, 13 digits, deterministic
  const s = (seed * 9301 + 49297) % 233280;
  const base = (1000000000000 + Math.floor(s * 100000) + seed * 31).toString();
  return base.slice(0, 13).padEnd(13, "0");
}

export const CATEGORIES = [
  "Sarees",
  "Kurtis",
  "Dress Materials",
  "Blouses",
  "Kids Collection",
  "Accessories",
];

export { colorsByCategory, sizesByCategory, materialsByCategory };

function buildProducts(): Product[] {
  const out: Product[] = [];
  let i = 1;
  for (const cat of CATEGORIES) {
    const names = productNames[cat];
    const [low, high] = baseSelling[cat];
    for (let n = 0; n < names.length; n++) {
      const sell = rand(low, high);
      const cost = Math.round(sell * (0.55 + Math.random() * 0.2));
      const qty = Math.random() < 0.18 ? rand(0, 4) : rand(8, 60);
      const id = `P${String(i).padStart(4, "0")}`;
      const sku = `${cat.slice(0, 3).toUpperCase()}-${String(i).padStart(4, "0")}`;
      out.push({
        id,
        name: names[n],
        sku,
        barcode: makeBarcode(i),
        category: cat,
        color: colorsByCategory[cat][n % colorsByCategory[cat].length],
        size: sizesByCategory[cat][n % sizesByCategory[cat].length],
        material: materialsByCategory[cat][n % materialsByCategory[cat].length],
        quantity: qty,
        purchasePrice: cost,
        sellingPrice: sell,
        gst: gstByCategory[cat] ?? 5,
        image: pickPhoto(cat, n),
        addedOn: new Date(
          Date.now() - rand(2, 90) * 24 * 60 * 60 * 1000
        ).toISOString(),
        lowStockThreshold: 6,
      });
      i++;
    }
  }
  return out;
}

export const PRODUCTS: Product[] = buildProducts();

const customers: { name: string; phone: string }[] = [
  { name: "Aishwarya Ramesh", phone: "+91 98414 23117" },
  { name: "Divya Nair", phone: "+91 98765 41122" },
  { name: "Meena Sundaram", phone: "+91 99623 51009" },
  { name: "Janani Krishnan", phone: "+91 98403 72211" },
  { name: "Revathi Iyer", phone: "+91 90039 11422" },
  { name: "Sangeetha Rao", phone: "+91 87543 80012" },
  { name: "Bhavani Subramanian", phone: "+91 98112 34091" },
  { name: "Kavya Lakshmi", phone: "+91 70922 81143" },
  { name: "Indira Murugan", phone: "+91 98452 22118" },
  { name: "Padmavathi N", phone: "+91 98410 64512" },
];

const paymentModes: Invoice["paymentMode"][] = ["Cash", "UPI", "Card"];
const staff = ["Priya R.", "Lakshmi (Owner)", "Anitha M."];

function buildInvoices(): Invoice[] {
  const list: Invoice[] = [];
  for (let i = 0; i < 28; i++) {
    const c = customers[i % customers.length];
    const itemCount = rand(1, 4);
    const items = [];
    let subtotal = 0;
    let gstAmount = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = PRODUCTS[rand(0, PRODUCTS.length - 1)];
      const q = rand(1, 2);
      const line = {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        price: p.sellingPrice,
        gst: p.gst,
        quantity: q,
      };
      items.push(line);
      const lineTotal = p.sellingPrice * q;
      subtotal += lineTotal;
      gstAmount += (lineTotal * p.gst) / 100;
    }
    const discount = Math.random() < 0.4 ? rand(50, 500) : 0;
    const total = Math.round(subtotal + gstAmount - discount);
    const daysAgo = i < 6 ? rand(0, 1) : rand(0, 28);
    list.push({
      id: `INV${1000 + i}`,
      number: `AKB-${2025}-${String(1000 + i).slice(1)}`,
      customerName: c.name,
      customerPhone: c.phone,
      date: new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000 - rand(0, 8) * 60 * 60 * 1000
      ).toISOString(),
      items,
      subtotal,
      discount,
      gstAmount: Math.round(gstAmount),
      total,
      paymentMode: paymentModes[i % paymentModes.length],
      staff: staff[i % staff.length],
    });
  }
  return list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const INVOICES: Invoice[] = buildInvoices();

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "bill",
    title: `Invoice ${INVOICES[0].number} generated`,
    meta: `${INVOICES[0].customerName} • ₹${INVOICES[0].total.toLocaleString("en-IN")}`,
    time: "12 min ago",
  },
  {
    id: "a2",
    type: "stock",
    title: "Added Banarasi Tissue Saree to inventory",
    meta: "12 units • SKU SAR-0002",
    time: "38 min ago",
  },
  {
    id: "a3",
    type: "barcode",
    title: "Printed 24 barcode labels",
    meta: "Batch • Kurti collection",
    time: "1 hour ago",
  },
  {
    id: "a4",
    type: "bill",
    title: `Invoice ${INVOICES[1].number} generated`,
    meta: `${INVOICES[1].customerName} • ₹${INVOICES[1].total.toLocaleString("en-IN")}`,
    time: "2 hours ago",
  },
  {
    id: "a5",
    type: "stock",
    title: "Low stock alert: Designer Blouse - Gold",
    meta: "Only 2 left",
    time: "3 hours ago",
  },
  {
    id: "a6",
    type: "barcode",
    title: "Generated barcodes for new collection",
    meta: "Saree batch #18 • 36 items",
    time: "Yesterday",
  },
];

// Sales trend (last 14 days)
export const SALES_TREND = Array.from({ length: 14 }).map((_, idx) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - idx));
  const label = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  const base = 18000 + Math.sin(idx / 2) * 8000 + (idx > 9 ? 6000 : 0);
  const sales = Math.max(6000, Math.round(base + (Math.random() - 0.5) * 6000));
  return { day: label, sales };
});

export const CATEGORY_BREAKDOWN = CATEGORIES.map((c) => {
  const items = PRODUCTS.filter((p) => p.category === c);
  const value = items.reduce((s, p) => s + p.quantity, 0);
  return { name: c, value };
});

// Monthly GST mock for last 6 months
export const GST_MONTHS = (() => {
  const months: {
    label: string;
    sales: number;
    purchases: number;
    outputGst: number;
    inputGst: number;
    payable: number;
  }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    const sales = 280000 + Math.round(Math.random() * 240000);
    const purchases = Math.round(sales * (0.55 + Math.random() * 0.15));
    const outputGst = Math.round(sales * 0.05);
    const inputGst = Math.round(purchases * 0.05);
    months.push({
      label,
      sales,
      purchases,
      outputGst,
      inputGst,
      payable: Math.max(0, outputGst - inputGst),
    });
  }
  return months;
})();
