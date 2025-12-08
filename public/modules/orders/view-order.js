import { appState, domElements } from "../../globals.js";

async function showOrder(orderId, isCompleteButton) {
  try {
    const { data: { order } } = await axios.get(`/api/v1/orders/${orderId}`);

    appState.currentPreviewOrderItems = order.items;

    const statusClass = order.status === 'draft' ? 'red' 
      : order.status === 'pending' ? 'orange'
      : 'green';

    const viewBtnForOrder = document.querySelector(
      `.js-view-order-button[data-order-id="${orderId}"]`
    );
    
    const html = `
      <div class="create-order-header-container">
        <div class="create-order-header-title">
          Order List
        </div>
        <div class="create-order-header-indicator ${statusClass}">
          ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>
      <div class="create-order-details">
        <div class="create-order-details-name">
          Supplier's Name: ${order.supplierName}
        </div>  
      </div>
      <div class="create-order-details">
        <div class="create-order-details-name">
          ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
        </div>  
        <div class="create-order-details-name">
          ${order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : ''}
        </div>  
      </div>
      <div class="${isCompleteButton ? "complete-order-product-details-title-container" : "view-order-product-details-title-container"}">
        <div class="order-product-details-title">
          Qty
        </div>
        <div class="order-product-details-title">
          Name
        </div>
        <div class="order-product-details-title">
          Price
        </div>
        ${isCompleteButton
          ? `<div class="order-product-details-title">
              Exp Date
            </div>`
          : `<div class="order-product-details-title">
              Total
            </div>`
        }
        ${isCompleteButton 
          ? `<div class="order-product-details-title">

            </div>`
          : ''
        }
      </div>
      <div class="js-view-order-products-list-container view-order-products-list-container">
        ${fetchOrderItems(appState.currentPreviewOrderItems, isCompleteButton)}
      </div>    
        ${isCompleteButton 
          ? `<div class="create-order-footer-container">
              <div class="js-complete-order add-button">
                Complete Order
              </div>
            </div>`
          : ''
        }
    `;

    turnOffPreviousButton();
    domElements.viewOrderDOM.innerHTML = html;
    domElements.bodyDOM.classList.add('viewing-order');
    domElements.viewOrderDOM.classList.remove('hidden');
    appState.currentPreviewOrderId = orderId;
    if (viewBtnForOrder) {
      viewBtnForOrder.classList.add('viewing');
    }
  } catch (error) {
    console.log(error);

    if (error.response?.status === 404) {
      console.log('Order not found, closing view panel');
      closeViewOrder();

      const viewBtn = document.querySelector(
        `.js-view-order-button[data-order-id="${orderId}"]`
      );
      if (viewBtn) {
        viewBtn.classList.remove('viewing');
      }
    }
  }
}

export function viewOrder() {
  // const viewOrderDOM = document.querySelector('.js-view-order'); 
  // const orderContainerDOM = document.querySelector('.js-order-list-container');

  if (appState.currentPreviewOrderId && appState.currentPreviewOrderAction) {
    showOrder(appState.currentPreviewOrderId, appState.currentPreviewOrderAction === 'complete');
  }

  domElements.orderContainerDOM.addEventListener('click', async (e) => {
    const viewButton = e.target.closest('.js-view-order-button');
    const completeButton = e.target.closest('.js-complete-order-button');

    if (!viewButton && !completeButton) return;

    const orderId = viewButton?.dataset.orderId || completeButton?.dataset.orderId;
    const isCompleteButton  = !!completeButton;

    appState.currentPreviewOrderAction = isCompleteButton ? 'complete' : 'view';

    const viewBtnForOrder = document.querySelector(
      `.js-view-order-button[data-order-id="${orderId}"]`
    );

    if (viewButton && viewBtnForOrder.classList.contains('viewing')) {
      // turnOffPreviousButton();
      // domElements.viewOrderDOM.innerHTML = '';
      // domElements.bodyDOM.classList.remove('viewing-order');
      // domElements.viewOrderDOM.classList.add('hidden');
      // appState.currentPreviewOrderId = null;
      // appState.currentPreviewOrderAction = null;
      closeViewOrder();
      return;
    }
    
    showOrder(orderId, isCompleteButton);
  });
}

function turnOffPreviousButton() {
  const previousViewingOrder = document.querySelector('.viewing');

  if (previousViewingOrder) {
    previousViewingOrder.classList.remove('viewing');
  }
}

export function closeViewOrder() {
  turnOffPreviousButton();
  domElements.viewOrderDOM.innerHTML = '';
  domElements.bodyDOM.classList.remove('viewing-order');
  domElements.viewOrderDOM.classList.add('hidden');
  appState.currentPreviewOrderId = null;
  appState.currentPreviewOrderAction = null;
}

export function partialCloseViewingOrder() {
  if (domElements.viewOrderDOM) {
    domElements.viewOrderDOM.classList.add('hidden');
    domElements.bodyDOM.classList.remove('viewing-order');
  }
}

export function fetchOrderItems(items, completeButton) {
  return items.map(item => {
    const isEditing = item.productId === appState.previewEditingItemId && item.itemType === appState.previewEditingItemType;
    return `
      <div class="${completeButton ? "complete-order-product-details-row" : "view-order-product-details-row"}">
        <div class="order-qty">
          ${isEditing
            ? `<input type="number" class="js-quantity-input quantity-input" value="${item.quantity}" autofocus>` 
            : `${item.quantity}${item.itemType === 'replacement' ? '(r)' : ''}`
          }
        </div>
        <div class="order-name">
          ${item.productName}
        </div>
        <div class="order-unit-price">
          ${item.unitPrice}
        </div>
        ${completeButton 
          ? (isEditing
              ? `<input type="date" class="js-expiration-date-input item-expiration-date no-picker" value="${item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : ''}">`
              : `<div class="order-expiration-date-text">
                  ${item.expirationDate
                      ? new Date(item.expirationDate).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                        })
                      : 'mm/dd/yyyy'
                  }
                </div>`
            )
          : `<div class="order-amount">
              ${item.totalPrice}
            </div>`
        }
        ${completeButton
          ? `<div class="order-action">
                ${isEditing
                  ? `
                    <div class="js-save-item-order edit-action" data-product-id="${item.productId}" data-item-type="${item.itemType}"  >
                      Save
                    </div>
                  `
                  : `
                    <div class="js-edit-item-order edit-action" data-product-id="${item.productId}" data-item-type="${item.itemType}">
                      Edit
                    </div>
                  `
                }
                <div class="js-delete-item-order delete-action" data-product-id="${item.productId}" data-item-type="${item.itemType}">
                  Delete
                </div>
            </div>`
          : ''
        }
      </div>
    `;
  }).join('');
}