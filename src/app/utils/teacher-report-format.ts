/** Форматирование числа в отчётах: целое без дроби, иначе до 2 знаков (запятая). */
export function formatReportNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const rounded = Math.round(value * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) {
    return String(Math.round(rounded));
  }
  return rounded.toFixed(2).replace('.', ',');
}

/** Проценты и коэффициенты отклонения в отчётах. */
export function formatReportPercent(value: number): string {
  return `${formatReportNumber(value)}%`;
}

/** Целое значение (рекомендуемая оценка). */
export function formatReportInteger(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return String(Math.round(value));
}
