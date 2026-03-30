import { useState } from 'react';
import { MapPin, Calendar, ChevronRight, Package, Tag } from 'lucide-react';
import { samplePackages, sampleClients, formatCurrency, formatDate } from '@/lib/sample-data';
import { TripPackage } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-primary/10 text-primary',
    in_progress: 'bg-warning/10 text-warning',
    partially_assigned: 'bg-accent/20 text-accent-foreground',
    completed: 'bg-success/10 text-success',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${styles[status] || 'bg-muted text-muted-foreground'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function PackageDetail({ pkg, onBack }: { pkg: TripPackage; onBack: () => void }) {
  const [tab, setTab] = useState<'overview' | 'items' | 'clients' | 'payments' | 'docs'>('overview');
  const tabs = ['overview', 'items', 'clients', 'payments', 'docs'] as const;
  const linkedClients = sampleClients.filter(c => pkg.linkedClientIds.includes(c.id));
  const unpaidItems = pkg.items.filter(i => i.paymentStatus !== 'paid');
  const unassigned = pkg.items.filter(i => !i.clientId);

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-primary hover:underline mb-4">← All Trips</button>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold">{pkg.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{pkg.city}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(pkg.dateStart)} – {formatDate(pkg.dateEnd)}</span>
          </div>
        </div>
        <StatusBadge status={pkg.status} />
      </div>

      {/* Tags */}
      {pkg.tags.length > 0 && (
        <div className="flex gap-2 mb-6">
          {pkg.tags.map(t => (
            <span key={t} className="flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
              <Tag className="w-3 h-3" />{t}
            </span>
          ))}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Cost</p><p className="font-display text-xl font-semibold mt-1">{formatCurrency(pkg.totalCost)}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Expected Sales</p><p className="font-display text-xl font-semibold mt-1">{formatCurrency(pkg.totalSelling)}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Collected</p><p className="font-display text-xl font-semibold mt-1 text-success">{formatCurrency(pkg.totalCollected)}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding</p><p className="font-display text-xl font-semibold mt-1 text-destructive">{formatCurrency(pkg.totalSelling - pkg.totalCollected)}</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'docs' ? 'Documents' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          {pkg.notes && <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">{pkg.notes}</p>}
          <div>
            <h3 className="text-sm font-medium mb-2">Stores Visited</h3>
            <div className="flex flex-wrap gap-2">
              {pkg.stores.map(s => <span key={s} className="text-xs bg-secondary px-3 py-1.5 rounded-full">{s}</span>)}
            </div>
          </div>
          {unassigned.length > 0 && (
            <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
              <p className="text-sm font-medium text-warning">{unassigned.length} item{unassigned.length > 1 ? 's' : ''} not yet assigned to a client</p>
            </div>
          )}
          {unpaidItems.length > 0 && (
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <p className="text-sm font-medium text-destructive">{unpaidItems.length} item{unpaidItems.length > 1 ? 's' : ''} with outstanding payment</p>
            </div>
          )}
        </div>
      )}

      {tab === 'items' && (
        <div className="space-y-3">
          {pkg.items.map(item => {
            const client = item.clientId ? sampleClients.find(c => c.id === item.clientId) : null;
            return (
              <div key={item.id} className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.brand} · {item.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.store}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(item.sellingPrice)}</p>
                    <p className="text-xs text-muted-foreground">Cost: {formatCurrency(item.costPrice)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    {client ? (
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">{client.name}</span>
                    ) : (
                      <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">Unassigned</span>
                    )}
                    {item.isRequested && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Requested</span>}
                  </div>
                  <StatusBadge status={item.paymentStatus} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'clients' && (
        <div className="space-y-3">
          {linkedClients.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.items.filter(i => i.clientId === c.id).length} items in this trip</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(pkg.items.filter(i => i.clientId === c.id).reduce((s, i) => s + i.sellingPrice, 0))}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-3">
          {pkg.items.map(item => {
            const client = item.clientId ? sampleClients.find(c => c.id === item.clientId) : null;
            const remaining = item.sellingPrice - item.amountPaid;
            return (
              <div key={item.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.brand} – {item.description.slice(0, 40)}</p>
                    <p className="text-xs text-muted-foreground">{client?.name || 'Unassigned'}</p>
                  </div>
                  <StatusBadge status={item.paymentStatus} />
                </div>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Total: {formatCurrency(item.sellingPrice)}</span>
                  <span className="text-success">Paid: {formatCurrency(item.amountPaid)}</span>
                  {remaining > 0 && <span className="text-destructive">Due: {formatCurrency(remaining)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'docs' && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Package className="w-8 h-8 mb-3" />
          <p className="text-sm">No documents uploaded yet</p>
          <button className="mt-3 text-sm text-primary hover:underline">Upload document</button>
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPkg = selectedId ? samplePackages.find(p => p.id === selectedId) : null;

  if (selectedPkg) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <PackageDetail pkg={selectedPkg} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Trips & Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">Your buying runs, organized</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          New Trip
        </button>
      </div>

      <div className="space-y-3">
        {samplePackages.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => setSelectedId(pkg.id)}
            className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">{pkg.name}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.city}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(pkg.dateStart)}</span>
                  <span>{pkg.items.length} items</span>
                  <span>{pkg.linkedClientIds.length} clients</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={pkg.status} />
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span>Cost: {formatCurrency(pkg.totalCost)}</span>
              <span>Sales: {formatCurrency(pkg.totalSelling)}</span>
              <span className="text-success">Collected: {formatCurrency(pkg.totalCollected)}</span>
              {pkg.totalSelling - pkg.totalCollected > 0 && (
                <span className="text-destructive">Due: {formatCurrency(pkg.totalSelling - pkg.totalCollected)}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
