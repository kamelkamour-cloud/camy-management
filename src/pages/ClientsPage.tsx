import { useState } from 'react';
import { Search, ChevronRight, Phone, Instagram } from 'lucide-react';
import { sampleClients, samplePackages, formatCurrency, formatDate, tierLabel } from '@/lib/sample-data';
import { Client } from '@/lib/types';

function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    vip: 'bg-gold/20 text-gold-foreground',
    active: 'bg-success/10 text-success',
    occasional: 'bg-secondary text-secondary-foreground',
    inactive: 'bg-muted text-muted-foreground',
    friend: 'bg-primary/10 text-primary',
    family: 'bg-rose-light text-primary',
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[tier] || 'bg-muted text-muted-foreground'}`}>{tierLabel(tier)}</span>;
}

function ClientDetail({ client, onBack }: { client: Client; onBack: () => void }) {
  const clientItems = samplePackages.flatMap(p => p.items).filter(i => i.clientId === client.id);
  const clientPackages = samplePackages.filter(p => p.linkedClientIds.includes(client.id));

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">← All Clients</button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-rose-light flex items-center justify-center font-display text-2xl font-semibold text-primary">
          {client.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold">{client.name}</h1>
            <TierBadge tier={client.tier} />
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
            {client.city && <span>{client.city}, {client.country}</span>}
            {client.whatsapp && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.whatsapp}</span>}
            {client.instagram && <span className="flex items-center gap-1"><Instagram className="w-3 h-3" />{client.instagram}</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Spend</p><p className="font-display text-xl font-semibold mt-1">{formatCurrency(client.totalSpend)}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Paid</p><p className="font-display text-xl font-semibold mt-1 text-success">{formatCurrency(client.totalPaid)}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding</p><p className="font-display text-xl font-semibold mt-1 text-destructive">{formatCurrency(client.outstanding)}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Last Purchase</p><p className="font-display text-lg font-semibold mt-1">{client.lastPurchase ? formatDate(client.lastPurchase) : '—'}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Style profile */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Style Profile</h2>
          <div className="space-y-3 text-sm">
            {client.preferredBrands.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Preferred Brands</p>
                <div className="flex flex-wrap gap-1.5">{client.preferredBrands.map(b => <span key={b} className="px-2.5 py-1 bg-secondary rounded-full text-xs">{b}</span>)}</div>
              </div>
            )}
            {client.preferredCategories.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Categories</p>
                <div className="flex flex-wrap gap-1.5">{client.preferredCategories.map(c => <span key={c} className="px-2.5 py-1 bg-secondary rounded-full text-xs">{c}</span>)}</div>
              </div>
            )}
            {client.sizes && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Sizes</p><p>{client.sizes}</p></div>}
            {client.colorPreferences && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Colors</p><p>{client.colorPreferences}</p></div>}
            {client.styleNotes && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Style Notes</p><p className="text-muted-foreground">{client.styleNotes}</p></div>}
            {client.budgetBand && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budget</p><p>{client.budgetBand}</p></div>}
          </div>
        </section>

        {/* Notes */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Notes</h2>
          <p className="text-sm text-muted-foreground">{client.notes || 'No notes yet'}</p>
        </section>

        {/* Purchase history */}
        <section className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold mb-4">Purchase History</h2>
          <div className="space-y-3">
            {clientItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No purchases yet</p>
            ) : clientItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{item.brand} · {item.category}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.store} · {formatDate(item.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(item.sellingPrice)}</p>
                  <p className={`text-xs ${item.paymentStatus === 'paid' ? 'text-success' : 'text-destructive'}`}>{item.paymentStatus.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? sampleClients.find(c => c.id === selectedId) : null;

  if (selected) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <ClientDetail client={selected} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  const filtered = sampleClients.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.preferredBrands.some(b => b.toLowerCase().includes(search.toLowerCase()));
    const matchTier = !filterTier || c.tier === filterTier;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">{sampleClients.length} relationships</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          Add Client
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-card">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, brand..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm text-muted-foreground outline-none">
          <option value="">All tiers</option>
          <option value="vip">VIP</option>
          <option value="active">Active</option>
          <option value="occasional">Occasional</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(client => (
          <button key={client.id} onClick={() => setSelectedId(client.id)} className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-rose-light flex items-center justify-center font-medium text-sm text-primary">
                {client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{client.name}</p>
                  <TierBadge tier={client.tier} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {client.city} · {client.preferredBrands.slice(0, 2).join(', ')}
                  {client.preferredBrands.length > 2 && ` +${client.preferredBrands.length - 2}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{formatCurrency(client.totalSpend)}</p>
                {client.outstanding > 0 && <p className="text-xs text-destructive">{formatCurrency(client.outstanding)} due</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
