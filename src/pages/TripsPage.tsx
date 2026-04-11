import { useState } from 'react';
import { MapPin, Calendar, ChevronRight, Package, Tag, Plus, Edit3, Trash2, Save, X, Check } from 'lucide-react';
import { useTrips, useItems, useClients, useTripClients, useAddTrip, useAddItem, useUpdateTrip, useUpdateItem, useDeleteItem, useAddTripClient } from '@/hooks/useData';
import { formatCurrency, formatDate, initials } from '@/lib/helpers';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Trip = Tables<'trips'>;

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { open: 'Ouvert', in_progress: 'En cours', partially_assigned: 'Partiellement assigné', completed: 'Terminé' };
  const styles: Record<string, string> = { open: 'bg-primary/10 text-primary', in_progress: 'bg-warning/10 text-warning', partially_assigned: 'bg-accent/20 text-accent-foreground', completed: 'bg-success/10 text-success' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] || 'bg-muted text-muted-foreground'}`}>{labels[status] || status}</span>;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { paid: 'Payé', partially_paid: 'Partiellement payé', unpaid: 'Impayé' };
  const styles: Record<string, string> = { paid: 'bg-success/10 text-success', partially_paid: 'bg-warning/10 text-warning', unpaid: 'bg-destructive/10 text-destructive' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] || 'bg-muted text-muted-foreground'}`}>{labels[status] || status}</span>;
}

function QuickItemAdd({ tripId, onDone }: { tripId: string; onDone: () => void }) {
  const { data: clients = [] } = useClients();
  const addItem = useAddItem();
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [selling, setSelling] = useState('');
  const [store, setStore] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    try {
      await addItem.mutateAsync({
        trip_id: tripId,
        brand: brand || undefined,
        category: category || undefined,
        description: description || undefined,
        cost_price: cost ? parseFloat(cost) : 0,
        selling_price: selling ? parseFloat(selling) : 0,
        store: store || undefined,
        client_id: clientId || undefined,
      });
      toast.success('Article ajouté');
      onDone();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Nouvel article</p>
        <button onClick={onDone} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Marque" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Catégorie" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
      </div>
      <input value={store} onChange={e => setStore(e.target.value)} placeholder="Boutique" className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optionnel)" className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
      <div className="grid grid-cols-2 gap-2">
        <input value={cost} onChange={e => setCost(e.target.value)} placeholder="Coût (€)" type="number" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <input value={selling} onChange={e => setSelling(e.target.value)} placeholder="Prix vente (€)" type="number" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
      </div>
      <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none text-muted-foreground">
        <option value="">Assigner à une cliente (optionnel)</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button onClick={handleSave} disabled={addItem.isPending} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
        {addItem.isPending ? 'Enregistrement...' : 'Ajouter'}
      </button>
    </div>
  );
}

