import { getMonthLabel, parseBrazilianDate } from './date';
import { toNumber } from './format';

export function mapCrawlerPayloadToInvoice(payload) {
  const nfce = payload?.nfce || {};
  return {
    ...nfce.details,
    ...nfce.detailsNfce,
    items: nfce.items || [],
  };
}

export function normalizeNfceUrl(value) {
  const raw = String(value || '').trim().replace(/\s+/g, '');

  if (!raw) {
    return '';
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (/^(portalsped|nfce)\.fazenda\.mg\.gov\.br/i.test(raw)) {
    return `https://${raw}`;
  }

  return raw;
}

export function isValidNfceUrl(value) {
  const url = normalizeNfceUrl(value);

  if (!url) {
    return false;
  }

  return /(portalsped|nfce)\.fazenda\.mg\.gov\.br/i.test(url);
}

export function groupInvoicesByStore(invoices) {
  const groups = new Map();

  invoices.forEach((invoice) => {
    const key = invoice.socialName || 'Loja sem nome';
    const current = groups.get(key) || [];
    current.push(invoice);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).map(([name, items], index) => ({
    id: `${name}-${index}`,
    name,
    invoices: items,
    total: items.reduce((sum, invoice) => sum + toNumber(invoice.totalValue), 0),
  }));
}

export function buildTimeline(invoices, timeframe) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (timeframe === 'day') {
    const total = invoices.reduce((sum, invoice) => {
      const date = parseBrazilianDate(invoice.issuanceDate);
      if (!date) {
        return sum;
      }

      return date.getDate() === currentDay &&
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
        ? sum + toNumber(invoice.totalValue)
        : sum;
    }, 0);

    return {
      labels: [`${currentDay} ${getMonthLabel(currentMonth).short}`],
      values: [total],
    };
  }

  if (timeframe === 'month') {
    const total = invoices.reduce((sum, invoice) => {
      const date = parseBrazilianDate(invoice.issuanceDate);
      if (!date) {
        return sum;
      }

      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear
        ? sum + toNumber(invoice.totalValue)
        : sum;
    }, 0);

    return {
      labels: [getMonthLabel(currentMonth).short],
      values: [total],
    };
  }

  const labels = [];
  const values = [];

  for (let month = 1; month <= 12; month += 1) {
    labels.push(getMonthLabel(month).short);
    values.push(0);
  }

  invoices.forEach((invoice) => {
    const date = parseBrazilianDate(invoice.issuanceDate);
    if (date && date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth();
      values[monthIndex] += toNumber(invoice.totalValue);
    }
  });

  return { labels, values };
}

export function getInvoicesForCurrentPeriod(invoices, timeframe) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return invoices.filter((invoice) => {
    const date = parseBrazilianDate(invoice.issuanceDate);
    if (!date) {
      return false;
    }

    if (timeframe === 'day') {
      return date.getDate() === currentDay &&
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear;
    }

    if (timeframe === 'month') {
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    }

    return date.getFullYear() === currentYear;
  });
}

export function getMostExpensiveInvoices(invoices, timeframe) {
  const filtered = getInvoicesForCurrentPeriod(invoices, timeframe);

  if (!filtered.length) {
    return [];
  }

  const max = Math.max(...filtered.map((invoice) => toNumber(invoice.totalValue)));
  return filtered.filter((invoice) => toNumber(invoice.totalValue) === max);
}

export function getPeriodBreakdown(invoices, timeframe) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const result = [];

  if (timeframe === 'month') {
    for (let day = 1; day <= 31; day += 1) {
      const items = invoices.filter((invoice) => {
        const date = parseBrazilianDate(invoice.issuanceDate);
        if (!date) {
          return false;
        }

        return date.getDate() === day &&
          date.getMonth() + 1 === currentMonth &&
          date.getFullYear() === currentYear;
      });

      if (items.length) {
        result.push({
          label: `Dia ${day}`,
          count: items.length,
          total: items.reduce((sum, invoice) => sum + toNumber(invoice.totalValue), 0),
        });
      }
    }
  }

  if (timeframe === 'year') {
    for (let month = 1; month <= 12; month += 1) {
      const items = invoices.filter((invoice) => {
        const date = parseBrazilianDate(invoice.issuanceDate);
        if (!date) {
          return false;
        }

        return date.getMonth() + 1 === month && date.getFullYear() === currentYear;
      });

      if (items.length) {
        result.push({
          label: getMonthLabel(month).full,
          count: items.length,
          total: items.reduce((sum, invoice) => sum + toNumber(invoice.totalValue), 0),
        });
      }
    }
  }

  return result;
}
