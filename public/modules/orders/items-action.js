import { appState, domElements } from "../../globals.js";
import { fetchOrderItems } from "./view-order.js";

export function itemsActionOrders() {
  domElements.viewOrderDOM.addEventListener('click', async (e) => {
    const orderId = appState.currentPreviewOrderId;

    const editItemButton = e.target.closest('.js-edit-item-order');
    const deleteItemButton = e.target.closest('.js-delete-item-order');
    const saveItemButton = e.target.closest('.js-save-item-order');
    
    const itemsContainer = domElements.viewOrderDOM.querySelector('.js-view-order-products-list-container');

    if (editItemButton) {
      const productId = editItemButton.dataset.productId;
      const itemType = editItemButton.dataset.itemType;

      appState.previewEditingItemId = productId;
      appState.previewEditingItemType = itemType;

      itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);

      const quantityInput = itemsContainer.querySelector('.js-quantity-input');
      const expirationDateInput = itemsContainer.querySelector('.js-expiration-date-input');

      quantityInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          expirationDateInput.focus();
        }
      });

      expirationDateInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();

          try {
            const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/items/${productId}?itemType=${itemType}`, {
              quantity: quantityInput.value,
              expirationDate: expirationDateInput.value ? new Date(expirationDateInput.value) : null,
            });

            appState.previewEditingItemId = null;
            appState.previewEditingItemType = null;
            appState.currentPreviewOrderItems = order.items;
            itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);
          } catch (error) {
            console.log(error);
          }
        }
      });

    } else if (saveItemButton) {
      const row = saveItemButton.closest('.complete-order-product-details-row');
      const quantityInput = row.querySelector('.js-quantity-input');
      const expirationDateInput = row.querySelector('.js-expiration-date-input');
      const productId = saveItemButton.dataset.productId;
      const itemType = saveItemButton.dataset.itemType;

      try {
        const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/items/${productId}?itemType=${itemType}`, {
          quantity: quantityInput.value,
          expirationDate: expirationDateInput.value ? new Date(expirationDateInput.value) : null,
        });
        appState.previewEditingItemId = null;
        appState.previewEditingItemType = null;
        appState.currentPreviewOrderItems = order.items;
        itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);
      } catch (error) {
        console.log(error);
      }
    } else if (deleteItemButton) {
      const productId = deleteItemButton.dataset.productId;
      const itemType = deleteItemButton.dataset.itemType;

      const { data: { order, msg } } = await axios.delete(`/api/v1/orders/${orderId}/items/${productId}?itemType=${itemType}`);
      appState.currentPreviewOrderItems = order.items;
      itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);
      console.log(msg);
    } else {
      return;
    }
  });

  return;
}