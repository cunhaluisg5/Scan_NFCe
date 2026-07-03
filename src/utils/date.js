const MONTHS = [
  { short: 'Jan', full: 'Janeiro' },
  { short: 'Fev', full: 'Fevereiro' },
  { short: 'Mar', full: 'Março' },
  { short: 'Abr', full: 'Abril' },
  { short: 'Mai', full: 'Maio' },
  { short: 'Jun', full: 'Junho' },
  { short: 'Jul', full: 'Julho' },
  { short: 'Ago', full: 'Agosto' },
  { short: 'Set', full: 'Setembro' },
  { short: 'Out', full: 'Outubro' },
  { short: 'Nov', full: 'Novembro' },
  { short: 'Dez', full: 'Dezembro' },
];

export function parseBrazilianDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const raw = String(value).trim();

  if (raw.includes('T') || raw.includes('-')) {
    const isoDate = new Date(raw);
    return Number.isNaN(isoDate.getTime()) ? null : isoDate;
  }

  const match = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?)?$/
  );

  if (!match) {
    return null;
  }

  const [, day, month, year, hours = '0', minutes = '0', seconds = '0'] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds)
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value) {
  const date = parseBrazilianDate(value) || new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatDate(value) {
  const date = parseBrazilianDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function getMonthLabel(monthNumber) {
  return MONTHS[monthNumber - 1] || MONTHS[0];
}

export function getMonthOptions() {
  return MONTHS.map((month, index) => ({
    label: month.full,
    value: String(index + 1),
  }));
}
