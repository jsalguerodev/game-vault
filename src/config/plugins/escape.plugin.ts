export const escape = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
