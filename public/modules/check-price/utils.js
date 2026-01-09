export function getExpirationClass(status) {
  return status === 'expired'
    ? 'product-expired-container'
    : status === 'expiring-soon'
    ? 'product-expiring-container'
    : status === 'fresh'
    ? 'product-good-container'
    : '';
}

export function getStockClass(status) {
  return status === 'out of stock'
    ? 'product-out-of-stock-container'
    : status === 'low stock'
    ? 'product-low-stock-container'
    : status === 'high stock'
    ? 'product-high-stock-container'
    : ''
}