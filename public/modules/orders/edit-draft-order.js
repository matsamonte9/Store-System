import { appState, domElements } from "../../globals.js";

export function editDraftOrder() {
  domElements.orderContainerDOM.addEventListener('click', (e) => {
    const editDraftButton = e.target.closest('.js-edit-draft-order-button');
    if (!editDraftButton) return;

    const orderId = editDraftButton.dataset.orderId;

    appState.currentOrderId = orderId;
    appState.creatingOrder = true;

    document.querySelector('.js-sidebar-inventory').click();
  });
}