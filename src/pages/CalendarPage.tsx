import { sampleKeyDates, sampleClients, formatDate } from '@/lib/sample-data';
import { Calendar, Gift, Heart, ShoppingBag, Star, CreditCard, Clock, Moon } from 'lucide-react';

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  birthday: { icon: <Gift className="w-4 h-4" />, color: 'bg-primary/10 text-primary' },
  wedding: { icon: <Heart className="w-4 h-4" />, color: 'bg-rose-light text-primary' },
  fashion_week: { icon: <Star className="w-4 h-4" />, color: 'bg-gold/20 text-gold-foreground' },
  collection_launch: { icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-accent/20 text-accent-foreground' },
  sale: { icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-success/10 text-success' },
  eid: { icon: <Moon className="w-4 h-4" />, color: 'bg-gold/20 text-gold-foreground' },
  ramadan: { icon: <Moon className="w-4 h-4" />, color: 'bg-gold/20 text-gold-foreground' },
  follow_up: { icon: <Clock className="w-4 h-4" />, color: 'bg-secondary text-secondary-foreground' },
  payment_due: { icon: <CreditCard className="w-4 h-4" />, color: 'bg-destructive/10 text-destructive' },
  custom: { icon: <Calendar className="w-4 h-4" />, color: 'bg-muted text-muted-foreground' },
};

export default function CalendarPage() {
  const sorted = [...sampleKeyDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = sorted.filter(d => new Date(d.date) < new Date());
  const upcoming = sorted.filter(d => new Date(d.date) >= new Date());

  const renderDate = (d: typeof sampleKeyDates[0]) => {
    const client = d.clientId ? sampleClients.find(c => c.id === d.clientId) : null;
    const config = typeConfig[d.type] || typeConfig.custom;
    return (
      <div key={d.id} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/20 transition-colors">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{d.title}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span>{formatDate(d.date)}</span>
            {client && <span>· {client.name}</span>}
          </div>
          {d.notes && <p className="text-xs text-muted-foreground mt-1">{d.notes}</p>}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${config.color}`}>
          {d.type.replace(/_/g, ' ')}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Calendar & Key Dates</h1>
          <p className="text-sm text-muted-foreground mt-1">Operational and commercial milestones</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          Add Date
        </button>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4">Upcoming</h2>
          <div className="space-y-2">{upcoming.map(renderDate)}</div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-4 text-muted-foreground">Past</h2>
          <div className="space-y-2 opacity-60">{past.map(renderDate)}</div>
        </section>
      )}
    </div>
  );
}
