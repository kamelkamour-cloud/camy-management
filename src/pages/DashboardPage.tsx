import { TrendingUp, Users, CreditCard, Package, Calendar, ArrowUpRight, Clock } from 'lucide-react';
import { useClients, useTrips, useItems, useFollowUps, useKeyDates } from '@/hooks/useData';
import { formatCurrency, formatDate, tierLabel, initials, statusLabel } from '@/lib/helpers';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: clients = [] } = useClients();
  const { data: trips = [] } = useTrips();
  const { data: items = [] } = useItems();
  const { data: followUps = [] } = useFollowUps();
  const { data: keyDates = [] } = useKeyDates();

  const totalOutstanding = clients.reduce((sum, c) => sum + Number(c.outstanding), 0);
  const totalCollected = clients.reduce((sum, c) => sum + Number(c.total_paid), 0);
  const activeClients = clients.filter(c => c.tier !== 'inactive').length;
  const avgOrderSize = items.length > 0 ? Math.round(items.reduce((s, i) => s + Number(i.selling_price), 0) / items.length) : 0;
  const pendingFollowUps = followUps.filter(f => !f.completed);
  const incompleteTrips = trips.filter(p => p.status !== 'completed');
  const upcomingDates = keyDates.filter(d => new Date(d.date) >= new Date()).slice(0, 5);
  const clientsWithOutstanding = clients.filter(c => Number(c.outstanding) > 0).sort((a, b) => Number(b.outstanding) - Number(a.outstanding));

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">Bonjour</h1>
        <p className="text-muted-foreground text-sm mt-1">Voici un aperçu de votre activité</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><CreditCard className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Impayés</span></div>
          <p className="font-display text-2xl font-semibold text-destructive">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><TrendingUp className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Encaissé</span></div>
          <p className="font-display text-2xl font-semibold text-success">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Users className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Clientes actives</span></div>
          <p className="font-display text-2xl font-semibold">{activeClients}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Package className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Panier moyen</span></div>
          <p className="font-display text-2xl font-semibold">{formatCurrency(avgOrderSize)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Outstanding Balances */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Soldes impayés</h2>
              <Link to="/payments" className="text-xs text-primary hover:underline flex items-center gap-1">Voir tout <ArrowUpRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-3">
              {clientsWithOutstanding.length === 0 && <p className="text-sm text-muted-foreground">Aucun impayé 🎉</p>}
              {clientsWithOutstanding.map(client => (
                <Link key={client.id} to="/clients" className="flex items-center justify-between py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">{initials(client.name)}</div>
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{tierLabel(client.tier)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-destructive">{formatCurrency(Number(client.outstanding))}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Incomplete Trips */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Voyages en cours</h2>
              <Link to="/trips" className="text-xs text-primary hover:underline flex items-center gap-1">Voir tout <ArrowUpRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-3">
              {incompleteTrips.length === 0 && <p className="text-sm text-muted-foreground">Aucun voyage en cours</p>}
              {incompleteTrips.map(trip => (
                <Link key={trip.id} to="/trips" className="block p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{trip.name}</p>
                      <p className="text-xs text-muted-foreground">{trip.city}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium capitalize">{statusLabel(trip.status)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Follow-ups */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display text-lg font-semibold mb-4">Relances à faire</h2>
            <div className="space-y-3">
              {pendingFollowUps.length === 0 && <p className="text-sm text-muted-foreground">Aucune relance en attente</p>}
              {pendingFollowUps.map(f => {
                const client = clients.find(c => c.id === f.client_id);
                return (
                  <div key={f.id} className="flex items-start gap-3 py-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm">{f.note}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{client?.name} · {formatDate(f.due_date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Upcoming Dates */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Dates clés</h2>
              <Link to="/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">Voir tout <ArrowUpRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-3">
              {upcomingDates.length === 0 && <p className="text-sm text-muted-foreground">Aucune date à venir</p>}
              {upcomingDates.map(d => {
                const client = d.client_id ? clients.find(c => c.id === d.client_id) : null;
                return (
                  <div key={d.id} className="flex items-start gap-3 py-2">
                    <Calendar className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(d.date)}{client ? ` · ${client.name}` : ''}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top clients */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display text-lg font-semibold mb-4">Meilleures clientes</h2>
            <div className="space-y-3">
              {[...clients].sort((a, b) => Number(b.total_spend) - Number(a.total_spend)).slice(0, 4).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <p className="text-sm">{c.name}</p>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(Number(c.total_spend))}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
