import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClients, useTrips } from '@/hooks/useData';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Users, MapPin, ShoppingBag, CreditCard } from 'lucide-react';

type ImportType = 'clients' | 'trips' | 'items' | 'payments';

interface ImportConfig {
  type: ImportType;
  label: string;
  icon: React.ElementType;
  templateUrl: string;
  description: string;
}

const CONFIGS: ImportConfig[] = [
  { type: 'clients', label: 'Clientes', icon: Users, templateUrl: '/Template_Clientes.xlsx', description: 'Noms, contacts, préférences, tailles' },
  { type: 'trips', label: 'Voyages', icon: MapPin, templateUrl: '/Template_Voyages.xlsx', description: 'Destinations, dates, boutiques' },
  { type: 'items', label: 'Articles', icon: ShoppingBag, templateUrl: '/Template_Articles.xlsx', description: 'Achats par voyage et cliente' },
  { type: 'payments', label: 'Paiements', icon: CreditCard, templateUrl: '/Template_Paiements.xlsx', description: 'Paiements reçus par cliente' },
];

export default function ImportPage() {
  const { user } = useAuth();
  const { data: existingClients } = useClients();
  const { data: existingTrips } = useTrips();
  const qc = useQueryClient();

  const [activeType, setActiveType] = useState<ImportType | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);

  const handleFile = useCallback((type: ImportType, file: File) => {
    setActiveType(type);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target?.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });
      // Skip example row if italic (just skip row with placeholder-like data)
      const filtered = rows.filter((_, i) => i > 0 || !String(rows[0]?.['Nom *'] || rows[0]?.['Nom du voyage *'] || rows[0]?.['Nom cliente *'] || '').includes('XXX'));
      setPreview(filtered);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const findClientId = (name: string) => {
    if (!name || !existingClients) return null;
    const n = name.trim().toLowerCase();
    return existingClients.find(c => c.name.toLowerCase() === n)?.id || null;
  };

  const findTripId = (name: string) => {
    if (!name || !existingTrips) return null;
    const n = name.trim().toLowerCase();
    return existingTrips.find(t => t.name.toLowerCase() === n)?.id || null;
  };

  const doImport = async () => {
    if (!user || !activeType || preview.length === 0) return;
    setImporting(true);
    let success = 0, errors = 0;

    for (const row of preview) {
      try {
        if (activeType === 'clients') {
          const name = (row['Nom *'] || row['Nom'] || '').trim();
          if (!name) { errors++; continue; }
          const brands = (row['Marques préférées'] || '').split(',').map(s => s.trim()).filter(Boolean);
          const cats = (row['Catégories'] || '').split(',').map(s => s.trim()).filter(Boolean);
          const { error } = await supabase.from('clients').insert({
            user_id: user.id, name,
            whatsapp: row['WhatsApp'] || null,
            instagram: row['Instagram'] || null,
            city: row['Ville'] || null,
            country: row['Pays'] || null,
            tier: row['Niveau'] || 'active',
            preferred_brands: brands.length ? brands : [],
            preferred_categories: cats.length ? cats : [],
            sizes: row['Tailles'] || null,
            color_preferences: row['Couleurs'] || null,
            style_notes: row['Notes style'] || null,
            budget_band: row['Budget'] || null,
            notes: row['Notes'] || null,
          });
          if (error) throw error;
          success++;
        } else if (activeType === 'trips') {
          const name = (row['Nom du voyage *'] || row['Nom du voyage'] || '').trim();
          if (!name) { errors++; continue; }
          const stores = (row['Boutiques'] || '').split(',').map(s => s.trim()).filter(Boolean);
          const { error } = await supabase.from('trips').insert({
            user_id: user.id, name,
            city: row['Ville'] || null,
            date_start: row['Date début'] || null,
            date_end: row['Date fin'] || null,
            stores: stores.length ? stores : [],
            notes: row['Notes'] || null,
            status: row['Statut'] || 'open',
          });
          if (error) throw error;
          success++;
        } else if (activeType === 'items') {
          const tripName = (row['Nom du voyage *'] || row['Nom du voyage'] || '').trim();
          const tripId = findTripId(tripName);
          if (!tripId) { errors++; continue; }
          const clientName = (row['Nom cliente'] || '').trim();
          const clientId = findClientId(clientName);
          const { error } = await supabase.from('items').insert({
            user_id: user.id, trip_id: tripId,
            brand: row['Marque'] || null,
            category: row['Catégorie'] || null,
            description: row['Description'] || null,
            cost_price: parseFloat(row['Prix coûtant']) || 0,
            selling_price: parseFloat(row['Prix vente']) || 0,
            client_id: clientId,
            store: row['Boutique'] || null,
            is_requested: (row['Demandé ?'] || '').toLowerCase() === 'oui',
            payment_status: row['Statut paiement'] || 'unpaid',
            amount_paid: parseFloat(row['Montant payé']) || 0,
          });
          if (error) throw error;
          success++;
        } else if (activeType === 'payments') {
          const clientName = (row['Nom cliente *'] || row['Nom cliente'] || '').trim();
          const clientId = findClientId(clientName);
          if (!clientId) { errors++; continue; }
          const tripName = (row['Nom du voyage'] || '').trim();
          const tripId = findTripId(tripName);
          const { error } = await supabase.from('payments').insert({
            user_id: user.id,
            client_id: clientId,
            amount: parseFloat(row['Montant *'] || row['Montant']) || 0,
            date: row['Date'] || new Date().toISOString().slice(0, 10),
            method: row['Méthode'] || null,
            notes: row['Notes'] || null,
            trip_id: tripId,
          });
          if (error) throw error;
          success++;
        }
      } catch (e) {
        console.error('Import error:', e);
        errors++;
      }
    }

    setResult({ success, errors });
    setImporting(false);
    qc.invalidateQueries({ queryKey: ['clients'] });
    qc.invalidateQueries({ queryKey: ['trips'] });
    qc.invalidateQueries({ queryKey: ['items'] });
    qc.invalidateQueries({ queryKey: ['payments'] });
    toast.success(`${success} lignes importées avec succès`);
    if (errors > 0) toast.error(`${errors} lignes en erreur`);
  };

  const downloadTemplate = (url: string, filename: string) => {
    // Templates are in /mnt/documents, we'll use a different approach
    // For now, generate and download in-browser
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Importer des données</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Importez vos clientes, voyages, articles et paiements depuis des fichiers Excel.
          <br />Respectez l'ordre : <strong>1. Clientes → 2. Voyages → 3. Articles → 4. Paiements</strong>
        </p>
      </div>

      {/* Step cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONFIGS.map((cfg, i) => (
          <Card key={cfg.type} className={`relative overflow-hidden transition-all ${activeType === cfg.type ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                  <cfg.icon className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base">{cfg.label}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-xs">{cfg.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`/templates/${cfg.type}.xlsx`}
                className="hidden"
              />
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(cfg.type, f);
                      e.target.value = '';
                    }}
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground">
                    <Upload className="w-4 h-4" />
                    Choisir un fichier
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Download templates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger les modèles Excel
          </CardTitle>
          <CardDescription className="text-xs">
            Remplissez ces modèles avec vos données puis importez-les ci-dessus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CONFIGS.map(cfg => (
              <a
                key={cfg.type}
                href={`/mnt/documents/Template_${cfg.label}.xlsx`}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-sm hover:bg-muted/80 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
                {cfg.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {activeType && preview.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Aperçu — {preview.length} ligne{preview.length > 1 ? 's' : ''}
              </CardTitle>
              {result && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-4 h-4" /> {result.success}
                  </span>
                  {result.errors > 0 && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="w-4 h-4" /> {result.errors}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    {Object.keys(preview[0]).map(k => (
                      <th key={k} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate">{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <p className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                  ... et {preview.length - 10} lignes de plus
                </p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={doImport} disabled={importing} className="gap-2">
                {importing ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {importing ? 'Import en cours...' : `Importer ${preview.length} lignes`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
