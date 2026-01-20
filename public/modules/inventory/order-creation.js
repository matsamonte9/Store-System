import { appState, domElements } from "../../globals.js";
import { showProducts } from "./products.js";
import { closeViewOrder } from "../orders/view-order.js";

import { successModal, errorModal } from "../shared/modals.js";

export function setUpOrderCreation() {
  createOrderHTML();
  addItemToOrder();
  
  if (appState.creatingOrder && appState.currentOrderId) {
    showExistingOrderUI();
  }
}

function createOrderHTML() {
  const createOrderButton = document.querySelector('.js-create-order-button');
  if (!createOrderButton) return;
  
  createOrderButton.removeEventListener('click', handleOrderButtonClick);
  
  createOrderButton.addEventListener('click', handleOrderButtonClick);
}

async function handleOrderButtonClick() {
  const createOrderButton = document.querySelector('.js-create-order-button');
  const createOrderGrid = document.querySelector('.js-create-order');
  const createOrderContainer = document.querySelector('.js-create-order-container');

  if (appState.creatingOrder) {
    await cancelOrder(createOrderButton, createOrderGrid, createOrderContainer);
  } else {
    await createNewOrder(createOrderButton, createOrderGrid, createOrderContainer);
  }

  showProducts(
    appState.currentName,
    appState.currentSort,
    appState.currentFilter,
    appState.currentLimit,
    appState.currentPage
  );
}

async function cancelOrder(createOrderButton, createOrderGrid, createOrderContainer) {
  try {
    const { data } = await axios.delete(`/api/v1/orders/${appState.currentOrderId}`, {
      withCredentials: true
    });

    appState.creatingOrder = false;
    appState.currentOrderId = null;
    domElements.bodyDOM.classList.remove('creating-order');
    createOrderGrid.classList.remove('create-order');
    createOrderContainer.classList.add('hidden');
    
    createOrderButton.innerHTML = `
      <div class="add-product">
        Create Order
      </div>
      <span class="material-symbols-outlined add-product-icon">
        add
      </span>
    `;
    createOrderButton.classList.replace('cancel-order-button', 'add-product-button');

    if (appState.currentPreviewOrderId === appState.currentOrderId) {
      closeViewOrder();
      
      const viewBtn = document.querySelector(
        `.js-view-order-button[data-order-id="${appState.currentOrderId}"]`
      );
      if (viewBtn) {
        viewBtn.classList.remove('viewing');
      }
    }
  } catch (error) {
    const errmsg = error.response.data.msg;
    errorModal(errmsg);
  }
}

async function createNewOrder(createOrderButton, createOrderGrid, createOrderContainer) {
  try {
    const { data: { newOrder: { _id: orderId } } } = await axios.post('/api/v1/orders', {
      withCredentials: true
    });

    appState.currentOrderId = orderId;
    appState.creatingOrder = true;

    showOrderUI(
      createOrderButton, 
      createOrderGrid, 
      createOrderContainer, orderId
    );
  } catch (error) {
    const errmsg = error.response.data.msg;
    errorModal(errmsg);
  }
}

