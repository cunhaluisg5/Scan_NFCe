export function formatCurrency(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  const normalized = String(value || '0').replace(/\./g, '').replace(',', '.');
  const numeric = Number(normalized);

  return Number.isFinite(numeric) ? numeric : 0;
}
