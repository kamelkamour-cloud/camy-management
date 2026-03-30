import { Sparkles, Heart, TrendingUp, Gift, UserCheck } from 'lucide-react';
import { sampleClients, formatCurrency } from '@/lib/sample-data';

const insights = [
  {
    icon: <Heart className="w-4 h-4" />,
    title: 'New Bag Arrivals',
    description: 'Amina, Yasmine, and Kenza typically respond well to new bag launches.',
    clients: ['c1', 'c2', 'c5'],
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: <Gift className="w-4 h-4" />,
    title: 'Eid Gift Season',
    description: 'Eid is approaching — Amina and Salma have historically purchased gifts around this time.',
    clients: ['c1', 'c3'],
    color: 'bg-gold/20 text-gold-foreground',
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    title: 'Wedding Season',
    description: 'Kenza\'s wedding is in June. Major purchase opportunity for jewelry, bags, and evening wear.',
    clients: ['c5'],
    color: 'bg-success/10 text-success',
  },
  {
    icon: <UserCheck className="w-4 h-4" />,
    title: 'Re-engage Nadia',
    description: 'Nadia hasn\'t purchased since September. She loved Celine — share new arrivals.',
    clients: ['c4'],
    color: 'bg-accent/20 text-accent-foreground',
  },
];

export default function TastePage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Taste & Recommendations</h1>
        <p className="text-sm text-muted-foreground mt-1">Insights grounded in actual purchase history</p>
      </div>

      {/* Smart prompts */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          Smart Suggestions
        </h2>
        <div className="grid lg:grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${insight.color}`}>
                {insight.icon}
                {insight.title}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <div className="flex gap-2">
                {insight.clients.map(cid => {
                  const client = sampleClients.find(c => c.id === cid);
                  return client ? (
                    <span key={cid} className="text-xs px-2 py-1 bg-secondary rounded-full">{client.name.split(' ')[0]}</span>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client taste profiles */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Client Taste Profiles</h2>
        <div className="space-y-4">
          {sampleClients.map(client => (
            <div key={client.id} className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.city} · Total spend: {formatCurrency(client.totalSpend)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Brands</p>
                  <div className="flex flex-wrap gap-1">{client.preferredBrands.map(b => <span key={b} className="text-xs px-2 py-0.5 bg-secondary rounded-full">{b}</span>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Categories</p>
                  <div className="flex flex-wrap gap-1">{client.preferredCategories.map(c => <span key={c} className="text-xs px-2 py-0.5 bg-secondary rounded-full">{c}</span>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Colors</p>
                  <p className="text-xs text-muted-foreground">{client.colorPreferences || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Budget</p>
                  <p className="text-xs text-muted-foreground">{client.budgetBand || '—'}</p>
                </div>
              </div>
              {client.styleNotes && (
                <p className="text-xs text-muted-foreground mt-3 italic">"{client.styleNotes}"</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
