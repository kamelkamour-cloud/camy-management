export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function tierLabel(tier: string): string {
  const labels: Record<string, string> = {
    vip: 'VIP',
    active: 'Active',
    occasional: 'Occasionnelle',
    inactive: 'Inactive',
    friend: 'Amie',
    family: 'Famille',
  };
  return labels[tier] || tier;
}

export function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}
