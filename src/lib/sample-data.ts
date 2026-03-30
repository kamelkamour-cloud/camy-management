import { Client, TripPackage, Payment, PaymentPlan, Document, KeyDate, FollowUp } from './types';

export const sampleClients: Client[] = [
  {
    id: 'c1',
    name: 'Amina El Fassi',
    whatsapp: '+212 6 12 34 56 78',
    instagram: '@amina.elfassi',
    city: 'Casablanca',
    country: 'Morocco',
    tier: 'vip',
    notes: 'Prefers classic Chanel, loves neutral tones. Husband\'s birthday in March.',
    preferredBrands: ['Chanel', 'Dior', 'Hermès'],
    preferredCategories: ['Bags', 'Ready-to-wear', 'Accessories'],
    sizes: 'FR 38, Shoe 39',
    colorPreferences: 'Beige, black, ivory, gold',
    styleNotes: 'Classic elegance, avoids logos, loves timeless pieces',
    budgetBand: '€5,000–€20,000',
    totalSpend: 78500,
    totalPaid: 65000,
    outstanding: 13500,
    lastPurchase: '2024-11-15',
    lastOutreach: '2024-12-01',
    avatar: '',
    createdAt: '2023-01-15',
  },
  {
    id: 'c2',
    name: 'Yasmine Benjelloun',
    whatsapp: '+212 6 98 76 54 32',
    instagram: '@yasmine.b',
    city: 'Rabat',
    country: 'Morocco',
    tier: 'vip',
    notes: 'Very trend-forward. Loves Saint Laurent, Bottega. Always asks about new arrivals.',
    preferredBrands: ['Saint Laurent', 'Bottega Veneta', 'Loewe'],
    preferredCategories: ['Bags', 'Shoes', 'Jewelry'],
    sizes: 'FR 36, Shoe 37',
    colorPreferences: 'Black, burgundy, forest green',
    styleNotes: 'Edgy minimalist, loves architectural shapes',
    budgetBand: '€3,000–€15,000',
    totalSpend: 52000,
    totalPaid: 48000,
    outstanding: 4000,
    lastPurchase: '2024-11-20',
    lastOutreach: '2024-11-25',
    avatar: '',
    createdAt: '2023-03-20',
  },
  {
    id: 'c3',
    name: 'Salma Alaoui',
    whatsapp: '+212 6 55 44 33 22',
    instagram: '@salma.alaoui',
    city: 'Marrakech',
    country: 'Morocco',
    tier: 'active',
    notes: 'Buys for her daughter\'s weddings. Interested in occasion wear and fine jewelry.',
    preferredBrands: ['Dior', 'Valentino', 'Cartier'],
    preferredCategories: ['Evening wear', 'Jewelry', 'Bags'],
    sizes: 'FR 42, Shoe 40',
    colorPreferences: 'Rose, champagne, silver, navy',
    styleNotes: 'Elegant occasion dressing, loves embellishment',
    budgetBand: '€2,000–€10,000',
    totalSpend: 31000,
    totalPaid: 24000,
    outstanding: 7000,
    lastPurchase: '2024-10-05',
    lastOutreach: '2024-10-20',
    avatar: '',
    createdAt: '2023-06-10',
  },
  {
    id: 'c4',
    name: 'Nadia Chraibi',
    whatsapp: '+212 6 77 88 99 00',
    instagram: '@nadia.chr',
    city: 'Tangier',
    country: 'Morocco',
    tier: 'occasional',
    notes: 'New client referred by Amina. Loves Celine and The Row.',
    preferredBrands: ['Celine', 'The Row', 'Brunello Cucinelli'],
    preferredCategories: ['Ready-to-wear', 'Bags'],
    sizes: 'FR 40, Shoe 38',
    colorPreferences: 'Camel, cream, grey, olive',
    styleNotes: 'Quiet luxury, no logos, exceptional fabrics',
    budgetBand: '€2,000–€8,000',
    totalSpend: 8500,
    totalPaid: 8500,
    outstanding: 0,
    lastPurchase: '2024-09-12',
    lastOutreach: '2024-11-01',
    avatar: '',
    createdAt: '2024-05-15',
  },
  {
    id: 'c5',
    name: 'Kenza Idrissi',
    whatsapp: '+212 6 11 22 33 44',
    instagram: '@kenza.idr',
    city: 'Fes',
    country: 'Morocco',
    tier: 'active',
    notes: 'Loves statement bags. Wedding coming up June 2025. Budget flexible for wedding items.',
    preferredBrands: ['Hermès', 'Chanel', 'Van Cleef & Arpels'],
    preferredCategories: ['Bags', 'Jewelry', 'Fragrances'],
    sizes: 'FR 36, Shoe 37',
    colorPreferences: 'Pink, gold, white, powder blue',
    styleNotes: 'Feminine romantic, loves details and craftsmanship',
    budgetBand: '€5,000–€25,000',
    totalSpend: 42000,
    totalPaid: 35000,
    outstanding: 7000,
    lastPurchase: '2024-11-28',
    lastOutreach: '2024-12-02',
    avatar: '',
    createdAt: '2023-09-01',
  },
];

