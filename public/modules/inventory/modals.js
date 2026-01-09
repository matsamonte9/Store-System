import { successModal, errorModal } from "../shared/modals.js";
import { appState, domElements } from "../../globals.js";
import { showProducts } from "./products.js";

export function setUpModals() {
  addProductModal();
  editProductModal();
  deleteProductModal();
  addBatchModal();
  editBatchModal();
  deleteBatchModal();
}

function addProductModal() {
  const html = `
    <div class="js-modal-overlay modal-overlay">
        <div class="modal-content-container">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">
                Add New Product
              </div>
              <div class="js-modal-close-button modal-close-button">
                X
              </div>
            </div>

            <div class="modal-body">

            <div class="input-container">
              <div class="modal-form-title">
                Product Name <span class="asterisk"> * </span>
              </div>
              <div class="input-area">
                <input class="js-input-name modal-input long-input" type="text" placeholder="Product Name">
              </div>
              <div class="js-error-name modal-form-error">
                
              </div>
            </div>

            <div class="input-container">
              <div class="modal-form-title">
                Barcode <span class="asterisk"> * </span>
              </div>
              <div class="input-area">
                <input class="js-input-barcode modal-input long-input" type="text" placeholder="Barcode">
              </div>
              <div class="js-generate-barcode generate-barcode">
                Generate Barcode
              </div>
              <div class="js-error-barcode modal-form-error">
              </div>
            </div>

              <div class="two-column-form-container">
                <div class="two-column">
                  <div class="modal-form-title">
                    Cost <span class="asterisk"> * </span>
                  </div>
                  <div class="input-area">
                    <input class="js-input-cost modal-input short-input" type="text" placeholder="Cost">
                  </div>
                  <div class="js-error-cost modal-form-error">
                
                  </div>
                </div>
                <div class="two-column">
                  <div class="modal-form-title">
                    Price <span class="asterisk"> * </span>
                  </div>
                  <div class="input-area">
                    <input class="js-input-price modal-input short-input" type="text" placeholder="Selling price">
                  </div>
                  <div class="js-error-price modal-form-error">
                
                  </div>
                </div>
              </div>

              <div class="two-column-form-container">
                <div class="two-column">
                  <div class="modal-form-title">
                    Category <span class="asterisk"> * </span>
                  </div>
                  <select class="js-input-category add-product-dropdown">
                    <option value="" disabled selected hidden>
                      Category
                    </option>
                    <option value="groceries">
                      Groceries
                    </option>
                    <option value="electronics">
                      Electronics
                    </option>
                  </select>
                  <div class="js-error-category modal-form-error">
                
                  </div>
                </div>
                <div class="two-column">
                  <div class="modal-form-title">
                    Consumption Type
                  </div>
                  <select class="js-input-consumptionType add-product-dropdown">
                    <option value="" disabled selected hidden>
                      Consumption
                    </option>
                    <option value="short">
                      Short (Groceries)
                    </option>
                    <option value="long">
                      Long (Groceries)
                    </option>
                    <option value="isExpiring">
                      Expiring (Electronics)
                    </option>
                    <option value="noExpiry">
                      No Expiration
                    </option>
                  </select>
                  <div class="js-error-consumptionType modal-form-error">
                
                  </div>
                </div>
              </div>

              <div class="two-column-form-container">
                <div class="two-column">
                  <div class="modal-form-title">
                    Stock <span class="asterisk"> * </span>
                  </div>
                  <div class="input-area">
                    <input class="js-input-stock modal-input short-input" type="text" placeholder="Stock">
                  </div>
                  <div class="js-error-stock modal-form-error">
                
                  </div>
                </div>
                <div class="two-column">
                  <div class="modal-form-title">
                    Expiration Date
                  </div>
                  <div class="input-area">
                    <input class="js-input-expirationDate modal-input date-input" type="date">
                  </div>
                  <div class="js-error-expirationDate modal-form-error">
                
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <div class="js-add-button add-button">
                Add Product
              </div>
            </div>
            

          </div>
        </div>
      </div>
    `;

  const addProductButton = document.querySelector('.js-add-product-button');

  addProductButton.addEventListener('click', () => {
    document.body.insertAdjacentHTML('beforeend', html);
    
    const overlayDOM = document.querySelector('.js-modal-overlay');
    const closeButton = document.querySelector('.js-modal-close-button');
    const addButton = document.querySelector('.js-add-button');
    const generateBarcodeBtn = document.querySelector('.js-generate-barcode');
    const barcodeInput = document.querySelector('.js-input-barcode');

    overlayDOM.addEventListener('click', (e) => {
      if (e.target === overlayDOM || e.target === closeButton) {
        overlayDOM.remove();
      }
    });

    addButton.addEventListener('click', async () => {
      const name = document.querySelector('.js-input-name').value.trim();
      const barcode = document.querySelector('.js-input-barcode').value.trim();
      const cost = document.querySelector('.js-input-cost').value;
      const price = document.querySelector('.js-input-price').value;
      const category = document.querySelector('.js-input-category').value;
      const consumptionType = document.querySelector('.js-input-consumptionType').value;
      const quantity = document.querySelector('.js-input-stock').value;
      const expirationDate = document.querySelector('.js-input-expirationDate').value;

      try {
        const { data } = await axios.post('/api/v1/products', {
          name,
          barcode,
          cost,
          price,
          category,
          consumptionType,
          batches: [{
            quantity,
            expirationDate
          }]
        }, {
          withCredentials: true
        });
        showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
        overlayDOM.remove();
        successModal(data.msg);
      } catch (error) {
        document.querySelectorAll('.modal-form-error').forEach(pastError => pastError.textContent = '');
        const errmsg = error.response.data.msg;
        const path = error.response.data.path;

        if (path) {
          document.querySelector(`.js-error-${path}`).textContent = errmsg;
        } else {
          overlayDOM.remove();
          errorModal(errmsg);
        }
      }
    });

    generateBarcodeBtn.addEventListener('click', (e) => {
      barcodeInput.value = generateBarcode();
    });
  });

  function generateBarcode(length = 8) {
    let barcode = '';
    for (let i = 0; i < length; i++) {
      barcode += Math.floor(Math.random() * 10);
    }
    return barcode;
  }
}

