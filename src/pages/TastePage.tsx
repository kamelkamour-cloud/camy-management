import { Sparkles, Heart, TrendingUp, Gift, UserCheck } from 'lucide-react';
import { useClients } from '@/hooks/useData';
import { formatCurrency, initials } from '@/lib/helpers';

export default function TastePage() {
  const { data: clients = [], isLoading } = useClients();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Goûts & Recommandations</h1>
        <p className="text-sm text-muted-foreground mt-1">Insights basés sur l'historique d'achat réel</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12"><p className="text-sm text-muted-foreground">Ajoutez des clientes pour voir leurs profils de goûts</p></div>
      ) : (
        <section>
          <h2 className="font-display text-lg font-semibold mb-4">Profils de goûts</h2>
          <div className="space-y-4">
            {clients.map(client => (
              <div key={client.id} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center text-sm font-medium text-primary">{initials(client.name)}</div>
                  <div>
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.city} · Total dépensé : {formatCurrency(Number(client.total_spend))}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Marques</p>
                    <div className="flex flex-wrap gap-1">{(client.preferred_brands || []).map(b => <span key={b} className="text-xs px-2 py-0.5 bg-secondary rounded-full">{b}</span>)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Catégories</p>
                    <div className="flex flex-wrap gap-1">{(client.preferred_categories || []).map(c => <span key={c} className="text-xs px-2 py-0.5 bg-secondary rounded-full">{c}</span>)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Couleurs</p>
                    <p className="text-xs text-muted-foreground">{client.color_preferences || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Budget</p>
                    <p className="text-xs text-muted-foreground">{client.budget_band || '—'}</p>
                  </div>
                </div>
                {client.style_notes && <p className="text-xs text-muted-foreground mt-3 italic">"{client.style_notes}"</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