export const samplePackages: TripPackage[] = [
  {
    id: 'p1',
    name: 'Paris November 2024',
    dateStart: '2024-11-10',
    dateEnd: '2024-11-16',
    city: 'Paris',
    stores: ['Chanel Rue Cambon', 'Dior Montaigne', 'Hermès Faubourg', 'Galeries Lafayette'],
    notes: 'Major buying trip. Focused on holiday gifts and Amina\'s special order.',
    status: 'in_progress',
    tags: ['holiday season'],
    linkedClientIds: ['c1', 'c2', 'c5'],
    documents: [],
    totalCost: 28500,
    totalSelling: 38200,
    totalCollected: 21000,
    items: [
      {
        id: 'i1', packageId: 'p1', brand: 'Chanel', category: 'Bag', description: 'Classic Flap Medium, Black Caviar GHW', costPrice: 8200, sellingPrice: 10500, clientId: 'c1', store: 'Chanel Rue Cambon', isRequested: true, paymentStatus: 'partially_paid', amountPaid: 7000, createdAt: '2024-11-11',
      },
      {
        id: 'i2', packageId: 'p1', brand: 'Dior', category: 'Bag', description: 'Lady Dior Medium, Rose des Vents', costPrice: 5200, sellingPrice: 6800, clientId: 'c5', store: 'Dior Montaigne', isRequested: true, paymentStatus: 'partially_paid', amountPaid: 4000, createdAt: '2024-11-12',
      },
      {
        id: 'i3', packageId: 'p1', brand: 'Saint Laurent', category: 'Bag', description: 'Le 5 à 7 Hobo, Black Smooth Leather', costPrice: 1950, sellingPrice: 2600, clientId: 'c2', store: 'Galeries Lafayette', isRequested: false, paymentStatus: 'paid', amountPaid: 2600, createdAt: '2024-11-13',
      },
      {
        id: 'i4', packageId: 'p1', brand: 'Hermès', category: 'Accessories', description: 'Clic H Bracelet, Rose Gold', costPrice: 680, sellingPrice: 900, clientId: 'c1', store: 'Hermès Faubourg', isRequested: false, paymentStatus: 'unpaid', amountPaid: 0, createdAt: '2024-11-14',
      },
      {
        id: 'i5', packageId: 'p1', brand: 'Dior', category: 'Ready-to-wear', description: 'Bar Jacket, Navy Wool', costPrice: 3200, sellingPrice: 4200, clientId: undefined, store: 'Dior Montaigne', isRequested: false, paymentStatus: 'unpaid', amountPaid: 0, createdAt: '2024-11-12',
      },
    ],
    createdAt: '2024-11-01',
  },
  {
    id: 'p2',
    name: 'Paris September 2024 – Fashion Week',
    dateStart: '2024-09-25',
    dateEnd: '2024-10-02',
    city: 'Paris',
    stores: ['Loewe', 'Bottega Veneta', 'Celine Montaigne', 'Le Bon Marché'],
    notes: 'Fashion week sourcing. Focused on SS25 preview pieces and client wish lists.',
    status: 'completed',
    tags: ['fashion week', 'SS25'],
    linkedClientIds: ['c2', 'c3', 'c4'],
    documents: [],
    totalCost: 18200,
    totalSelling: 24500,
    totalCollected: 22500,
    items: [
      {
        id: 'i6', packageId: 'p2', brand: 'Bottega Veneta', category: 'Bag', description: 'Jodie Mini, Parakeet Green', costPrice: 2800, sellingPrice: 3700, clientId: 'c2', store: 'Bottega Veneta', isRequested: true, paymentStatus: 'paid', amountPaid: 3700, createdAt: '2024-09-26',
      },
      {
        id: 'i7', packageId: 'p2', brand: 'Valentino', category: 'Evening wear', description: 'Crepe Couture Gown, Champagne', costPrice: 4800, sellingPrice: 6500, clientId: 'c3', store: 'Le Bon Marché', isRequested: true, paymentStatus: 'partially_paid', amountPaid: 4000, createdAt: '2024-09-28',
      },
      {
        id: 'i8', packageId: 'p2', brand: 'Celine', category: 'Bag', description: 'Triomphe Shoulder, Tan', costPrice: 2900, sellingPrice: 3800, clientId: 'c4', store: 'Celine Montaigne', isRequested: false, paymentStatus: 'paid', amountPaid: 3800, createdAt: '2024-09-27',
      },
      {
        id: 'i9', packageId: 'p2', brand: 'Loewe', category: 'Bag', description: 'Puzzle Edge Small, Sand', costPrice: 2400, sellingPrice: 3200, clientId: 'c2', store: 'Loewe', isRequested: false, paymentStatus: 'paid', amountPaid: 3200, createdAt: '2024-09-26',
      },
    ],
    createdAt: '2024-09-15',
  },
  {
    id: 'p3',
    name: 'Paris July 2024 – Summer Sales',
    dateStart: '2024-07-01',
    dateEnd: '2024-07-05',
    city: 'Paris',
    stores: ['Chanel', 'Dior', 'Printemps'],
    notes: 'Summer sales. Picked up gifts and sale items.',
    status: 'completed',
    tags: ['sale season', 'summer'],
    linkedClientIds: ['c1', 'c3'],
    documents: [],
    totalCost: 9500,
    totalSelling: 13200,
    totalCollected: 13200,
    items: [
      {
        id: 'i10', packageId: 'p3', brand: 'Chanel', category: 'Accessories', description: 'Earrings CC Crystal, Gold', costPrice: 850, sellingPrice: 1200, clientId: 'c1', store: 'Chanel', isRequested: false, paymentStatus: 'paid', amountPaid: 1200, createdAt: '2024-07-02',
      },
      {
        id: 'i11', packageId: 'p3', brand: 'Dior', category: 'Fragrances', description: 'Miss Dior Parfum Set', costPrice: 180, sellingPrice: 280, clientId: 'c3', store: 'Dior', isRequested: true, paymentStatus: 'paid', amountPaid: 280, createdAt: '2024-07-03',
      },
    ],
    createdAt: '2024-06-20',
  },
];

