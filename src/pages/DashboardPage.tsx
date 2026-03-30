import { TrendingUp, Users, CreditCard, AlertCircle, Package, Calendar, ArrowUpRight, Clock } from 'lucide-react';
import { sampleClients, samplePackages, samplePaymentPlans, sampleFollowUps, sampleKeyDates, formatCurrency, formatDate, tierLabel } from '@/lib/sample-data';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const totalOutstanding = sampleClients.reduce((sum, c) => sum + c.outstanding, 0);
  const totalCollected = sampleClients.reduce((sum, c) => sum + c.totalPaid, 0);
  const activeClients = sampleClients.filter(c => c.tier !== 'inactive').length;
  const avgOrderSize = Math.round(sampleClients.reduce((s, c) => s + c.totalSpend, 0) / samplePackages.flatMap(p => p.items).length);
  const overdueInstallments = samplePaymentPlans.flatMap(pp => pp.installments).filter(i => i.status === 'overdue');
  const pendingFollowUps = sampleFollowUps.filter(f => !f.completed);
  const incompletePackages = samplePackages.filter(p => p.status !== 'completed');
  const upcomingDates = sampleKeyDates.filter(d => new Date(d.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
  const clientsWithOutstanding = sampleClients.filter(c => c.outstanding > 0).sort((a, b) => b.outstanding - a.outstanding);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">Bonjour</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your business at a glance</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Outstanding</span>
          </div>
          <p className="font-display text-2xl font-semibold text-destructive">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Collected</span>
          </div>
          <p className="font-display text-2xl font-semibold text-success">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Active Clients</span>
          </div>
          <p className="font-display text-2xl font-semibold">{activeClients}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Package className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Avg Order</span>
          </div>
          <p className="font-display text-2xl font-semibold">{formatCurrency(avgOrderSize)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Outstanding Balances */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Outstanding Balances</h2>
              <Link to="/payments" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {clientsWithOutstanding.map(client => (
                <Link key={client.id} to="/clients" className="flex items-center justify-between py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{tierLabel(client.tier)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-destructive">{formatCurrency(client.outstanding)}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Overdue Payments */}
          {overdueInstallments.length > 0 && (
            <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <h2 className="font-display text-lg font-semibold text-destructive">Overdue Payments</h2>
              </div>
              {samplePaymentPlans.filter(pp => pp.installments.some(i => i.status === 'overdue')).map(pp => {
                const client = sampleClients.find(c => c.id === pp.clientId);
                const overdue = pp.installments.filter(i => i.status === 'overdue');
                return overdue.map(inst => (
                  <div key={inst.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{client?.name}</p>
                      <p className="text-xs text-muted-foreground">Due {formatDate(inst.dueDate)}</p>
                    </div>
                    <span className="text-sm font-semibold text-destructive">{formatCurrency(inst.amount)}</span>
                  </div>
                ));
              })}
            </section>
          )}

          {/* Incomplete Packages */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Open Trips</h2>
              <Link to="/trips" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {incompletePackages.map(pkg => {
                const unassigned = pkg.items.filter(i => !i.clientId).length;
                const unpaid = pkg.items.filter(i => i.paymentStatus !== 'paid').length;
                return (
                  <Link key={pkg.id} to="/trips" className="block p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{pkg.name}</p>
                        <p className="text-xs text-muted-foreground">{pkg.city} · {pkg.items.length} items</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium capitalize">{pkg.status.replace('_', ' ')}</span>
                    </div>
                    {(unassigned > 0 || unpaid > 0) && (
                      <div className="flex gap-3 mt-2">
                        {unassigned > 0 && <span className="text-xs text-muted-foreground">{unassigned} unassigned</span>}
                        {unpaid > 0 && <span className="text-xs text-destructive">{unpaid} unpaid</span>}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Follow-ups */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display text-lg font-semibold mb-4">Follow-ups Due</h2>
            <div className="space-y-3">
              {pendingFollowUps.map(f => {
                const client = sampleClients.find(c => c.id === f.clientId);
                return (
                  <div key={f.id} className="flex items-start gap-3 py-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm">{f.note}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{client?.name} · {formatDate(f.dueDate)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Upcoming Dates */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Key Dates</h2>
              <Link to="/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingDates.map(d => {
                const client = d.clientId ? sampleClients.find(c => c.id === d.clientId) : null;
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

          {/* Top clients by spend */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display text-lg font-semibold mb-4">Top Clients</h2>
            <div className="space-y-3">
              {[...sampleClients].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 4).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <p className="text-sm">{c.name}</p>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(c.totalSpend)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
