import { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { sampleClients, samplePayments, samplePaymentPlans, formatCurrency, formatDate } from '@/lib/sample-data';

export default function PaymentsPage() {
  const [tab, setTab] = useState<'overview' | 'history' | 'plans'>('overview');
  const totalOutstanding = sampleClients.reduce((s, c) => s + c.outstanding, 0);
  const overdue = samplePaymentPlans.flatMap(pp => pp.installments).filter(i => i.status === 'overdue');
  const pending = samplePaymentPlans.flatMap(pp => pp.installments).filter(i => i.status === 'pending');

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Paiements & Créances</h1>
        <p className="text-sm text-muted-foreground mt-1">Suivez ce qui est dû et ce qui est encaissé</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><CreditCard className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Total impayé</span></div>
          <p className="font-display text-2xl font-semibold text-destructive">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><AlertCircle className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">En retard</span></div>
          <p className="font-display text-2xl font-semibold text-destructive">{formatCurrency(overdue.reduce((s, i) => s + i.amount, 0))}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Clock className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">À venir</span></div>
          <p className="font-display text-2xl font-semibold">{formatCurrency(pending.reduce((s, i) => s + i.amount, 0))}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><CheckCircle className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Total encaissé</span></div>
          <p className="font-display text-2xl font-semibold text-success">{formatCurrency(sampleClients.reduce((s, c) => s + c.totalPaid, 0))}</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border mb-6">
        {(['overview', 'history', 'plans'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'plans' ? 'Échéanciers' : t === 'history' ? 'Historique' : 'Par cliente'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-3">
          {sampleClients.filter(c => c.outstanding > 0).sort((a, b) => b.outstanding - a.outstanding).map(client => (
            <div key={client.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Dernier paiement : {client.lastPurchase ? formatDate(client.lastPurchase) : '—'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display font-semibold text-destructive">{formatCurrency(client.outstanding)}</p>
                  <button className="text-xs text-primary hover:underline mt-1">Enregistrer un paiement</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {samplePayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(pay => {
            const client = sampleClients.find(c => c.id === pay.clientId);
            return (
              <div key={pay.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                <div>
                  <p className="text-sm font-medium">{client?.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(pay.date)} · {pay.method}</p>
                  {pay.notes && <p className="text-xs text-muted-foreground mt-0.5">{pay.notes}</p>}
                </div>
                <p className="text-sm font-semibold text-success">+{formatCurrency(pay.amount)}</p>
              </div>
            );
          })}
          <button className="w-full text-center py-3 text-sm text-primary hover:underline border border-dashed border-border rounded-lg mt-2">
            + Ajouter un paiement passé
          </button>
        </div>
      )}

      {tab === 'plans' && (
        <div className="space-y-4">
          {samplePaymentPlans.map(pp => {
            const client = sampleClients.find(c => c.id === pp.clientId);
            return (
              <div key={pp.id} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">{client?.name}</p>
                    <p className="text-xs text-muted-foreground">Total : {formatCurrency(pp.totalAmount)}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(pp.installments.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0))} / {formatCurrency(pp.totalAmount)}
                  </p>
                </div>
                <div className="space-y-2">
                  {pp.installments.map(inst => (
                    <div key={inst.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        {inst.status === 'paid' && <CheckCircle className="w-4 h-4 text-success" />}
                        {inst.status === 'pending' && <Clock className="w-4 h-4 text-muted-foreground" />}
                        {inst.status === 'overdue' && <AlertCircle className="w-4 h-4 text-destructive" />}
                        <span className="text-sm">{formatDate(inst.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${inst.status === 'overdue' ? 'text-destructive' : inst.status === 'paid' ? 'text-success' : ''}`}>
                          {formatCurrency(inst.amount)}
                        </span>
                        {inst.status !== 'paid' && (
                          <button className="text-xs text-primary hover:underline">Marquer payé</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