export const samplePayments: Payment[] = [
  { id: 'pay1', clientId: 'c1', itemId: 'i1', packageId: 'p1', amount: 5000, date: '2024-11-11', method: 'Bank transfer', notes: 'First payment for Chanel Flap', createdAt: '2024-11-11' },
  { id: 'pay2', clientId: 'c1', itemId: 'i1', packageId: 'p1', amount: 2000, date: '2024-11-25', method: 'Cash', notes: 'Second installment', createdAt: '2024-11-25' },
  { id: 'pay3', clientId: 'c5', itemId: 'i2', packageId: 'p1', amount: 4000, date: '2024-11-15', method: 'Bank transfer', createdAt: '2024-11-15' },
  { id: 'pay4', clientId: 'c2', itemId: 'i3', packageId: 'p1', amount: 2600, date: '2024-11-14', method: 'Cash', createdAt: '2024-11-14' },
  { id: 'pay5', clientId: 'c2', itemId: 'i6', packageId: 'p2', amount: 3700, date: '2024-10-01', method: 'Bank transfer', createdAt: '2024-10-01' },
  { id: 'pay6', clientId: 'c3', itemId: 'i7', packageId: 'p2', amount: 4000, date: '2024-10-05', method: 'Bank transfer', notes: 'Remaining €2,500 due by end Nov', createdAt: '2024-10-05' },
  { id: 'pay7', clientId: 'c4', itemId: 'i8', packageId: 'p2', amount: 3800, date: '2024-09-28', method: 'Cash', createdAt: '2024-09-28' },
];

