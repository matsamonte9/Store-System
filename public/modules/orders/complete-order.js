import { appState, domElements } from "../../globals.js";
import { fetchOrders } from "./orders.js";

let completeOrderInitialized = false;

export function completeOrder() {
  if (completeOrderInitialized) {
    return;
  }
  
  completeOrderInitialized = true;
  
  domElements.viewOrderDOM.addEventListener('click', async (e) => {
    const completeOrderButton = e.target.closest('.js-complete-order');
    if (!completeOrderButton) {
      return;
    }

    const previousViewingOrder = document.querySelector('.viewing');

    const orderId = appState.currentPreviewOrderId;
    if (!orderId) return;

    try {
      const { data } = await axios.patch(`/api/v1/orders/${orderId}`, {}, {
        withCredentials: true,
      });
      
      const activeNav = document.querySelector('.js-nav-bar-button.on-this-nav');
      if (activeNav) {
        await fetchOrders(activeNav.dataset.status, activeNav);
      }

      appState.currentPreviewOrderId = null;
      domElements.viewOrderDOM.innerHTML = '';
      domElements.bodyDOM.classList.remove('viewing-order');
      domElements.viewOrderDOM.classList.add('hidden');
      previousViewingOrder.classList.remove('viewing');
    } catch (error) {
      console.log('❌ Error:', error);
    }
  });
}