export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' EHBGC';
}

export function isValidAmount(amount: number): boolean {
  return amount > 0;
}