async function showOrderUI(createOrderButton, createOrderGrid, createOrderContainer, orderId = appState.currentOrderId) {
  if (!orderId) return;
  
  try {
    const { data: { order } } = await axios.get(`/api/v1/orders/${orderId}`, {
      withCredentials: true
    });
    
    appState.currentOrderItems = order.items || [];
    domElements.bodyDOM.classList.add('creating-order');

    createOrderButton.innerHTML = `
      <div class="add-product">
        Cancel Order
      </div>
      <span class="material-symbols-outlined add-product-icon">
        close
      </span>
    `;
    createOrderButton.classList.replace('add-product-button', 'cancel-order-button');
    
    createOrderGrid.classList.add('create-order');
    
    const html = `
      <div class="create-order-header-container">
        <div class="create-order-header-title">
          Order List
        </div>
        <div class="order-details-and-error">
          <div class="create-order-header-indicator product-expired-container">
            Draft
          </div>
          <div class="js-warning-icon-order-status warning-icon-container hidden">
            <span class="material-symbols-outlined warning-icon-cart" style="color: #f44336">
              warning
            </span>
            <div class="js-error-order-status order-creation-tooltip">
              
            </div>
          </div>
        </div>
      </div>
      <div class="create-order-details">
        <div class="create-order-details-name">
          <div>
            Supplier's Name: 
          </div>
          <input type="text" class="js-input-supplier-name create-order-details-name-input" 
                 value="${order.supplierName || ''}">
        </div>
        <div class="js-warning-icon-supplierName warning-icon-container hidden">
          <span class="material-symbols-outlined warning-icon-cart" style="color: #f44336">
            warning
          </span>
          <div class="js-error-supplierName order-creation-tooltip">
            
          </div>
        </div>
      </div>
      <div class="create-order-details">
        <div class="order-details-and-error">
          <input type="hidden" class="js-order-type" value="${order.orderType || 'personal'}">
          <div class="js-service-button create-order-details-service-dropdown">
            <div class="create-order-details-service-button">
              <div class="js-service-text service-text">
                Personal
              </div>
              <span class="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </div>
            <div class="js-service-modal service-modal hidden">
              
            </div>
          </div>
          <div class="js-warning-icon-orderType warning-icon-container hidden">
            <span class="material-symbols-outlined warning-icon-cart" style="color: #f44336">
              warning
            </span>
            <div class="js-error-orderType order-creation-tooltip">
              
            </div>
          </div>
        </div>
        
        <div class="order-details-and-error">
          <div class="js-service-button create-order-details-service-dropdown">
          <input type="date" class="js-create-order-delivery-date-input create-order-details-service-button" 
                 value="${order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : ''}">
          </div>
          <div class="js-warning-icon-deliveryDate warning-icon-container hidden">
            <span class="material-symbols-outlined warning-icon-cart" style="color: #f44336">
              warning
            </span>
            <div class="js-error-deliveryDate order-creation-tooltip">
              
            </div>
          </div>
        </div>
      </div>
      <div class="order-product-details-title-container">
        <div class="order-product-details-title">
          Qty
        </div>
        <div class="order-product-details-title">
          Name
        </div>
        <div class="order-product-details-title">
          Cost
        </div>
        <div class="order-product-details-title">
          Total
        </div>
        <div class="order-product-details-title">
        </div>
      </div>
      <div class="js-order-product-list-container order-products-list-container">
        <!-- Items will be rendered by renderOrderedItems -->
      </div>
      <div class="js-error-orders-length empty-row-list-order-creation hidden">
        <div style="color: red">
          No Item In The Cart
        </div>
      </div>
      <div class="create-order-footer-container">
        <div class="js-finalize-order add-button">
          Save Order
        </div>
      </div>
    `;
    
    createOrderContainer.innerHTML = html;
    createOrderContainer.classList.remove('hidden');
    
    renderOrderedItems();
    editItem();
    saveItem();
    deleteItem();
    serviceModal();
    saveOrder();
  } catch (error) {  
    if (error.response?.status === 404) {
      appState.creatingOrder = false;
      appState.currentOrderId = null;
      appState.currentOrderItems = [];
      
      createOrderGrid.classList.remove('create-order');
      createOrderContainer.classList.add('hidden');
      createOrderButton.innerHTML = `
        <div class="add-product">
          Create Order
        </div>
        <span class="material-symbols-outlined add-product-icon">
          add
        </span>
      `;
      createOrderButton.classList.replace('cancel-order-button', 'add-product-button');

      return;
    }

    const errmsg = error.response.data.msg;
    errorModal(errmsg);
  }
}

async function showExistingOrderUI() {
  const createOrderButton = document.querySelector('.js-create-order-button');
  const createOrderGrid = document.querySelector('.js-create-order');
  const createOrderContainer = document.querySelector('.js-create-order-container');
  
  if (!createOrderButton || !createOrderGrid || !createOrderContainer) {
    console.log('Order UI elements not found yet');
    return;
  }
  
  await showOrderUI(createOrderButton, createOrderGrid, createOrderContainer);
}

function renderRow({ qty, name, price, amount, productId, itemType, batchId = null, isEditing }) {
  return `
    <div class="order-product-details-row">
      ${isEditing
        ? `<input type="number" class="js-quantity-input quantity-input" value="${qty}" autofocus>` 
        : `${qty}${itemType === 'replacement' ? '(r)' : ''}`
      }
      <div class="order-name">
        ${name}
      </div>
      <div class="order-unit-price">${price}</div>
      <div class="order-amount">${amount}</div>
      <div class="order-action">
        ${isEditing
          ? `
            <div class="js-save-item edit-order" 
              data-product-id="${productId}" 
              data-item-type="${itemType}"  
              ${batchId ? `data-batch-id="${batchId}"` : ''}
            >
              Save
            </div>
          `
          : `
            <div class="js-edit-item edit-order" 
              data-product-id="${productId}" 
              data-item-type="${itemType}"
              ${batchId ? `data-batch-id="${batchId}"` : ''}
            >
              Edit
            </div>
          `
        }
        <div class="js-delete-item delete-order"
          data-product-id="${productId}"
          data-item-type="${itemType}"
          ${batchId ? `data-batch-id="${batchId}"` : ''}
        >
          Delete
        </div>
      </div>
    </div>
  `;
}


