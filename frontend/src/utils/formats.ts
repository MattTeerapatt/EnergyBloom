export function formatNumber(value, options = {}) {
    return value.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    });
  }
  