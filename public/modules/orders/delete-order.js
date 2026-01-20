import { appState, domElements } from "../../globals.js";

import { fetchOrders } from "./orders.js";

import { successModal, errorModal } from "../shared/modals.js";

export function deleteOrderModal() {
  domElements.orderContainerDOM.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.js-delete-order-button');
    if (!deleteButton) return;

    const previousViewingOrder = document.querySelector('.viewing');

    const orderId = deleteButton.dataset.orderId;

    const html = `
      <div class="js-modal-overlay modal-overlay">
        <div class="warning-modal-content-container">
          <div class="modal-content">
            <div class="modal-header">
            </div>

            <div class="modal-body">
              <div class="warning-modal-body">
                <div class="warning-logo-container logo-container">
                  <img src="./warning-delete-logo.png" class="warning-logo">
                </div>
                <div class="warning-title">
                  Delete
                </div>
                <div class="warning-subtitle">
                  Are you sure you would like to do this?
                </div>
              </div>
            </div>
            
            <div class="warning-modal-footer">
              <div class="js-cancel-button cancel-button">
                Cancel
              </div>
              <div class="js-confirm-button confirm-button">
                Confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const overlayDOM = document.querySelector('.js-modal-overlay');
    const closeButton = overlayDOM.querySelector('.js-cancel-button');
    const confirmButton = overlayDOM.querySelector('.js-confirm-button');

    overlayDOM.addEventListener('click', (e) => {
      if (e.target === overlayDOM || e.target === closeButton) {
        overlayDOM.remove();
      }
    });

    confirmButton.addEventListener('click', async () => {
      try {
        const { data } = await axios.delete(`/api/v1/orders/${orderId}`, {
          withCredentials: true,
        });

        const activeNav = document.querySelector('.js-nav-bar-button.on-this-nav');
        if (activeNav) {
          await fetchOrders(
            activeNav.dataset.status, 
            activeNav
          );
        }

        appState.currentPreviewOrderId = null;
        domElements.viewOrderDOM.innerHTML = '';
        domElements.bodyDOM.classList.remove('viewing-order');
        domElements.viewOrderDOM.classList.add('hidden');
        if (previousViewingOrder) previousViewingOrder.classList.remove('viewing');

        overlayDOM.remove();
        successModal(data.msg);
      } catch (error) {
        const errmsg = error.response?.data?.msg || error.message;
        errorModal(errmsg);
      }
    });
  });
}