export const samplePaymentPlans: PaymentPlan[] = [
  {
    id: 'pp1', clientId: 'c1', itemId: 'i1', packageId: 'p1', totalAmount: 10500, createdAt: '2024-11-11',
    installments: [
      { id: 'inst1', amount: 5000, dueDate: '2024-11-11', paidDate: '2024-11-11', status: 'paid' },
      { id: 'inst2', amount: 2000, dueDate: '2024-11-25', paidDate: '2024-11-25', status: 'paid' },
      { id: 'inst3', amount: 3500, dueDate: '2024-12-15', status: 'pending' },
    ],
  },
  {
    id: 'pp2', clientId: 'c3', itemId: 'i7', packageId: 'p2', totalAmount: 6500, createdAt: '2024-09-28',
    installments: [
      { id: 'inst4', amount: 4000, dueDate: '2024-10-05', paidDate: '2024-10-05', status: 'paid' },
      { id: 'inst5', amount: 2500, dueDate: '2024-11-30', status: 'overdue' },
    ],
  },
];

export const sampleDocuments: Document[] = [
  { id: 'd1', name: 'Chanel Receipt – Classic Flap', type: 'receipt', url: '', clientId: 'c1', packageId: 'p1', brand: 'Chanel', store: 'Chanel Rue Cambon', uploadedAt: '2024-11-11' },
  { id: 'd2', name: 'Dior Receipt – Lady Dior', type: 'receipt', url: '', clientId: 'c5', packageId: 'p1', brand: 'Dior', store: 'Dior Montaigne', uploadedAt: '2024-11-12' },
  { id: 'd3', name: 'Bottega Receipt – Jodie', type: 'receipt', url: '', clientId: 'c2', packageId: 'p2', brand: 'Bottega Veneta', store: 'Bottega Veneta', uploadedAt: '2024-09-26' },
  { id: 'd4', name: 'Amina Payment Proof Nov', type: 'payment_proof', url: '', clientId: 'c1', uploadedAt: '2024-11-25' },
  { id: 'd5', name: 'Valentino Gown Photo', type: 'product_photo', url: '', clientId: 'c3', packageId: 'p2', brand: 'Valentino', uploadedAt: '2024-09-28' },
];

export const sampleKeyDates: KeyDate[] = [
  { id: 'kd1', title: 'Amina\'s Husband Birthday', date: '2025-03-15', type: 'birthday', clientId: 'c1', notes: 'Consider gift suggestions' },
  { id: 'kd2', title: 'Kenza\'s Wedding', date: '2025-06-20', type: 'wedding', clientId: 'c5', notes: 'Major purchase opportunity' },
  { id: 'kd3', title: 'Paris Fashion Week SS26', date: '2025-09-22', type: 'fashion_week', notes: 'Book trip early' },
  { id: 'kd4', title: 'Eid Al-Fitr', date: '2025-03-30', type: 'eid', notes: 'Gift-buying season' },
  { id: 'kd5', title: 'Summer Sales Start', date: '2025-06-25', type: 'sale', notes: 'Paris trip planning' },
  { id: 'kd6', title: 'Salma – Payment Due', date: '2024-12-10', type: 'payment_due', clientId: 'c3', notes: 'Outstanding €2,500 for Valentino gown' },
  { id: 'kd7', title: 'Follow up with Nadia', date: '2024-12-15', type: 'follow_up', clientId: 'c4', notes: 'Check if interested in new Celine arrivals' },
  { id: 'kd8', title: 'Ramadan Start', date: '2025-02-28', type: 'ramadan', notes: 'Modest fashion & gifting season' },
];

export const sampleFollowUps: FollowUp[] = [
  { id: 'f1', clientId: 'c3', note: 'Follow up on remaining €2,500 for Valentino gown', dueDate: '2024-12-10', completed: false, createdAt: '2024-11-01' },
  { id: 'f2', clientId: 'c4', note: 'Share new Celine arrivals photos', dueDate: '2024-12-15', completed: false, createdAt: '2024-11-15' },
  { id: 'f3', clientId: 'c5', note: 'Discuss wedding shopping list for June', dueDate: '2024-12-20', completed: false, createdAt: '2024-12-01' },
  { id: 'f4', clientId: 'c1', note: 'Send holiday gift suggestions', dueDate: '2024-12-05', completed: true, createdAt: '2024-11-28' },
];

// Helper functions
export function getClient(id: string): Client | undefined {
  return sampleClients.find(c => c.id === id);
}

export function getPackage(id: string): TripPackage | undefined {
  return samplePackages.find(p => p.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function tierLabel(tier: string): string {
  const labels: Record<string, string> = {
    vip: 'VIP',
    active: 'Active',
    occasional: 'Occasional',
    inactive: 'Inactive',
    friend: 'Friend',
    family: 'Family',
  };
  return labels[tier] || tier;
}
