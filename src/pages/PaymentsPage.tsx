import { useState } from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { useClients, usePayments } from '@/hooks/useData';
import { formatCurrency, formatDate, initials } from '@/lib/helpers';

export default function PaymentsPage() {
  const { data: clients = [] } = useClients();
  const { data: payments = [] } = usePayments();
  const [tab, setTab] = useState<'overview' | 'history'>('overview');

  const totalOutstanding = clients.reduce((s, c) => s + Number(c.outstanding), 0);
  const totalPaid = clients.reduce((s, c) => s + Number(c.total_paid), 0);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Paiements & Créances</h1>
        <p className="text-sm text-muted-foreground mt-1">Suivez ce qui est dû et ce qui est encaissé</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><CreditCard className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Total impayé</span></div>
          <p className="font-display text-2xl font-semibold text-destructive">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><CheckCircle className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Total encaissé</span></div>
          <p className="font-display text-2xl font-semibold text-success">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border mb-6">
        {(['overview', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'history' ? 'Historique' : 'Par cliente'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-3">
          {clients.filter(c => Number(c.outstanding) > 0).sort((a, b) => Number(b.outstanding) - Number(a.outstanding)).map(client => (
            <div key={client.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">{initials(client.name)}</div>
                  <div>
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Dernier paiement : {client.last_purchase ? formatDate(client.last_purchase) : '—'}</p>
                  </div>
                </div>
                <p className="text-lg font-display font-semibold text-destructive">{formatCurrency(Number(client.outstanding))}</p>
              </div>
            </div>
          ))}
          {clients.filter(c => Number(c.outstanding) > 0).length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun impayé 🎉</p>}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {payments.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun paiement enregistré</p>}
          {payments.map(pay => {
            const client = clients.find(c => c.id === pay.client_id);
            return (
              <div key={pay.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                <div>
                  <p className="text-sm font-medium">{client?.name || '—'}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(pay.date)} · {pay.method || '—'}</p>
                  {pay.notes && <p className="text-xs text-muted-foreground mt-0.5">{pay.notes}</p>}
                </div>
                <p className="text-sm font-semibold text-success">+{formatCurrency(Number(pay.amount))}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
