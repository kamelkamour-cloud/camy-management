import React, { useState } from 'react';
import { FileText, Image, Receipt, Search, Grid, List, Upload } from 'lucide-react';
import { sampleDocuments, sampleClients, samplePackages, formatDate } from '@/lib/sample-data';

const typeIcons: Record<string, React.ReactNode> = {
  receipt: <Receipt className="w-5 h-5" />,
  invoice: <FileText className="w-5 h-5" />,
  product_photo: <Image className="w-5 h-5" />,
  payment_proof: <FileText className="w-5 h-5" />,
  screenshot: <Image className="w-5 h-5" />,
  proof_of_delivery: <FileText className="w-5 h-5" />,
  misc: <FileText className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  receipt: 'bg-success/10 text-success',
  invoice: 'bg-primary/10 text-primary',
  product_photo: 'bg-accent/20 text-accent-foreground',
  payment_proof: 'bg-gold/20 text-gold-foreground',
  screenshot: 'bg-secondary text-secondary-foreground',
  proof_of_delivery: 'bg-muted text-muted-foreground',
  misc: 'bg-muted text-muted-foreground',
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState('');

  const filtered = sampleDocuments.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.brand?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || d.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">{sampleDocuments.length} files</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-card">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-card text-sm text-muted-foreground outline-none">
          <option value="">All types</option>
          <option value="receipt">Receipts</option>
          <option value="invoice">Invoices</option>
          <option value="product_photo">Photos</option>
          <option value="payment_proof">Payment Proof</option>
        </select>
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><Grid className="w-4 h-4" /></button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-2">
          {filtered.map(doc => {
            const client = doc.clientId ? sampleClients.find(c => c.id === doc.clientId) : null;
            const pkg = doc.packageId ? samplePackages.find(p => p.id === doc.packageId) : null;
            return (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[doc.type]}`}>
                    {typeIcons[doc.type]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      {client && <span>{client.name}</span>}
                      {pkg && <span>· {pkg.name}</span>}
                      {doc.brand && <span>· {doc.brand}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${typeColors[doc.type]}`}>{doc.type.replace('_', ' ')}</span>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(doc.uploadedAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map(doc => (
            <div key={doc.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer">
              <div className={`w-full aspect-square rounded-lg flex items-center justify-center mb-3 ${typeColors[doc.type]}`}>
                {React.cloneElement(typeIcons[doc.type] as React.ReactElement, { className: 'w-8 h-8' })}
              </div>
              <p className="text-sm font-medium truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatDate(doc.uploadedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