function editProductModal() {
  domElements.productListContainerDOM.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.closest('.js-edit-action')) {
        const productId = el.dataset.productId;
        try {
          const { data: { product }} = await axios.get(`/api/v1/products/${productId}`, {
            withCredentials: true
          });
          const html = `
            <div class="js-modal-overlay modal-overlay">
                <div class="modal-content-container">
                  <div class="modal-content">
                    <div class="modal-header">
                      <div class="modal-title">
                        Edit Product
                      </div>
                      <div class="js-modal-close-button modal-close-button">
                        X
                      </div>
                    </div>

                    <div class="modal-body">

                    <div class="input-container">
                      <div class="modal-form-title">
                        Product Name <span class="asterisk"> * </span>
                      </div>
                      <div class="input-area">
                        <input class="js-input-name modal-input long-input" type="text" placeholder="Product Name" value="${product.name}">
                      </div>
                      <div class="js-error-name modal-form-error">
                        
                      </div>
                    </div>

                    <div class="input-container">
                      <div class="modal-form-title">
                        Barcode <span class="asterisk"> * </span>
                      </div>
                      <div class="input-area">
                        <input class="js-input-barcode modal-input long-input" type="text" placeholder="Barcode" value="${product.barcode}">
                      </div>
                      <div class="js-error-barcode modal-form-error">
                        
                      </div>
                    </div>

                      <div class="two-column-form-container">
                        <div class="two-column">
                          <div class="modal-form-title">
                            Cost <span class="asterisk"> * </span>
                          </div>
                          <div class="input-area">
                            <input class="js-input-cost modal-input short-input" type="text" placeholder="Cost" value="${product.cost}">
                          </div>
                          <div class="js-error-cost modal-form-error">
                        
                          </div>
                        </div>
                        <div class="two-column">
                          <div class="modal-form-title">
                            Price <span class="asterisk"> * </span>
                          </div>
                          <div class="input-area">
                            <input class="js-input-price modal-input short-input" type="text" placeholder="Selling price" value="${product.price}">
                          </div>
                          <div class="js-error-price modal-form-error">

                          </div>
                        </div>
                      </div>

                      <div class="two-column-form-container">
                        <div class="two-column">
                          <div class="modal-form-title">
                            Category <span class="asterisk"> * </span>
                          </div>
                          <select class="js-input-category add-product-dropdown">
                            <option value="groceries" ${product.category === 'groceries' ? 'selected' : ''}>
                              Groceries
                            </option>
                            <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>
                              Electronics
                            </option>
                          </select>
                          <div class="js-error-category modal-form-error">
                        
                          </div>
                        </div>
                        <div class="two-column">
                          <div class="modal-form-title">
                            Consumption Type
                          </div>
                          <select class="js-input-consumptionType add-product-dropdown">
                            <option value="short" ${product.consumptionType === 'short' ? 'selected' : ''}>
                              Short (Groceries)
                            </option>
                            <option value="long" ${product.consumptionType === 'long' ? 'selected' : ''}>
                              Long (Groceries)
                            </option>
                            <option value="isExpiring" ${product.consumptionType === 'isExpiring' ? 'selected' : ''}>
                              Expiring (Electronics)
                            </option>
                            <option value="noExpiry" ${product.consumptionType === 'noExpiry' ? 'selected' : ''}>
                              No Expiration
                            </option>
                          </select>
                          <div class="js-error-consumptionType modal-form-error">
                        
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="modal-footer">
                      <div class="js-edit-button add-button">
                        Save Edit
                      </div>
                    </div>
                    

                  </div>
                </div>
              </div>
            `;
          
          document.body.insertAdjacentHTML('beforeend', html);

          const overlayDOM = document.querySelector('.js-modal-overlay');
          const closeButton = document.querySelector('.js-modal-close-button');
          const saveEditButton = document.querySelector('.js-edit-button');

          overlayDOM.addEventListener('click', (e) => {
            if (e.target === overlayDOM || e.target === closeButton) {
              overlayDOM.remove()
            }
          });

          saveEditButton.addEventListener('click', async (e) => {
            const name = document.querySelector('.js-input-name').value.trim();
            const barcode = document.querySelector('.js-input-barcode').value.trim();
            const cost = document.querySelector('.js-input-cost').value;
            const price = document.querySelector('.js-input-price').value;
            const category = document.querySelector('.js-input-category').value;
            const consumptionType = document.querySelector('.js-input-consumptionType').value;
            
            try {
              const { data } = await axios.patch(`/api/v1/products/${productId}`, {
                name,
                barcode, 
                cost,
                price,
                category,
                consumptionType,
              }, {
                withCredentials: true
              });
              showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
              overlayDOM.remove();
              successModal(data.msg);
            } catch (error) {
              document.querySelectorAll('.modal-form-error').forEach(pastError => pastError.textContent = '');
              const errmsg = error.response.data.msg;
              const path = error.response.data.path;

              if (path) {
                document.querySelector(`.js-error-${path}`).textContent = errmsg;
              } else {
                overlayDOM.remove();
                errorModal(errmsg);
              }
            }
          });
        } catch (error) {
          errorModal(error.response.data.msg);
        }
    }
  });
}

