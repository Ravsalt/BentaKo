/**
 * Safe price formatting function with additional checks
 */
export const formatPrice = (price: unknown): string => {
  try {
    if (price === null || price === undefined || price === '') return '0.00';
    const num = Number(price);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  } catch (error) {
    console.error('Error formatting price:', { price, error });
    return '0.00';
  }
};
