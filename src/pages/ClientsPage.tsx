import { useState } from 'react';
import { Search, ChevronRight, Phone, Instagram, Plus, Edit3, X, ShoppingBag, Trash2 } from 'lucide-react';
import { useClients, useItems, useTrips, useAddClient, useAddItem, useUpdateClient, useDeleteClient } from '@/hooks/useData';
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

function QuickPurchaseSheet({ client, onClose }: { client: Client; onClose: () => void }) {
  const { data: trips = [] } = useTrips();
  const addItem = useAddItem();
  const activeTrips = trips.filter(t => t.status !== 'completed');

  const [step, setStep] = useState<'trip' | 'details'>('trip');
  const [tripId, setTripId] = useState<string | null>(null);
  const [tripChosen, setTripChosen] = useState(false);
  const [brand, setBrand] = useState('');
  const [cost, setCost] = useState('');
  const [selling, setSelling] = useState('');
  const [description, setDescription] = useState('');
  const [store, setStore] = useState('');

  const handleSave = async () => {
    if (!tripChosen) return;
    try {
      await addItem.mutateAsync({
        trip_id: tripId,
        client_id: client.id,
        brand: brand || undefined,
        description: description || undefined,
        cost_price: cost ? parseFloat(cost) : 0,
        selling_price: selling ? parseFloat(selling) : 0,
        store: store || undefined,
      });
      toast.success(`Achat ajouté pour ${client.name}`);
      onClose();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-2xl lg:rounded-2xl w-full lg:w-[440px] max-h-[80vh] overflow-y-auto border border-border shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-display text-lg font-semibold">Achat rapide</h3>
            <p className="text-xs text-muted-foreground">pour {client.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5">
          {step === 'trip' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Lier à un voyage ? (optionnel)</p>
              <button onClick={() => { setTripId(null); setTripChosen(true); setStep('details'); }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/30 text-left transition-colors">
                <div>
                  <p className="text-sm font-medium">Sans voyage</p>
                  <p className="text-xs text-muted-foreground">Achat libre, hors voyage</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              {activeTrips.map(trip => (
                <button key={trip.id} onClick={() => { setTripId(trip.id); setTripChosen(true); setStep('details'); }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/30 text-left transition-colors">
                  <div>
                    <p className="text-sm font-medium">{trip.name}</p>
                    <p className="text-xs text-muted-foreground">{trip.city}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-1">Remplissez le minimum — vous ajusterez après ✨</p>
              <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Marque (ex: Dior, Zara...)" className="w-full px-3 py-3 border border-border rounded-xl bg-background text-sm outline-none focus:border-primary" autoFocus />
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description rapide" className="w-full px-3 py-3 border border-border rounded-xl bg-background text-sm outline-none focus:border-primary" />
              <input value={store} onChange={e => setStore(e.target.value)} placeholder="Boutique" className="w-full px-3 py-3 border border-border rounded-xl bg-background text-sm outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Coût d'achat</label>
                  <input value={cost} onChange={e => setCost(e.target.value)} placeholder="0" type="number" className="w-full px-3 py-3 border border-border rounded-xl bg-background text-sm outline-none focus:border-primary text-center text-lg font-semibold" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Prix de vente</label>
                  <input value={selling} onChange={e => setSelling(e.target.value)} placeholder="0" type="number" className="w-full px-3 py-3 border border-border rounded-xl bg-background text-sm outline-none focus:border-primary text-center text-lg font-semibold" />
                </div>
              </div>
              {cost && selling && parseFloat(selling) > parseFloat(cost) && (
                <p className="text-xs text-success text-center">Marge : {formatCurrency(parseFloat(selling) - parseFloat(cost))}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('trip')} className="flex-1 py-3 rounded-xl border border-border text-sm text-muted-foreground">Retour</button>
                <button onClick={handleSave} disabled={addItem.isPending} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                  {addItem.isPending ? '...' : 'Enregistrer ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClientDetail({ client, onBack }: { client: Client; onBack: () => void }) {
  const { data: allItems = [] } = useItems();
  const clientItems = allItems.filter(i => i.client_id === client.id);
  const [showPurchase, setShowPurchase] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [editName, setEditName] = useState(client.name);
  const [editCity, setEditCity] = useState(client.city || '');
  const [editWhatsapp, setEditWhatsapp] = useState(client.whatsapp || '');
  const [editInstagram, setEditInstagram] = useState(client.instagram || '');
  const [editTier, setEditTier] = useState(client.tier);
  const [editNotes, setEditNotes] = useState(client.notes || '');
  const [editSizes, setEditSizes] = useState(client.sizes || '');
  const [editBudget, setEditBudget] = useState(client.budget_band || '');

  const handleSaveClient = async () => {
    try {
      await updateClient.mutateAsync({
        id: client.id,
        name: editName,
        city: editCity || null,
        whatsapp: editWhatsapp || null,
        instagram: editInstagram || null,
        tier: editTier,
        notes: editNotes || null,
        sizes: editSizes || null,
        budget_band: editBudget || null,
      });
      toast.success('Cliente mise à jour');
      setEditing(false);
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">← Toutes les clientes</button>

      {editing ? (
        <div className="space-y-3 mb-6 p-5 rounded-xl border-2 border-primary/20 bg-primary/5">
          <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full font-display text-2xl font-semibold bg-transparent outline-none border-b border-border pb-1" />
          <div className="grid grid-cols-2 gap-3">
            <input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Ville" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none" />
            <select value={editTier} onChange={e => setEditTier(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none">
              <option value="vip">VIP</option>
              <option value="active">Active</option>
              <option value="occasional">Occasionnelle</option>
              <option value="friend">Amie</option>
              <option value="family">Famille</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={editWhatsapp} onChange={e => setEditWhatsapp(e.target.value)} placeholder="WhatsApp" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none" />
            <input value={editInstagram} onChange={e => setEditInstagram(e.target.value)} placeholder="Instagram" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={editSizes} onChange={e => setEditSizes(e.target.value)} placeholder="Tailles (ex: S, 38)" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none" />
            <input value={editBudget} onChange={e => setEditBudget(e.target.value)} placeholder="Budget" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none" />
          </div>
          <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notes..." rows={2} className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground">Annuler</button>
            <button onClick={handleSaveClient} disabled={updateClient.isPending} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              {updateClient.isPending ? '...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-rose-light flex items-center justify-center font-display text-2xl font-semibold text-primary">{initials(client.name)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold">{client.name}</h1>
              <TierBadge tier={client.tier} />
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg border border-destructive/30 text-destructive/60 hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
              {client.city && <span>{client.city}{client.country ? `, ${client.country}` : ''}</span>}
              {client.whatsapp && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.whatsapp}</span>}
              {client.instagram && <span className="flex items-center gap-1"><Instagram className="w-3 h-3" />{client.instagram}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Quick Purchase FAB */}
      <button onClick={() => setShowPurchase(true)} className="w-full flex items-center justify-center gap-2 p-3.5 mb-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
        <ShoppingBag className="w-4 h-4" /> Ajouter un achat pour {client.name.split(' ')[0]}
      </button>

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
          <h2 className="font-display text-lg font-semibold mb-4">Historique d'achats ({clientItems.length})</h2>
          <div className="space-y-3">
            {clientItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun achat — utilisez le bouton ci-dessus pour en ajouter</p>
            ) : clientItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{[item.brand, item.category].filter(Boolean).join(' · ') || 'Sans marque'}</p>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">{[item.store, formatDate(item.created_at)].filter(Boolean).join(' · ')}</p>
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

      {showPurchase && <QuickPurchaseSheet client={client} onClose={() => setShowPurchase(false)} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-card rounded-2xl p-6 w-[90%] max-w-sm border border-border shadow-xl text-center">
            <Trash2 className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h3 className="font-display text-lg font-semibold mb-1">Supprimer {client.name} ?</h3>
            <p className="text-sm text-muted-foreground mb-5">Cette action est irréversible. Tous les achats liés resteront dans le système.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground">Annuler</button>
              <button
                onClick={async () => {
                  try {
                    await deleteClient.mutateAsync(client.id);
                    toast.success(`${client.name} supprimée`);
                    onBack();
                  } catch (err: any) { toast.error(err.message); }
                }}
                disabled={deleteClient.isPending}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-50"
              >
                {deleteClient.isPending ? '...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
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
    } catch (err: any) { toast.error(err.message); }
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
