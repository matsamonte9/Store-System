import { fetchProductsFromCart } from "./cart.js";
import { fetchProductsToReceipt } from "./receipt.js";

export function completeCartAndPrintReceipt() {
  const printReceiptButton = document.querySelector('.js-print-receipt');

  printReceiptButton.addEventListener('click', async () => {
    const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

    try {
      const { data: { msg }} = await axios.patch(`/api/v1/products/cart/decrease-stock`, {
        items: activeCart.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
        }))
      });

      localStorage.removeItem('activeCart');
      fetchProductsFromCart();
      fetchProductsToReceipt();

      alert(msg);
    } catch (error) {
      console.log(error);
    }
  });
}