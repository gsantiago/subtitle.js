export const padLeft = (value: number, length = 2): string =>
  value.toString().padStart(length, '0')
