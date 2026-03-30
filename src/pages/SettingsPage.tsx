import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your workspace</p>
      </div>

      <div className="space-y-3">
        {[
          { icon: User, label: 'Profile', desc: 'Your personal details and preferences' },
          { icon: Bell, label: 'Notifications', desc: 'Payment reminders, follow-up alerts' },
          { icon: Shield, label: 'Privacy & Security', desc: 'Password, two-factor authentication' },
          { icon: Database, label: 'Data & Backfill', desc: 'Import past data, export records' },
          { icon: SettingsIcon, label: 'General', desc: 'Currency, language, display preferences' },
        ].map(item => (
          <button key={item.label} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors text-left">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Backfill progress */}
      <section className="mt-8 p-5 rounded-xl border border-border bg-card">
        <h2 className="font-display text-lg font-semibold mb-3">Data Completeness</h2>
        <p className="text-sm text-muted-foreground mb-4">Track how much of your history has been documented</p>
        <div className="space-y-4">
          {[
            { label: 'Client profiles complete', value: 80 },
            { label: 'Packages documented', value: 60 },
            { label: 'Payment history entered', value: 45 },
            { label: 'Documents uploaded', value: 30 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.value}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-primary hover:underline">+ Add past data</button>
      </section>
    </div>
  );
}