function EditItemInline({ item, clients, onDone }: { item: Tables<'items'>; clients: Tables<'clients'>[]; onDone: () => void }) {
  const updateItem = useUpdateItem();
  const [brand, setBrand] = useState(item.brand || '');
  const [category, setCategory] = useState(item.category || '');
  const [cost, setCost] = useState(String(item.cost_price));
  const [selling, setSelling] = useState(String(item.selling_price));
  const [store, setStore] = useState(item.store || '');
  const [clientId, setClientId] = useState(item.client_id || '');
  const [description, setDescription] = useState(item.description || '');
  const [paymentStatus, setPaymentStatus] = useState(item.payment_status);

  const handleSave = async () => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        brand, category, description, store,
        cost_price: parseFloat(cost) || 0,
        selling_price: parseFloat(selling) || 0,
        client_id: clientId || null,
        payment_status: paymentStatus,
      });
      toast.success('Article mis à jour');
      onDone();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="p-4 rounded-xl border-2 border-primary/20 bg-card space-y-3 animate-fade-in">
      <div className="grid grid-cols-2 gap-2">
        <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Marque" className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary" />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Catégorie" className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary" />
      </div>
      <input value={store} onChange={e => setStore(e.target.value)} placeholder="Boutique" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary" />
      <div className="grid grid-cols-2 gap-2">
        <input value={cost} onChange={e => setCost(e.target.value)} placeholder="Coût" type="number" className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary" />
        <input value={selling} onChange={e => setSelling(e.target.value)} placeholder="Prix vente" type="number" className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select value={clientId} onChange={e => setClientId(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none text-muted-foreground">
          <option value="">Non assigné</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none text-muted-foreground">
          <option value="unpaid">Impayé</option>
          <option value="partially_paid">Partiellement payé</option>
          <option value="paid">Payé</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={onDone} className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted/50">Annuler</button>
        <button onClick={handleSave} disabled={updateItem.isPending} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {updateItem.isPending ? '...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

function TripDetail({ trip, onBack }: { trip: Trip; onBack: () => void }) {
  const [tab, setTab] = useState<'overview' | 'items' | 'clients' | 'payments' | 'docs'>('overview');
  const { data: items = [] } = useItems(trip.id);
  const { data: allClients = [] } = useClients();
  const { data: tripClients = [] } = useTripClients(trip.id);
  const linkedClients = allClients.filter(c => tripClients.some(tc => tc.client_id === c.id));
  const unpaidItems = items.filter(i => i.payment_status !== 'paid');
  const unassigned = items.filter(i => !i.client_id);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(trip.name);
  const [editCity, setEditCity] = useState(trip.city || '');
  const [editNotes, setEditNotes] = useState(trip.notes || '');
  const [editStatus, setEditStatus] = useState(trip.status);
  const [editDateStart, setEditDateStart] = useState(trip.date_start || '');
  const [editDateEnd, setEditDateEnd] = useState(trip.date_end || '');

  const updateTrip = useUpdateTrip();
  const deleteItem = useDeleteItem();
  const addTripClient = useAddTripClient();

  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showLinkClient, setShowLinkClient] = useState(false);

  const handleSaveTrip = async () => {
    try {
      await updateTrip.mutateAsync({
        id: trip.id,
        name: editName,
        city: editCity || null,
        notes: editNotes || null,
        status: editStatus,
        date_start: editDateStart || null,
        date_end: editDateEnd || null,
      });
      toast.success('Voyage mis à jour');
      setEditing(false);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success('Article supprimé');
    } catch (err: any) { toast.error(err.message); }
  };

  const handleLinkClient = async (clientId: string) => {
    try {
      await addTripClient.mutateAsync({ trip_id: trip.id, client_id: clientId });
      toast.success('Cliente liée');
      setShowLinkClient(false);
    } catch (err: any) { toast.error(err.message); }
  };

  const tabLabels: Record<string, string> = { overview: 'Aperçu', items: `Articles (${items.length})`, clients: 'Clientes', payments: 'Paiements', docs: 'Documents' };
  const tabs = ['overview', 'items', 'clients', 'payments', 'docs'] as const;

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">← Tous les voyages</button>

      {editing ? (
        <div className="space-y-3 mb-6 p-5 rounded-xl border-2 border-primary/20 bg-primary/5">
          <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full font-display text-2xl font-semibold bg-transparent outline-none border-b border-border pb-1 focus:border-primary" />
          <div className="grid grid-cols-2 gap-3">
            <input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Ville" className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
            <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none">
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="partially_assigned">Partiellement assigné</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={editDateStart} onChange={e => setEditDateStart(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
            <input type="date" value={editDateEnd} onChange={e => setEditDateEnd(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
          </div>
          <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notes..." rows={2} className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm outline-none resize-none focus:border-primary" />
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground">Annuler</button>
            <button onClick={handleSaveTrip} disabled={updateTrip.isPending} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              {updateTrip.isPending ? '...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-semibold">{trip.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              {trip.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{trip.city}</span>}
              {trip.date_start && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(trip.date_start)}{trip.date_end ? ` – ${formatDate(trip.date_end)}` : ''}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={trip.status} />
            <button onClick={() => setEditing(true)} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Coût total</p><p className="font-display text-xl font-semibold mt-1">{formatCurrency(Number(trip.total_cost))}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Ventes prévues</p><p className="font-display text-xl font-semibold mt-1">{formatCurrency(Number(trip.total_selling))}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Encaissé</p><p className="font-display text-xl font-semibold mt-1 text-success">{formatCurrency(Number(trip.total_collected))}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Restant dû</p><p className="font-display text-xl font-semibold mt-1 text-destructive">{formatCurrency(Number(trip.total_selling) - Number(trip.total_collected))}</p></div>
      </div>

      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{tabLabels[t]}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          {trip.notes && <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">{trip.notes}</p>}
          {(trip.stores?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Boutiques visitées</h3>
              <div className="flex flex-wrap gap-2">{trip.stores!.map(s => <span key={s} className="text-xs bg-secondary px-3 py-1.5 rounded-full">{s}</span>)}</div>
            </div>
          )}
          {unassigned.length > 0 && <div className="p-4 rounded-lg border border-warning/30 bg-warning/5"><p className="text-sm font-medium text-warning">{unassigned.length} article{unassigned.length > 1 ? 's' : ''} non assigné{unassigned.length > 1 ? 's' : ''}</p></div>}
          {unpaidItems.length > 0 && <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5"><p className="text-sm font-medium text-destructive">{unpaidItems.length} article{unpaidItems.length > 1 ? 's' : ''} avec paiement en attente</p></div>}
        </div>
      )}

      {tab === 'items' && (
        <div className="space-y-3">
          <button onClick={() => setShowAddItem(true)} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
            <Plus className="w-4 h-4" /> Ajouter un article
          </button>
          {showAddItem && <QuickItemAdd tripId={trip.id} onDone={() => setShowAddItem(false)} />}
          {items.length === 0 && !showAddItem && <p className="text-sm text-muted-foreground text-center py-4">Aucun article dans ce voyage</p>}
          {items.map(item => {
            if (editingItemId === item.id) return <EditItemInline key={item.id} item={item} clients={allClients} onDone={() => setEditingItemId(null)} />;
            const client = item.client_id ? allClients.find(c => c.id === item.client_id) : null;
            return (
              <div key={item.id} className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{[item.brand, item.category].filter(Boolean).join(' · ') || 'Sans marque'}</p>
                    {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                    {item.store && <p className="text-xs text-muted-foreground mt-1">{item.store}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingItemId(item.id)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    {client ? <span className="text-xs bg-secondary px-2 py-1 rounded-full">{client.name}</span> : <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">Non assigné</span>}
                    {item.is_requested && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Sur demande</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatCurrency(Number(item.selling_price))}</span>
                    <PaymentStatusBadge status={item.payment_status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'clients' && (
        <div className="space-y-3">
          {!showLinkClient && (
            <button onClick={() => setShowLinkClient(true)} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
              <Plus className="w-4 h-4" /> Lier une cliente
            </button>
          )}
          {showLinkClient && (
            <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Sélectionnez une cliente</p>
                <button onClick={() => setShowLinkClient(false)} className="p-1 text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              {allClients.filter(c => !tripClients.some(tc => tc.client_id === c.id)).map(c => (
                <button key={c.id} onClick={() => handleLinkClient(c.id)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 text-left">
                  <div className="w-8 h-8 rounded-full bg-rose-light flex items-center justify-center text-xs font-medium text-primary">{initials(c.name)}</div>
                  <span className="text-sm">{c.name}</span>
                </button>
              ))}
            </div>
          )}
          {linkedClients.length === 0 && !showLinkClient && <p className="text-sm text-muted-foreground text-center py-4">Aucune cliente liée</p>}
          {linkedClients.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">{initials(c.name)}</div>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{items.filter(i => i.client_id === c.id).length} articles</p>
                </div>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(items.filter(i => i.client_id === c.id).reduce((s, i) => s + Number(i.selling_price), 0))}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-3">
          {items.map(item => {
            const client = item.client_id ? allClients.find(c => c.id === item.client_id) : null;
            const remaining = Number(item.selling_price) - Number(item.amount_paid);
            return (
              <div key={item.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.brand} – {(item.description || '').slice(0, 40)}</p>
                    <p className="text-xs text-muted-foreground">{client?.name || 'Non assigné'}</p>
                  </div>
                  <PaymentStatusBadge status={item.payment_status} />
                </div>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Total : {formatCurrency(Number(item.selling_price))}</span>
                  <span className="text-success">Payé : {formatCurrency(Number(item.amount_paid))}</span>
                  {remaining > 0 && <span className="text-destructive">Dû : {formatCurrency(remaining)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'docs' && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Package className="w-8 h-8 mb-3" />
          <p className="text-sm">Aucun document téléchargé</p>
          <button className="mt-3 text-sm text-primary hover:underline">Télécharger un document</button>
        </div>
      )}
    </div>
  );
}

function AddTripForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Paris');
  const [dateStart, setDateStart] = useState('');
  const addTrip = useAddTrip();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTrip.mutateAsync({ name, city, date_start: dateStart || undefined });
      toast.success('Voyage créé');
      onDone();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onDone} className="text-sm text-primary hover:underline mb-4">← Retour</button>
      <h2 className="font-display text-2xl font-semibold mb-6">Nouveau voyage</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="Nom du voyage *" className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ville" className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-sm outline-none focus:border-primary" />
        <button type="submit" disabled={addTrip.isPending} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {addTrip.isPending ? 'Création...' : 'Créer le voyage'}
        </button>
      </form>
    </div>
  );
}

export default function TripsPage() {
  const { data: trips = [], isLoading } = useTrips();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const selectedTrip = selectedId ? trips.find(t => t.id === selectedId) : null;

  if (showAdd) return <div className="p-4 lg:p-8 max-w-5xl mx-auto"><AddTripForm onDone={() => setShowAdd(false)} /></div>;
  if (selectedTrip) return <div className="p-4 lg:p-8 max-w-5xl mx-auto"><TripDetail trip={selectedTrip} onBack={() => setSelectedId(null)} /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Voyages & Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">Vos achats groupés, organisés</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Nouveau voyage</button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">Aucun voyage créé</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-primary hover:underline">Créer votre premier voyage</button>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map(trip => (
            <button key={trip.id} onClick={() => setSelectedId(trip.id)} className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{trip.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    {trip.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.city}</span>}
                    {trip.date_start && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(trip.date_start)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={trip.status} />
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span>Coût : {formatCurrency(Number(trip.total_cost))}</span>
                <span>Ventes : {formatCurrency(Number(trip.total_selling))}</span>
                <span className="text-success">Encaissé : {formatCurrency(Number(trip.total_collected))}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
