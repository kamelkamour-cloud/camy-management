import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Package, Store, Tag, User, ChevronRight, Check } from 'lucide-react';
import { samplePackages, sampleClients } from '@/lib/sample-data';

type Step = 'package' | 'photo' | 'details' | 'done';

export default function QuickAddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>('package');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [store, setStore] = useState('');
  const [clientId, setClientId] = useState('');

  const reset = () => {
    setStep('package');
    setSelectedPackage('');
    setBrand('');
    setCategory('');
    setDescription('');
    setCost('');
    setStore('');
    setClientId('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    setStep('done');
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl max-h-[90vh] overflow-y-auto lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:w-[480px] lg:max-h-[85vh] border border-border shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl font-semibold">Ajout rapide</h2>
              <button onClick={handleClose} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-1 px-5 pt-4">
              {(['package', 'photo', 'details'] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= ['package', 'photo', 'details'].indexOf(step) ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {step === 'package' && (
                  <motion.div key="package" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-muted-foreground mb-4">Sélectionnez ou créez un voyage/package</p>
                    <div className="space-y-2">
                      {samplePackages.filter(p => p.status !== 'completed').map(pkg => (
                        <button
                          key={pkg.id}
                          onClick={() => { setSelectedPackage(pkg.id); setStep('photo'); }}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                            selectedPackage === pkg.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{pkg.name}</p>
                              <p className="text-xs text-muted-foreground">{pkg.city} · {pkg.stores.length} boutiques</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                      <button
                        onClick={() => { setSelectedPackage('new'); setStep('photo'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors text-sm"
                      >
                        <Package className="w-4 h-4" />
                        Créer un nouveau package
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'photo' && (
                  <motion.div key="photo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-muted-foreground mb-4">Téléchargez un reçu ou une photo (optionnel)</p>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="text-sm">Appuyez pour prendre une photo ou télécharger</p>
                      <p className="text-xs">Reçu, photo produit ou capture d'écran</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep('package')} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted/50">
                        Retour
                      </button>
                      <button onClick={() => setStep('details')} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                        Continuer
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-muted-foreground mb-4">Détails de l'article — remplissez ce que vous pouvez</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5">
                        <Store className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input value={store} onChange={e => setStore(e.target.value)} placeholder="Boutique / Magasin" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5">
                        <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Marque" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex gap-3">
                        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Catégorie" className="flex-1 border border-border rounded-lg px-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                        <input value={cost} onChange={e => setCost(e.target.value)} placeholder="Coût (€)" className="w-28 border border-border rounded-lg px-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                      </div>
                      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optionnel)" className="w-full border border-border rounded-lg px-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                      <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <select value={clientId} onChange={e => setClientId(e.target.value)} className="flex-1 bg-transparent text-sm outline-none text-muted-foreground">
                          <option value="">Assigner à une cliente (optionnel)</option>
                          {sampleClients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep('photo')} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted/50">
                        Retour
                      </button>
                      <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                        Enregistrer
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'done' && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 gap-3">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-6 h-6 text-success" />
                    </div>
                    <p className="font-display text-lg font-semibold">Article enregistré</p>
                    <p className="text-sm text-muted-foreground">Vous pourrez compléter les détails plus tard</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
