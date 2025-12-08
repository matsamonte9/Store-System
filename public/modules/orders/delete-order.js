import { domElements } from "../../globals.js";

import { fetchOrders } from "./orders.js";

export function deleteOrder() {
  // const orderContainerDOM = document.querySelector('.js-order-list-container');

  domElements.orderContainerDOM.addEventListener('click', async (e) => {
    const deleteButton = e.target.closest('.js-delete-order-button');
    if (!deleteButton) return;

    try {
      const orderId = deleteButton.dataset.orderId;
      const { data } = await axios.delete(`/api/v1/orders/${orderId}`);

      const activeNav = document.querySelector('.js-nav-bar-button.on-this-nav');
      if (activeNav) {
        await fetchOrders(activeNav.dataset.status, activeNav);
      }
    } catch (error) {
      console.log(error);
    }
  });
}