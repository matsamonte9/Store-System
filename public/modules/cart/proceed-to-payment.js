import { appState } from "../../globals.js";
import { fetchProductsFromCart } from "./cart.js";
import { paymentModal } from "./payment-modal.js";

import { errorModal } from "../shared/modals.js";

export function proceedToPayment() {
  const proceedToPaymentButton = document.querySelector('.js-proceed-to-payment-button');

  proceedToPaymentButton.addEventListener('click', async () => {
    const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

    const forceOverride = appState.stockWarnings.length > 0
      ? confirm('Some items include expired stock. Continue anyway?')
      : false;

    if (appState.stockWarnings.length > 0 && !forceOverride) {
      return;
    }

    try {
      const { data: { cartToken, totalAmount }} = await axios.post(
        `/api/v1/cart/validate-cart-items`,
        {
          items: activeCart.map(p => ({
            productId: p.productId,
            quantity: Number(p.quantity),
            discount: Number(p.unitDiscount) || 0,
          })),
          forceOverride
        }, {
          withCredentials: true
        }
      );

      appState.cartToken = cartToken;
      appState.stockWarnings = [];

      fetchProductsFromCart();
      paymentModal(totalAmount);
    } catch (error) {
      if (error.response?.status === 409) {
        appState.stockWarnings = error.response.data.errors || [];
        fetchProductsFromCart();
        return;
      }

      const errmsg = error.response.data.msg;
      errorModal(errmsg);
    }
  });
}