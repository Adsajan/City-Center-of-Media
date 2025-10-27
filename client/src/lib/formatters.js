export function currency(n, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n || 0);
  } catch {
    return `$${(n || 0).toFixed(2)}`;
  }
}

export function dateFmt(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString();
}

