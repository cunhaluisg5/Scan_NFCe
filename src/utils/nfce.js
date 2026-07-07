import { getMonthLabel, parseBrazilianDate } from './date';
import { toNumber } from './format';

function cleanText(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAccessKey(value) {
  return cleanText(value).toUpperCase().replace(/[^0-9A-Z]/g, '');
}

function normalizeMoneyString(value, fallback = '0.00') {
  const raw = cleanText(value)
    .replace(/^R\$\s*/i, '')
    .replace(/[^\d,.-]/g, '');

  if (!raw) {
    return fallback;
  }

  let normalized = raw;
  if (normalized.includes(',') && normalized.includes('.')) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else if (normalized.includes(',')) {
    normalized = normalized.replace(',', '.');
  }

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : fallback;
}

function normalizeDateTimeString(value) {
  const raw = cleanText(value);
  if (!raw) {
    return '';
  }

  const parsed = parseBrazilianDate(raw) || new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  const seconds = String(parsed.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function normalizeInvoiceItem(item = {}, index = 0) {
  return {
    ...item,
    itemName: cleanText(item.itemName || item.name || `Item ${index + 1}`),
    itemCode: cleanText(item.itemCode || item.code),
    qtdItem: normalizeMoneyString(item.qtdItem ?? item.quantity ?? '0', '0.00'),
    unItem: cleanText(item.unItem || item.unit),
    itemValue: normalizeMoneyString(item.itemValue ?? item.value),
  };
}

export function normalizeInvoice(invoice = {}) {
  const items = Array.isArray(invoice.items) ? invoice.items.map(normalizeInvoiceItem) : [];
  const totalItems = String(
    invoice.totalItems ??
    invoice.details?.totalItems ??
    invoice.detailsNfce?.totalItems ??
    items.length
  );

  return {
    ...invoice,
    accesskey: normalizeAccessKey(invoice.accesskey || invoice.detailsNfce?.accesskey),
    socialName: cleanText(invoice.socialName || invoice.detailsNfce?.socialName || 'Loja sem nome'),
    cnpj: cleanText(invoice.cnpj || invoice.detailsNfce?.cnpj),
    stateRegistration: cleanText(invoice.stateRegistration || invoice.detailsNfce?.stateRegistration),
    uf: cleanText(invoice.uf || invoice.detailsNfce?.uf).toUpperCase(),
    issuanceDate: normalizeDateTimeString(invoice.issuanceDate || invoice.detailsNfce?.issuanceDate),
    createdAt: invoice.createdAt || new Date().toISOString(),
    totalItems,
    totalValue: normalizeMoneyString(invoice.totalValue || invoice.details?.totalValue || invoice.detailsNfce?.totalValue),
    paidValue: normalizeMoneyString(invoice.paidValue || invoice.details?.paidValue || invoice.detailsNfce?.paidValue),
    totalValueService: normalizeMoneyString(invoice.totalValueService || invoice.detailsNfce?.totalValueService),
    icmsCalculationBasis: normalizeMoneyString(invoice.icmsCalculationBasis || invoice.detailsNfce?.icmsCalculationBasis),
    icmsValue: normalizeMoneyString(invoice.icmsValue || invoice.detailsNfce?.icmsValue),
    typePayment: cleanText(invoice.typePayment || invoice.details?.typePayment || invoice.detailsNfce?.typePayment),
    protocol: cleanText(invoice.protocol || invoice.detailsNfce?.protocol),
    items,
  };
}

export function normalizeInvoicesCollection(invoices = []) {
  return invoices.map((invoice) => normalizeInvoice(invoice));
}

export function mapCrawlerPayloadToInvoice(payload) {
  const nfce = payload?.nfce || {};
  return normalizeInvoice({
    ...nfce.details,
    ...nfce.detailsNfce,
    items: nfce.items || [],
  });
}

export function buildNfceSavePayload(invoice = {}, sourcePayload = null) {
  const normalizedInvoice = normalizeInvoice(invoice);
  const sourceNfce = sourcePayload?.nfce || {};
  const sourceDetails = sourceNfce.details || {};
  const sourceDetailsNfce = sourceNfce.detailsNfce || {};

  return {
    nfce: {
      items: normalizedInvoice.items.map((item) => ({
        itemName: item.itemName,
        itemCode: item.itemCode,
        qtdItem: item.qtdItem,
        unItem: item.unItem,
        itemValue: item.itemValue,
      })),
      details: {
        totalItems: normalizedInvoice.totalItems,
        totalValue: normalizedInvoice.totalValue,
        paidValue: normalizedInvoice.paidValue,
        typePayment: normalizedInvoice.typePayment,
      },
      detailsNfce: {
        accesskey: normalizedInvoice.accesskey,
        totalItems: normalizedInvoice.totalItems,
        totalValue: normalizedInvoice.totalValue,
        paidValue: normalizedInvoice.paidValue,
        typePayment: normalizedInvoice.typePayment,
        socialName: normalizedInvoice.socialName,
        cnpj: normalizedInvoice.cnpj,
        stateRegistration: normalizedInvoice.stateRegistration,
        uf: normalizedInvoice.uf,
        operationDestination: cleanText(sourceDetailsNfce.operationDestination),
        finalCostumer: cleanText(sourceDetailsNfce.finalCostumer),
        buyerPresence: cleanText(sourceDetailsNfce.buyerPresence),
        model: cleanText(sourceDetailsNfce.model),
        series: cleanText(sourceDetailsNfce.series),
        number: cleanText(sourceDetailsNfce.number),
        issuanceDate: normalizedInvoice.issuanceDate,
        totalValueService: normalizedInvoice.totalValueService,
        icmsCalculationBasis: normalizedInvoice.icmsCalculationBasis,
        icmsValue: normalizedInvoice.icmsValue,
        protocol: normalizedInvoice.protocol,
        url: cleanText(sourceDetailsNfce.url || sourceDetails.url),
      },
    },
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

  normalizeInvoicesCollection(invoices).forEach((invoice) => {
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
  const normalizedInvoices = normalizeInvoicesCollection(invoices);
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (timeframe === 'day') {
    const total = normalizedInvoices.reduce((sum, invoice) => {
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
    const total = normalizedInvoices.reduce((sum, invoice) => {
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

  normalizedInvoices.forEach((invoice) => {
    const date = parseBrazilianDate(invoice.issuanceDate);
    if (date && date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth();
      values[monthIndex] += toNumber(invoice.totalValue);
    }
  });

  return { labels, values };
}

export function getInvoicesForCurrentPeriod(invoices, timeframe) {
  const normalizedInvoices = normalizeInvoicesCollection(invoices);
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return normalizedInvoices.filter((invoice) => {
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
  const normalizedInvoices = normalizeInvoicesCollection(invoices);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const result = [];

  if (timeframe === 'month') {
    for (let day = 1; day <= 31; day += 1) {
      const items = normalizedInvoices.filter((invoice) => {
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
      const items = normalizedInvoices.filter((invoice) => {
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