function renderOrderedItems() {
  const itemListContainer = document.querySelector('.js-order-product-list-container');

  let html = '';

  appState.currentOrderItems.forEach(item => {
    if (item.itemType === 'adding') {
      const isEditing =
        appState.editingCreatingOrderItem.productId === item.productId &&
        appState.editingCreatingOrderItem.itemType === 'adding';

      html += renderRow({
        qty: item.quantity,
        name: item.productName,
        price: item.unitPrice,
        amount: item.quantity * item.unitPrice,
        productId: item.productId,
        itemType: 'adding',
        isEditing,
      });
    }

    if (item.itemType === 'replacement') {
      item.replacements.forEach(batch => {
        const isEditing =
          appState.editingCreatingOrderItem.productId === item.productId &&
          appState.editingCreatingOrderItem.itemType === 'replacement' &&
          appState.editingCreatingOrderItem.batchId === batch.batchId;

        html += renderRow({
          qty: batch.quantity,
          name: item.productName,
          price: item.unitPrice,
          amount: batch.quantity * item.unitPrice,
          productId: item.productId,
          itemType: 'replacement',
          batchId: batch.batchId,
          isEditing
        });
      });
    }
  });

  itemListContainer.innerHTML = html;

  const emptyErrorDOM = document.querySelector('.js-error-orders-length');

  if (appState.currentOrderItems.length !== 0) {
    emptyErrorDOM.classList.add('hidden');
  }

  const quantityInput = itemListContainer.querySelector('.js-quantity-input');
  
  if (quantityInput) {
    quantityInput.focus();

    quantityInput.addEventListener('keydown', async (e) => {

      const { productId, itemType, batchId } = appState.editingCreatingOrderItem;
      const orderId = appState.currentOrderId;

      if (e.key === 'Enter') {
        try {
          const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/create-order/items/${productId}`, 
          { quantity: quantityInput.value },
          {
            params: {
              itemType,
              batchId
            }, 
            withCredentials: true
          }
        );

          appState.editingCreatingOrderItem = {
            productId: null,
            itemType: null,
            batchId: null
          }

          appState.currentOrderItems = order.items;
          renderOrderedItems();
        } catch (error) {
          const errmsg = error.response.data.msg;
          errorModal(errmsg);
        }
      }
    });
  }
}

function serviceModal() {
  const serviceDOM = document.querySelector('.js-service-button');
  const serviceModalDOM = document.querySelector('.js-service-modal');

  serviceDOM.addEventListener('click', () => {
    const isHidden = serviceModalDOM.classList.contains('hidden');

    const html = `
      <div class="option option-divider" data-service="personal"> 
        Personal
      </div>
      <div class="option option-divider" data-service="delivery"> 
        Delivery 
      </div>
      <div class="option option-divider" data-service="pickup"> 
        Pick Up
      </div>
    `;

    if (isHidden) {
      serviceModalDOM.classList.remove('hidden');
      serviceModalDOM.innerHTML = html;
    } else {
      serviceModalDOM.classList.add('hidden');
    }

    serviceModalDOM.addEventListener('click', (e) => {
      if (e.target.classList.contains('option')) {
        const service = e.target.dataset.service;
        const serviceText = document.querySelector('.js-service-text');
        const orderTypeInput = document.querySelector('.js-order-type');

        serviceText.textContent = 
          service === 'personal' ? 'Personal'  :
          service === 'delivery' ? 'Delivery' :
          service === 'pickup' ? 'Pick Up' :
          'Personal'

        orderTypeInput.value = service;
      }
    });
  });
}

function saveOrder() {
  const saveOrderButton = document.querySelector('.js-finalize-order');
  const supplierNameInputDOM = document.querySelector('.js-input-supplier-name');
  const createOrderGrid = document.querySelector('.js-create-order');
  const createOrderContainer = document.querySelector('.js-create-order-container');
  const createOrderButton = document.querySelector('.js-create-order-button');

  saveOrderButton.addEventListener('click', async () => {
    try {
      const orderId = appState.currentOrderId;
      const supplierName = supplierNameInputDOM.value.trim();
      const orderType = document.querySelector('.js-order-type').value;
      const deliveryDate = document.querySelector('.js-create-order-delivery-date-input').value;

      const { data } = await axios.patch(`/api/v1/orders/${orderId}`,{ 
        supplierName,
        orderType,
        deliveryDate,
      }, {
        withCredentials: true
      });
      console.log(data.msg);
      domElements.bodyDOM.classList.remove('creating-order');
      createOrderGrid.classList.remove('create-order');
      createOrderContainer.classList.add('hidden');
      createOrderButton.innerHTML = `
        <div class="add-product">
          Create Order
        </div>
        <span class="material-symbols-outlined add-product-icon">
          add
        </span>
      `;
      createOrderButton.classList.replace('cancel-order-button', 'add-product-button');
      appState.creatingOrder = false;
      appState.currentOrderId = null;
      showProducts(
        appState.currentName,
        appState.currentSort,
        appState.currentFilter,
        appState.currentLimit,
        appState.currentPage
      );

      successModal(data.msg);
    } catch (error) {
      const errmsg = error.response.data.msg;
      const path = error.response.data.path;

      if (path) {
        if (path === 'orders-length') {
          const errorTextDisplay = document.querySelector(`.js-error-${path}`);

          errorTextDisplay.classList.remove('hidden');
        } else {
          const warningIcon = document.querySelector(`.js-warning-icon-${path}`);
          const tooltip = document.querySelector(`.js-error-${path}`);

          warningIcon.classList.remove('hidden');
          tooltip.textContent = errmsg;
        }
      } else {
        errorModal(errmsg);
      }
    }
  });
}

function editItem() {
  const itemListContainer = document.querySelector('.js-order-product-list-container');

  itemListContainer.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.classList.contains('js-edit-item')) {
      const productId = el.dataset.productId;
      const itemType = el.dataset.itemType;
      const batchId = el.dataset.batchId || null;

      appState.editingCreatingOrderItem = {
        productId,
        itemType,
        batchId,
      }

      renderOrderedItems();
    }
  });
}

function saveItem() {
  const itemListContainer = document.querySelector('.js-order-product-list-container');
  const orderId = appState.currentOrderId;

  itemListContainer.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.classList.contains('js-save-item')) {
      const row = el.closest('.order-product-details-row');
      const quantityInput = row.querySelector('.js-quantity-input');
      const productId = el.dataset.productId;
      const itemType = el.dataset.itemType;
      const batchId = el.dataset.batchId || null;

      try {
        const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/create-order/items/${productId}`, 
          { quantity: quantityInput.value }, 
          {
            params: {
              itemType,
              batchId
            },
            withCredentials: true
          }
        );

        appState.editingCreatingOrderItem = {
          productId: null,
          itemType: null,
          batchId: null
        }

        appState.currentOrderItems = order.items;
        renderOrderedItems();
      } catch (error) {
        const errmsg = error.response.data.msg;
        errorModal(errmsg);
      }
    }
  });
}

