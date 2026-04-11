import { Settings as SettingsIcon, User, Bell, Shield, Database, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
  };

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Réglages</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre espace de travail</p>
      </div>

      {user && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Compte connecté</p>
        </div>
      )}

      <div className="space-y-3">
        {[
          { icon: User, label: 'Profil', desc: 'Vos informations personnelles et préférences' },
          { icon: Bell, label: 'Notifications', desc: 'Rappels de paiement, alertes de relance' },
          { icon: Shield, label: 'Confidentialité & Sécurité', desc: 'Mot de passe, authentification' },
          { icon: Database, label: 'Données & Historique', desc: 'Importer des données passées, exporter' },
          { icon: SettingsIcon, label: 'Général', desc: "Devise, langue, préférences d'affichage" },
        ].map(item => (
          <button key={item.label} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors text-left">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><item.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <button onClick={handleSignOut} className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors">
        <LogOut className="w-4 h-4" />
        Se déconnecter
      </button>
    </div>
  );
}
