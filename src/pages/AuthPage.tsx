import { useEffect, useState } from 'react';
import { Delete } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logoImg from '@/assets/logo-camy.png';
import { toast } from 'sonner';

const ACCESS_PIN = import.meta.env.VITE_ACCESS_PIN;
const ACCOUNT_EMAIL = import.meta.env.VITE_ACCOUNT_EMAIL;
const ACCOUNT_PASSWORD = import.meta.env.VITE_ACCOUNT_PASSWORD;
const PIN_LENGTH = 4;

export default function AuthPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    if (pin !== ACCESS_PIN) {
      setError(true);
      const t = setTimeout(() => {
        setPin('');
        setError(false);
      }, 600);
      return () => clearTimeout(t);
    }

    setLoading(true);
    supabase.auth
      .signInWithPassword({ email: ACCOUNT_EMAIL, password: ACCOUNT_PASSWORD })
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
          setPin('');
          setLoading(false);
        }
      });
  }, [pin]);

  const press = (digit: string) => {
    if (loading) return;
    setPin(prev => (prev.length < PIN_LENGTH ? prev + digit : prev));
  };

  const backspace = () => {
    if (loading) return;
    setPin(prev => prev.slice(0, -1));
  };

  const keys: (string | 'back' | null)[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'back'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xs space-y-10">
        <div className="text-center">
          <img src={logoImg} alt="Maison Camy" className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
          <h1 className="font-display text-3xl font-semibold tracking-tight">Maison Camy</h1>
          <p className="text-muted-foreground text-sm mt-1">Concierge Privée</p>
        </div>

        <div className={error ? 'animate-shake' : ''}>
          <p className="text-center text-sm text-muted-foreground mb-4">Code d'accès</p>
          <div className="flex justify-center gap-3">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-colors ${
                  error
                    ? 'border-destructive bg-destructive'
                    : i < pin.length
                    ? 'border-primary bg-primary'
                    : 'border-border bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {keys.map((k, i) => {
            if (k === null) return <div key={i} />;
            if (k === 'back') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={backspace}
                  disabled={loading || pin.length === 0}
                  className="h-14 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                  aria-label="Effacer"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => press(k)}
                disabled={loading}
                className="h-14 rounded-xl border border-border bg-card text-xl font-light hover:border-primary/40 hover:bg-muted disabled:opacity-50 transition-colors"
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
