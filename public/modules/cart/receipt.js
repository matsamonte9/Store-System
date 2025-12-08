export function fetchProductsToReceipt() {
  const receiptProductContainer = document.querySelector('.js-receipt-item');

  const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

  if (activeCart.length === 0) {
    receiptProductContainer.innerHTML = `
      <div class="empty-row-list-receipt"> No Item In The Cart</div>
    `;
    return;
  }

  receiptProductContainer.innerHTML = activeCart.map(product => {
    return `
      <div class="receipt-item-row">
        <div>${product.productName}</div>
        <div>${product.quantity}</div>
        <div>₱${(product.unitPrice * product.quantity) - (product.unitDiscount * product.quantity)}.00</div>
      </div>
    `;
  }).join('');

  function calculateTotalAmount() {
    const totalAmountContainer = document.querySelector('.js-receipt-total');

    const totalAmount = activeCart.reduce((sum, product) => {
      return sum + ((product.unitPrice * product.quantity) - (product.unitDiscount * product.quantity)); 
    }, 0);

    totalAmountContainer.textContent = `₱${totalAmount}.00`;
  }

  calculateTotalAmount();
}