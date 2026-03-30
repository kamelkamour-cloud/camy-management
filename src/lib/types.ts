export type ClientTier = 'vip' | 'active' | 'occasional' | 'inactive' | 'friend' | 'family';
export type PackageStatus = 'open' | 'in_progress' | 'partially_assigned' | 'completed';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
export type DocType = 'receipt' | 'invoice' | 'product_photo' | 'screenshot' | 'proof_of_delivery' | 'payment_proof' | 'misc';

export interface Client {
  id: string;
  name: string;
  whatsapp?: string;
  instagram?: string;
  city?: string;
  country?: string;
  tier: ClientTier;
  notes?: string;
  preferredBrands: string[];
  preferredCategories: string[];
  sizes?: string;
  colorPreferences?: string;
  styleNotes?: string;
  budgetBand?: string;
  specialDates?: KeyDate[];
  totalSpend: number;
  totalPaid: number;
  outstanding: number;
  lastPurchase?: string;
  lastOutreach?: string;
  avatar?: string;
  createdAt: string;
}

export interface TripPackage {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  city: string;
  stores: string[];
  notes?: string;
  status: PackageStatus;
  tags: string[];
  items: Item[];
  linkedClientIds: string[];
  documents: Document[];
  carrierNotes?: string;
  totalCost: number;
  totalSelling: number;
  totalCollected: number;
  createdAt: string;
}

export interface Item {
  id: string;
  packageId: string;
  brand: string;
  category: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  clientId?: string;
  store: string;
  isRequested: boolean;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  clientId: string;
  itemId?: string;
  packageId?: string;
  amount: number;
  date: string;
  method?: string;
  notes?: string;
  createdAt: string;
}

export interface PaymentPlan {
  id: string;
  clientId: string;
  itemId?: string;
  packageId?: string;
  totalAmount: number;
  installments: Installment[];
  createdAt: string;
}

export interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Document {
  id: string;
  name: string;
  type: DocType;
  url: string;
  clientId?: string;
  packageId?: string;
  brand?: string;
  store?: string;
  uploadedAt: string;
  thumbnail?: string;
}

export interface KeyDate {
  id: string;
  title: string;
  date: string;
  type: 'birthday' | 'wedding' | 'fashion_week' | 'collection_launch' | 'sale' | 'eid' | 'ramadan' | 'follow_up' | 'payment_due' | 'custom';
  clientId?: string;
  packageId?: string;
  notes?: string;
}

export interface FollowUp {
  id: string;
  clientId: string;
  note: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}