function deleteProductModal() {
  domElements.productListContainerDOM.addEventListener('click', (e) => {
    const el = e.target;
    const productId = el.dataset.productId;

    if (el.closest('.js-delete-action')) {
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
      const closeButton = document.querySelector('.js-cancel-button');
      const confirmButton = document.querySelector('.js-confirm-button');

      overlayDOM.addEventListener('click', (e) => {
        if (e.target === overlayDOM || e.target === closeButton) {
          overlayDOM.remove();
        }
      });

      confirmButton.addEventListener('click', async () => {
        try {
          const response = await axios.delete(`/api/v1/products/${productId}`, {
            withCredentials: true
          });
          await showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
          overlayDOM.remove();
          successModal(response.data.msg);
        } catch (error) {
          overlayDOM.remove();
          errorModal(error.response.data.msg);
        }
      });
    }
  });
}

function addBatchModal() {
  domElements.productListContainerDOM.addEventListener('click', async (e) => {
    const el = e.target;
    const addBatchBtn = el.closest('.js-add-batch-action');
    if (!addBatchBtn) return;

    const productId = addBatchBtn.dataset.productId;

    try {
      const { data: { product } } = await axios.get(`/api/v1/products/${productId}`, {
        withCredentials: true
      });

      const html = `
        <div class="js-modal-overlay modal-overlay">
          <div class="modal-content-container">
            <div class="modal-content">
              <div class="modal-header">
                <div class="modal-title">
                  Add Batch
                </div>
                <div class="js-modal-close-button modal-close-button">
                  X
                </div>
              </div>

              <div class="modal-body">

                <div class="input-container">
                  <div class="modal-form-title">
                    Product Name
                  </div>
                  <div class="input-area">
                    <input class="js-input-name modal-input long-input" type="text" placeholder="Product Name" value="${product.name}" disabled>
                  </div>
                  <div class="js-error-name modal-form-error">
                    
                  </div>
                </div>

                <div class="input-container">
                  <div class="modal-form-title">
                    Barcode
                  </div>
                  <div class="input-area">
                    <input class="js-input-barcode modal-input long-input" type="text" placeholder="Barcode" value="${product.barcode}" disabled>
                  </div>
                  <div class="js-error-barcode modal-form-error">
                    
                  </div>
                </div>

                <div class="two-column-form-container">
                  <div class="two-column">
                    <div class="modal-form-title">
                      Quantity <span class="asterisk"> * </span>
                    </div>
                    <div class="input-area">
                      <input class="js-input-quantity modal-input short-input" type="text" placeholder="Quantity">
                    </div>
                    <div class="js-error-stock modal-form-error">
                  
                    </div>
                  </div>
                  <div class="two-column">
                    <div class="modal-form-title">
                      Expiration Date
                    </div>
                    <div class="input-area">
                      <input class="js-input-expiration-date modal-input date-input" type="date">
                    </div>
                    <div class="js-error-expirationDate modal-form-error">
                  
                    </div>
                  </div>
                </div>

              </div>
              
              <div class="modal-footer">
                <div class="js-add-batch-button add-button">
                  Add Batch
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    
    document.body.insertAdjacentHTML('beforeend', html);

    const overlayDOM = document.querySelector('.js-modal-overlay');
    const closeButton = document.querySelector('.js-modal-close-button');
    const addBatchButton = document.querySelector('.js-add-batch-button');

    overlayDOM.addEventListener('click', (e) => {
      if (e.target === overlayDOM || e.target === closeButton) {
        overlayDOM.remove();
      }
    });

    addBatchButton.addEventListener('click', async (e) => {
      const quantity = document.querySelector('.js-input-quantity').value;
      const expirationDate = document.querySelector('.js-input-expiration-date').value;

      const { data } = await axios.post(`/api/v1/products/${productId}/batch`, {
        quantity,
        expirationDate
      }, {
        withCredentials: true
      });
      showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
      overlayDOM.remove();
      successModal(data.msg);
    });
    } catch (error) {
      console.log(error);
    }
  });
}

function editBatchModal() {
domElements.inventoryProductContainerDOM.addEventListener('click', async (e) => {
    const el = e.target;
    const editBatchBtn = el.closest('.js-batch-edit-action');
    if (!editBatchBtn) return;

    const productId = editBatchBtn.dataset.productId;
    const batchId = editBatchBtn.dataset.batchId;

    try {
      const { data: { product } } = await axios.get(`/api/v1/products/${productId}/batch/${batchId}`, {
        withCredentials: true
      });
      const batch = product.batches[0];

      const html = `
        <div class="js-modal-overlay modal-overlay">
          <div class="modal-content-container">
            <div class="modal-content">
              <div class="modal-header">
                <div class="modal-title">
                  Edit Batch
                </div>
                <div class="js-modal-close-button modal-close-button">
                  X
                </div>
              </div>

              <div class="modal-body">

                <div class="input-container">
                  <div class="modal-form-title">
                    Product Name
                  </div>
                  <div class="input-area">
                    <input class="js-input-name modal-input long-input" type="text" placeholder="Product Name" value="${product.name}" disabled>
                  </div>
                  <div class="js-error-name modal-form-error">
                    
                  </div>
                </div>

                <div class="input-container">
                  <div class="modal-form-title">
                    Barcode
                  </div>
                  <div class="input-area">
                    <input class="js-input-barcode modal-input long-input" type="text" placeholder="Barcode" value="${product.barcode}" disabled>
                  </div>
                  <div class="js-error-barcode modal-form-error">
                    
                  </div>
                </div>

                <div class="two-column-form-container">
                  <div class="two-column">
                    <div class="modal-form-title">
                      Quantity <span class="asterisk"> * </span>
                    </div>
                    <div class="input-area">
                      <input class="js-input-quantity modal-input short-input" type="text" placeholder="Quantity" value="${batch.quantity}">
                    </div>
                    <div class="js-error-stock modal-form-error">
                  
                    </div>
                  </div>
                  <div class="two-column">
                    <div class="modal-form-title">
                      Expiration Date
                    </div>
                    <div class="input-area">
                      <input class="js-input-expiration-date modal-input date-input" type="date" value="${batch.expirationDate ? batch.expirationDate.split('T')[0] : ''}">
                    </div>
                    <div class="js-error-expirationDate modal-form-error">
                  
                    </div>
                  </div>
                </div>

              </div>
              
              <div class="modal-footer">
                <div class="js-edit-batch-button add-button">
                  Edit Batch
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    
    document.body.insertAdjacentHTML('beforeend', html);

    const overlayDOM = document.querySelector('.js-modal-overlay');
    const closeButton = document.querySelector('.js-modal-close-button');
    const editBatchButton = document.querySelector('.js-edit-batch-button');

    overlayDOM.addEventListener('click', (e) => {
      if (e.target === overlayDOM || e.target === closeButton) {
        overlayDOM.remove();
      }
    });

    editBatchButton.addEventListener('click', async (e) => {
      const quantity = document.querySelector('.js-input-quantity').value;
      const expirationDate = document.querySelector('.js-input-expiration-date').value;

      const { data } = await axios.patch(`/api/v1/products/${productId}/batch/${batchId}`, {
        quantity,
        expirationDate
      }, {
        withCredentials: true
      });
      showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
      overlayDOM.remove();
      successModal(data.msg);
    });
    } catch (error) {
      console.log(error);
    }
  });
}

function deleteBatchModal() {
  domElements.inventoryProductContainerDOM.addEventListener('click', async (e) => {
    const el = e.target;
    const deleteBatchBtn = el.closest('.js-batch-delete-action');
    if (!deleteBatchBtn) return;

    const productId = deleteBatchBtn.dataset.productId;
    const batchId = deleteBatchBtn.dataset.batchId

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
      const closeButton = document.querySelector('.js-cancel-button');
      const confirmButton = document.querySelector('.js-confirm-button');

      overlayDOM.addEventListener('click', (e) => {
        if (e.target === overlayDOM || e.target === closeButton) {
          overlayDOM.remove();
        }
      });

      confirmButton.addEventListener('click', async () => {
        try {
          const { data } = await axios.delete(`/api/v1/products/${productId}/batch/${batchId}`, {
            withCredentials: true
          });
          await showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
          overlayDOM.remove();
          successModal(data.msg);
        } catch (error) {
          overlayDOM.remove();
          errorModal(error.response.data.msg);
        }
      });
  });
}