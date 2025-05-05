export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};