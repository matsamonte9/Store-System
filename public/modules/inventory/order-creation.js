import { appState, domElements } from "../../globals.js";
import { showProducts } from "./products.js";
import { closeViewOrder } from "../orders/view-order.js"

// let isAddItemToOrderSetUp = false;

export function setUpOrderCreation() {
  createOrderHTML();
  
  // if (!isAddItemToOrderSetUp) {
    addItemToOrder();
    // isAddItemToOrderSetUp = true;
  // }
  
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
    const { data } = await axios.delete(`/api/v1/orders/${appState.currentOrderId}`);

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
    console.log(error);
  }
}

async function createNewOrder(createOrderButton, createOrderGrid, createOrderContainer) {
  try {
    const { data: { newOrder: { _id: orderId } } } = await axios.post('/api/v1/orders');

    appState.currentOrderId = orderId;
    appState.creatingOrder = true;

    showOrderUI(createOrderButton, createOrderGrid, createOrderContainer, orderId);
  } catch (error) {
    console.log(error);
  }
}

async function showOrderUI(createOrderButton, createOrderGrid, createOrderContainer, orderId = appState.currentOrderId) {
  if (!orderId) return;
  
  try {
    const { data: { order } } = await axios.get(`/api/v1/orders/${orderId}`);
    
    appState.currentOrderItems = order.items || [];

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
        <div class="create-order-header-indicator product-expired-container">
          Draft
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
      </div>
      <div class="create-order-details">
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
        
        <div class="js-service-button create-order-details-service-dropdown">
          <input type="date" class="js-create-order-delivery-date-input create-order-details-service-button" 
                 value="${order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : ''}">
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
          Price
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
    console.log('Error showing order UI:', error);
    
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
    }
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

function renderOrderedItems() {
  const itemListContainer = document.querySelector('.js-order-product-list-container');

  itemListContainer.innerHTML = appState.currentOrderItems.map(item => {
    const isEditing = item.productId === appState.editingItemId && item.itemType === appState.editingItemType;

    return `
    <div class="order-product-details-row">
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
      <div class="order-amount">
        ${item.quantity * item.unitPrice}
      </div>
      <div class="order-action">
        ${isEditing
          ? `
            <div class="js-save-item edit-order" data-product-id="${item.productId}" data-item-type="${item.itemType}"  >
              Save
            </div>
          `
          : `
            <div class="js-edit-item edit-order" data-product-id="${item.productId}" data-item-type="${item.itemType}">
              Edit
            </div>
          `
        }
        <div class="js-delete-item delete-order" data-product-id="${item.productId}" data-item-type="${item.itemType}">
          Delete
        </div>
      </div>  
    </div>
    `;
  }).join('');

  const quantityInput = itemListContainer.querySelector('.js-quantity-input');
  if (quantityInput) {
    quantityInput.focus();

    quantityInput.addEventListener('keydown', async (e) => {
      const orderId = appState.currentOrderId;
      if (e.key === 'Enter') {
        try {
          const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/items/${appState.editingItemId}?itemType=${appState.editingItemType}`, {
            quantity: quantityInput.value,
          });
          appState.editingItemId = null;
          appState.editingItemType = null;
          appState.currentOrderItems = order.items;
          renderOrderedItems();
        } catch (error) {
          console.log(error);
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
    } catch (error) {
      console.log(error);
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
      const item = appState.currentOrderItems.find(i => i.productId === productId && i.itemType === itemType);
  
      appState.editingItemId = productId;
      appState.editingItemType = item.itemType;

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

      try {
        const { data: { order } } = await axios.patch(`/api/v1/orders/${orderId}/items/${productId}?itemType=${itemType}`, {
          quantity: quantityInput.value,
        });
        appState.editingItemId = null;
        appState.editingItemType = null;
        appState.currentOrderItems = order.items;
        renderOrderedItems();
      } catch (error) {
        console.log(error);
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

      try {
        const { data: { order, msg}} = await axios.delete(`/api/v1/orders/${orderId}/items/${productId}?itemType=${itemType}`);
        appState.currentOrderItems = order.items;
        renderOrderedItems();
        console.log(msg);
      } catch (error) {
        console.log(error);
      }
    }
  });
}


function addItemToOrder() {
  // if (isAddItemToOrderSetUp) return;

  domElements.inventoryProductContainerDOM.addEventListener('click', async (e) => {
    const addEl = e.target.closest('.js-add-to-order-button');
    const replaceEl = e.target.closest('.js-replace-item-button');
    if (!addEl && !replaceEl) return;

    const productId = addEl ? addEl.dataset.productId : replaceEl.dataset.productId;
    appState.editingItemId = productId;
    const orderId = appState.currentOrderId;

    if (!orderId) {
      console.error('No active order found. Please create an order first.');
      return;
    }

    const itemType = addEl ? 'adding' : 'replacement';
    appState.editingItemType = itemType;
    const payload = addEl ? {
      productId,
      quantity: 1,
      itemType
    } : {
      productId,
      itemType 
    }

    try {
      const { data: { order }} = await axios.post(`/api/v1/orders/${orderId}/items`, payload);
      appState.currentOrderItems = order.items;

      if (itemType === 'replacement') {
        appState.editingItemId = null;
        appState.editingItemType = null;
      }

      renderOrderedItems();
      } catch (error) {
        console.log(error);
      }
  });

  // isAddItemToOrderSetUp = true;
}


// export function setUpOrderCreation() {
//   if (appState.creatingOrder) {
//     restoreExistingOrderUI();
//   } else {
//     createOrderHTML();
//   }
//   addItemToOrder();
// }

// export async function restoreExistingOrderUI() {
//   if (!appState.creatingOrder || !appState.currentOrderId) return;

//   const createOrderButton = document.querySelector('.js-create-order-button');
//   const createOrderGrid = document.querySelector('.js-create-order');
//   const createOrderContainer = document.querySelector('.js-create-order-container');

//   const cancelOrderHTML = `
//     <div class="add-product">
//       Cancel Order
//     </div>
//     <span class="material-symbols-outlined add-product-icon">
//       close
//     </span>
//   `;

//   createOrderButton.innerHTML = cancelOrderHTML;
//   createOrderButton.classList.replace('add-product-button', 'cancel-order-button');
//   createOrderGrid.classList.add('create-order');

//   createOrderButton.addEventListener('click', async () => {
//       createOrderHTML();
//   });

//   try {
//     const { data: { order } } = await axios.get(`/api/v1/orders/${appState.currentOrderId}`);
  
//     appState.currentOrderItems = order.items;

//     const html = `
//       <div class="create-order-header-container">
//         <div class="create-order-header-title">
//           Order List
//         </div>
//         <div class="create-order-header-indicator product-expired-container">
//           Draft
//         </div>
//       </div>
//       <div class="create-order-details">
//         <div class="create-order-details-name">
//           <div>
//             Supplier's Name: 
//           </div>
//           <input type="text" class="js-input-supplier-name create-order-details-name-input">
//         </div>
//       </div>
//       <div class="create-order-details">
//         <input type="hidden" class="js-order-type" value="personal">
//         <div class="js-service-button create-order-details-service-dropdown">
//           <div class="create-order-details-service-button">
//             <div class="js-service-text service-text">
//               Personal
//             </div>
//             <span class="material-symbols-outlined">
//               keyboard_arrow_down
//             </span>
//           </div>
//           <div class="js-service-modal service-modal hidden">
            
//           </div>
//         </div>
        
//         <div class="js-service-button create-order-details-service-dropdown">
//           <input type="date" class="js-create-order-delivery-date-input create-order-details-service-button">
//         </div>
//       </div>
//       <div class="order-product-details-title-container">
//         <div class="order-product-details-title">
//           Qty
//         </div>
//         <div class="order-product-details-title">
//           Name
//         </div>
//         <div class="order-product-details-title">
//           Price
//         </div>
//         <div class="order-product-details-title">
//           Total
//         </div>
//         <div class="order-product-details-title">
//         </div>
//       </div>
//       <div class="js-order-product-list-container order-products-list-container">
//         <!-- Items -->
//       </div>
//       <div class="create-order-footer-container">
//         <div class="js-finalize-order add-button">
//           Save Orders
//         </div>
//       </div>
//     `;

//     createOrderContainer.innerHTML = html;
//     createOrderContainer.classList.remove('hidden');

//     renderOrderedItems();
    
//     editItem();
//     saveItem();
//     deleteItem();
//     serviceModal();
//     saveOrder();
//   } catch (error) {
//     console.log(error);
//   }

// }

// function createOrderHTML() {
//   const createOrderButton = document.querySelector('.js-create-order-button');

//   createOrderButton.addEventListener('click', async () => {
//     const createOrderGrid = document.querySelector('.js-create-order');;
//     const createOrderContainer = document.querySelector('.js-create-order-container');

//     if (appState.creatingOrder) {
//       try {
//         const { data } = await axios.delete(`/api/v1/orders/${appState.currentOrderId}`);

//         appState.creatingOrder = false;
//         appState.currentOrderId = null;
//         showProducts();
//         domElements.bodyDOM.classList.remove('creating-order');
//         createOrderGrid.classList.remove('create-order');
//         createOrderContainer.classList.add('hidden');
//         createOrderButton.innerHTML = `
//           <div class="add-product">
//             Create Order
//           </div>
//           <span class="material-symbols-outlined add-product-icon">
//             add
//           </span>
//         `;
//         createOrderButton.classList.replace('cancel-order-button', 'add-product-button');
//       } catch (error) {
//         console.log(error);
//       }

//       return;
//     }

//     const html = `
//       <div class="create-order-header-container">
//         <div class="create-order-header-title">
//           Order List
//         </div>
//         <div class="create-order-header-indicator product-expired-container">
//           Draft
//         </div>
//       </div>
//       <div class="create-order-details">
//         <div class="create-order-details-name">
//           <div>
//             Supplier's Name: 
//           </div>
//           <input type="text" class="js-input-supplier-name create-order-details-name-input">
//         </div>
//       </div>
//       <div class="create-order-details">
//         <input type="hidden" class="js-order-type" value="personal">
//         <div class="js-service-button create-order-details-service-dropdown">
//           <div class="create-order-details-service-button">
//             <div class="js-service-text service-text">
//               Personal
//             </div>
//             <span class="material-symbols-outlined">
//               keyboard_arrow_down
//             </span>
//           </div>
//           <div class="js-service-modal service-modal hidden">
            
//           </div>
//         </div>
        
//         <div class="js-service-button create-order-details-service-dropdown">
//           <input type="date" class="js-create-order-delivery-date-input create-order-details-service-button">
//         </div>
//       </div>
//       <div class="order-product-details-title-container">
//         <div class="order-product-details-title">
//           Qty
//         </div>
//         <div class="order-product-details-title">
//           Name
//         </div>
//         <div class="order-product-details-title">
//           Price
//         </div>
//         <div class="order-product-details-title">
//           Total
//         </div>
//         <div class="order-product-details-title">
//         </div>
//       </div>
//       <div class="js-order-product-list-container order-products-list-container">
//         <!-- Items -->
//       </div>
//       <div class="create-order-footer-container">
//         <div class="js-finalize-order add-button">
//           Save Orders
//         </div>
//       </div>
//     `;

//     const createOrderBtnHTML = `
//       <div class="add-product">
//         Cancel Order
//       </div>
//       <span class="material-symbols-outlined add-product-icon">
//         close
//       </span>
//     `;

//     try {
//       const { data: { newOrder: { _id: orderId } } } = await axios.post('/api/v1/orders');

//       appState.currentOrderId = orderId;
      
//       appState.creatingOrder = true;
//       showProducts();
//       createOrderGrid.classList.add('create-order');
//       createOrderButton.innerHTML = createOrderBtnHTML;
//       createOrderButton.classList.replace('add-product-button', 'cancel-order-button');
//       createOrderContainer.innerHTML = html;
//       editItem();
//       saveItem();
//       deleteItem();
//       serviceModal();
//       createOrderContainer.classList.remove('hidden');
//       saveOrder();
//     } catch (error) {
//       console.log(error);
//     }
//   });
// }