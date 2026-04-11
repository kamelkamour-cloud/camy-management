import { useState } from 'react';
import { Search, ChevronRight, Phone, Instagram } from 'lucide-react';
import { useClients, useItems, useAddClient } from '@/hooks/useData';
import { formatCurrency, formatDate, tierLabel, initials } from '@/lib/helpers';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Client = Tables<'clients'>;

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
  const { data: allItems = [] } = useItems();
  const clientItems = allItems.filter(i => i.client_id === client.id);

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">← Toutes les clientes</button>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-rose-light flex items-center justify-center font-display text-2xl font-semibold text-primary">{initials(client.name)}</div>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total dépensé</p><p className="font-display text-xl font-semibold mt-1">{formatCurrency(Number(client.total_spend))}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Payé</p><p className="font-display text-xl font-semibold mt-1 text-success">{formatCurrency(Number(client.total_paid))}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Impayé</p><p className="font-display text-xl font-semibold mt-1 text-destructive">{formatCurrency(Number(client.outstanding))}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Dernier achat</p><p className="font-display text-lg font-semibold mt-1">{client.last_purchase ? formatDate(client.last_purchase) : '—'}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Profil de style</h2>
          <div className="space-y-3 text-sm">
            {(client.preferred_brands?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Marques préférées</p>
                <div className="flex flex-wrap gap-1.5">{client.preferred_brands!.map(b => <span key={b} className="px-2.5 py-1 bg-secondary rounded-full text-xs">{b}</span>)}</div>
              </div>
            )}
            {(client.preferred_categories?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Catégories</p>
                <div className="flex flex-wrap gap-1.5">{client.preferred_categories!.map(c => <span key={c} className="px-2.5 py-1 bg-secondary rounded-full text-xs">{c}</span>)}</div>
              </div>
            )}
            {client.sizes && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tailles</p><p>{client.sizes}</p></div>}
            {client.color_preferences && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Couleurs</p><p>{client.color_preferences}</p></div>}
            {client.style_notes && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes de style</p><p className="text-muted-foreground">{client.style_notes}</p></div>}
            {client.budget_band && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budget</p><p>{client.budget_band}</p></div>}
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Notes</h2>
          <p className="text-sm text-muted-foreground">{client.notes || 'Aucune note'}</p>
        </section>

        <section className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold mb-4">Historique d'achats</h2>
          <div className="space-y-3">
            {clientItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun achat</p>
            ) : clientItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{item.brand} · {item.category}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.store} · {formatDate(item.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(Number(item.selling_price))}</p>
                  <p className={`text-xs ${item.payment_status === 'paid' ? 'text-success' : 'text-destructive'}`}>
                    {item.payment_status === 'paid' ? 'Payé' : item.payment_status === 'partially_paid' ? 'Partiellement payé' : 'Impayé'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AddClientForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tier, setTier] = useState('active');
  const addClient = useAddClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addClient.mutateAsync({ name, city, whatsapp: whatsapp || undefined, tier, country: 'Morocco' });
      toast.success('Cliente ajoutée');
      onDone();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onDone} className="text-sm text-primary hover:underline mb-4">← Retour</button>
      <h2 className="font-display text-2xl font-semibold mb-6">Nouvelle cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="Nom complet *" className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ville" className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp" className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <select value={tier} onChange={e => setTier(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none">
          <option value="vip">VIP</option>
          <option value="active">Active</option>
          <option value="occasional">Occasionnelle</option>
          <option value="friend">Amie</option>
          <option value="family">Famille</option>
        </select>
        <button type="submit" disabled={addClient.isPending} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {addClient.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const selected = selectedId ? clients.find(c => c.id === selectedId) : null;

  if (showAdd) return <div className="p-4 lg:p-8 max-w-5xl mx-auto"><AddClientForm onDone={() => setShowAdd(false)} /></div>;
  if (selected) return <div className="p-4 lg:p-8 max-w-5xl mx-auto"><ClientDetail client={selected} onBack={() => setSelectedId(null)} /></div>;

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.preferred_brands || []).some(b => b.toLowerCase().includes(search.toLowerCase()));
    const matchTier = !filterTier || c.tier === filterTier;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} relations</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Ajouter une cliente</button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-card">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, marque..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm text-muted-foreground outline-none">
          <option value="">Tous les niveaux</option>
          <option value="vip">VIP</option>
          <option value="active">Active</option>
          <option value="occasional">Occasionnelle</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">Aucune cliente trouvée</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-primary hover:underline">Ajouter votre première cliente</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(client => (
            <button key={client.id} onClick={() => setSelectedId(client.id)} className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-rose-light flex items-center justify-center font-medium text-sm text-primary">{initials(client.name)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{client.name}</p>
                    <TierBadge tier={client.tier} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {client.city}{(client.preferred_brands?.length ?? 0) > 0 ? ` · ${client.preferred_brands!.slice(0, 2).join(', ')}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{formatCurrency(Number(client.total_spend))}</p>
                  {Number(client.outstanding) > 0 && <p className="text-xs text-destructive">{formatCurrency(Number(client.outstanding))} dû</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
