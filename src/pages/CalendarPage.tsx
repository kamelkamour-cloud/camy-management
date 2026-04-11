import { useKeyDates, useClients } from '@/hooks/useData';
import { formatDate } from '@/lib/helpers';
import { Calendar, Gift, Heart, ShoppingBag, Star, CreditCard, Clock, Moon } from 'lucide-react';

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  birthday: { icon: <Gift className="w-4 h-4" />, color: 'bg-primary/10 text-primary', label: 'anniversaire' },
  wedding: { icon: <Heart className="w-4 h-4" />, color: 'bg-rose-light text-primary', label: 'mariage' },
  fashion_week: { icon: <Star className="w-4 h-4" />, color: 'bg-gold/20 text-gold-foreground', label: 'fashion week' },
  collection_launch: { icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-accent/20 text-accent-foreground', label: 'lancement' },
  sale: { icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-success/10 text-success', label: 'soldes' },
  eid: { icon: <Moon className="w-4 h-4" />, color: 'bg-gold/20 text-gold-foreground', label: 'aïd' },
  ramadan: { icon: <Moon className="w-4 h-4" />, color: 'bg-gold/20 text-gold-foreground', label: 'ramadan' },
  follow_up: { icon: <Clock className="w-4 h-4" />, color: 'bg-secondary text-secondary-foreground', label: 'relance' },
  payment_due: { icon: <CreditCard className="w-4 h-4" />, color: 'bg-destructive/10 text-destructive', label: 'échéance' },
  custom: { icon: <Calendar className="w-4 h-4" />, color: 'bg-muted text-muted-foreground', label: 'autre' },
};

export default function CalendarPage() {
  const { data: keyDates = [], isLoading } = useKeyDates();
  const { data: clients = [] } = useClients();

  const sorted = [...keyDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = sorted.filter(d => new Date(d.date) < new Date());
  const upcoming = sorted.filter(d => new Date(d.date) >= new Date());

  const renderDate = (d: typeof keyDates[0]) => {
    const client = d.client_id ? clients.find(c => c.id === d.client_id) : null;
    const config = typeConfig[d.type] || typeConfig.custom;
    return (
      <div key={d.id} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/20 transition-colors">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{d.title}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span>{formatDate(d.date)}</span>
            {client && <span>· {client.name}</span>}
          </div>
          {d.notes && <p className="text-xs text-muted-foreground mt-1">{d.notes}</p>}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${config.color}`}>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Calendrier & Dates clés</h1>
          <p className="text-sm text-muted-foreground mt-1">Jalons opérationnels et commerciaux</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Ajouter une date</button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : keyDates.length === 0 ? (
        <div className="text-center py-12"><p className="text-sm text-muted-foreground">Aucune date clé</p></div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display text-lg font-semibold mb-4">À venir</h2>
              <div className="space-y-2">{upcoming.map(renderDate)}</div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold mb-4 text-muted-foreground">Passées</h2>
              <div className="space-y-2 opacity-60">{past.map(renderDate)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
