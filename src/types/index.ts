export type UserRole = "admin" | "staff";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  color: string;
  size: string;
  material: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  gst: number;
  image: string;
  addedOn: string;
  lowStockThreshold: number;
}

export interface CartLine {
  productId: string;
  name: string;
  sku: string;
  price: number;
  gst: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: CartLine[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMode: "Cash" | "UPI" | "Card";
  staff: string;
}

export interface ActivityItem {
  id: string;
  type: "bill" | "stock" | "barcode";
  title: string;
  meta: string;
  time: string;
}
