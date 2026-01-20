import { appState, domElements } from "../../globals.js";
import { fetchOrderItems } from "./view-order.js";

import { successModal, errorModal } from "../shared/modals.js";

let isItemsActionOrdersInitialized = false;

export function itemsActionOrders() {
  if (isItemsActionOrdersInitialized) {
    return;
  }

  isItemsActionOrdersInitialized = true;

  domElements.viewOrderDOM.addEventListener('click', async (e) => {
    const orderId = appState.currentPreviewOrderId;

    const editItemButton = e.target.closest('.js-edit-item-order');
    const deleteItemButton = e.target.closest('.js-delete-item-order');
    const saveItemButton = e.target.closest('.js-save-item-order');
    
    const itemsContainer = domElements.viewOrderDOM.querySelector('.js-view-order-products-list-container');

    if (editItemButton) {
      const productId = editItemButton.dataset.productId;
      const itemType = editItemButton.dataset.itemType;
      const batchId = editItemButton.dataset.batchId || null;

      appState.editingOrderedItem.productId = productId;
      appState.editingOrderedItem.itemType = itemType;
      appState.editingOrderedItem.batchId = batchId;

      itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);

      const row = itemsContainer.querySelector(
        `.complete-order-product-details-row [data-product-id="${productId}"][data-item-type="${itemType}"]${batchId ? `[data-batch-id="${batchId}"]` : ''}`
      ).closest('.complete-order-product-details-row');

  const quantityInput = row.querySelector('.js-quantity-input');
  const expirationDateInput = row.querySelector('.js-expiration-date-input');

  const saveChanges = async () => {
    try {
      const { data: { order } } = await axios.patch(`/api/v1/orders/${appState.currentPreviewOrderId}/ordered/items/${productId}`, {
        quantity: quantityInput.value,
        expirationDate: expirationDateInput ? expirationDateInput.value || null : null,
      }, {
        params: { itemType, batchId },
        withCredentials: true,
      });

      appState.editingOrderedItem.productId = null;
      appState.editingOrderedItem.itemType = null;
      appState.editingOrderedItem.batchId = null;
      appState.currentPreviewOrderItems = order.items;
      itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);
    } catch (err) {
      const errmsg = error.response.data.msg;
      errorModal(errmsg);
    }
  };

  quantityInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (expirationDateInput) {
        expirationDateInput.focus();
      } else {
        await saveChanges();
      }
    }
  });

  if (expirationDateInput) {
    expirationDateInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        await saveChanges();
      }
    });
  }


    } else if (saveItemButton) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const row = saveItemButton.closest('.complete-order-product-details-row');
      const quantityInput = row.querySelector('.js-quantity-input');
      const expirationDateInput = row.querySelector('.js-expiration-date-input');
      const expirationDateValue = expirationDateInput ? expirationDateInput.value || null : null;
      const productId = saveItemButton.dataset.productId;
      const itemType = saveItemButton.dataset.itemType;
      const batchId = saveItemButton.dataset.batchId || null;

      try {
        const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/ordered/items/${productId}`, 
        {
          quantity: quantityInput.value,
          expirationDate: expirationDateValue,
        },
        {
          params: {
            itemType,
            batchId,
          },
          withCredentials: true,
        }
      );
        appState.editingOrderedItem.productId = null;
        appState.editingOrderedItem.itemType = null;
        appState.editingOrderedItem.batchId = null;
        appState.currentPreviewOrderItems = order.items;
        itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);
      } catch (error) {
        const errmsg = error.response.data.msg;
        errorModal(errmsg);
      }
    } else if (deleteItemButton) {
      const productId = deleteItemButton.dataset.productId;
      const itemType = deleteItemButton.dataset.itemType;
      const batchId = deleteItemButton.dataset.batchId || undefined;

      const params = {
        itemType
      };
      
      if (batchId) {
        params.batchId = batchId;
      }

      try {
        const { data: { order, msg } } = await axios.delete(`/api/v1/orders/${orderId}/items/${productId}`, 
          {
            params: params,
            withCredentials: true,
          }
        );
        appState.editingOrderedItem.productId = null;
        appState.editingOrderedItem.itemType = null;
        appState.editingOrderedItem.batchId = null;
        appState.currentPreviewOrderItems = order.items;
        itemsContainer.innerHTML = fetchOrderItems(appState.currentPreviewOrderItems, true);
        console.log(msg);
      } catch (error) {
        const errmsg = error.response.data.msg;
        errorModal(errmsg);
      }
    } else {
      return;
    }
  });

  return;
}