function deleteItem() {
  const itemListContainer = document.querySelector('.js-order-product-list-container');
  const orderId = appState.currentOrderId;

  itemListContainer.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.classList.contains('js-delete-item')) {
      const productId = el.dataset.productId;
      const itemType = el.dataset.itemType;
      const batchId = el.dataset.batchId || null;

      try {
        const { data: { order, msg } } = await axios.delete(`/api/v1/orders/${orderId}/items/${productId}`, 
          {
            params: {
              itemType,
              batchId
            },
            withCredentials: true
          }
        );
        appState.currentOrderItems = order.items;

        appState.editingCreatingOrderItem = {
          productId: null,
          itemType: null,
          batchId: null,
        };

        renderOrderedItems();
      } catch (error) {
        const errmsg = error.response.data.msg;
        errorModal(errmsg);
      }
    }
  });
}

function addItemToOrder() {
  domElements.inventoryProductContainerDOM.addEventListener('click', async (e) => {
    const addEl = e.target.closest('.js-add-to-order-button');
    const replaceEl = e.target.closest('.js-replace-item-button');
    if (!addEl && !replaceEl) return;

    const productId = addEl ? addEl.dataset.productId : replaceEl.dataset.productId;
    const batchId = replaceEl ? replaceEl.dataset.batchId : null;
    appState.editingCreatingOrderItem.productId = productId;
    const orderId = appState.currentOrderId;

    if (!orderId) {
      console.error('No active order found. Please create an order first.');
      return;
    }

    const itemType = addEl ? 'adding' : 'replacement';
    appState.editingCreatingOrderItem.itemType = itemType;
    const payload = addEl ? {
      productId,
      quantity: 1,
      itemType
    } : {
      productId,
      itemType,
      replacements: {
        batchId
      }
    }

    try {
      const { data: { order }} = await axios.post(`/api/v1/orders/${orderId}/items`, payload, {
        withCredentials: true
      });
      appState.currentOrderItems = order.items;

      if (itemType === 'replacement') {
        appState.editingCreatingOrderItem.productId = null;
        appState.editingCreatingOrderItem.itemType = null;
      }

      renderOrderedItems();
    } catch (error) {
      const errmsg = error.response.data.msg;
      errorModal(errmsg);
    }
  });
}