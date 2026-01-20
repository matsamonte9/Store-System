import { appState, domElements } from "../../globals.js";

import { errorModal } from "../shared/modals.js";

export const showProducts = async (nameValue = '', sortValue = '', filterValue = '', limitValue = '', pageValue = '') => {
  try {
    const { data: { 
      products, 
      totalProductCount, 
      lowStockCount, 
      outOfStockCount, 
      nearExpirationCount, 
      expiredCount, 
      totalItemsCount,
      totalItemsFetch,
      totalPagesCount,
    } } = await axios.get(`/api/v1/products`, { 
      params: { name: nameValue, sort: sortValue, filter: filterValue, limit: limitValue, page: pageValue},
      withCredentials: true
    });

    appState.totalPagesCount = totalPagesCount;
    
    const allProducts = products.map(product => {
      const { 
        _id: productId, 
        image,
        name, 
        barcode, 
        cost, 
        price, 
        validStocks, 
        expiredStocks, 
        stockStatus, 
        batches 
      } = product;

      let stockClass = stockStatus === 'out-of-stock'
      ? 'product-out-of-stock-container'
      : stockStatus === 'low-stock'
      ? 'product-low-stock-container'
      : 'product-high-stock-container'

      return `
      <div class="js-inventory-row-list inventory-row-list">
        <img class="product-img-list" src="${image ? image : 'chippy.jpg'}" alt="${name}">
        <div class="product-details product-details-label">
          ${name}
        </div>
        
        <div class="product-details product-details-label">
          ${barcode}
        </div>

        <div class="product-details product-details-label">
          ${cost}
        </div>

        <div class="product-details product-details-label">
          ${price}
        </div>

        <div class="product-details ${stockClass} product-details-label"> 
          <span class="vanishing"> &#9679;  </span> ${validStocks}
        </div>

          ${expiredStocks 
            ? `<div class="product-details product-out-of-stock-container product-details-label">
                <span class="vanishing"> &#9679;  </span> ${expiredStocks}
              </div>` 
            : '<div class="product-details product-details-label"></div>'
          }
        

        ${productActionButton(productId)}
      </div>

      <div class="js-batch-container batch-container hidden" data-product-id="${productId}">
      </div>
    `;
    }).join(' ');

    const currentPageItemsCount = products.length;
    
    const resultStart = (appState.currentPage - 1) * appState.currentLimit + 1; 
    const resultEnd = resultStart + currentPageItemsCount - 1;  // Fixed!

    document.querySelector('.js-pagination-result').innerHTML = `
      Result ${resultStart}-${resultEnd} of <span class="js-total-items-fetch"></span>
    `;

    domElements.totalItemsFetchDOM = document.querySelector('.js-total-items-fetch');

    domElements.productListContainerDOM.innerHTML = allProducts;
    /* if (totalProductDOM) */ domElements.totalProductDOM.textContent = totalProductCount;
    /* if (lowStockDOM) */ domElements.lowStockDOM.textContent = lowStockCount;
    /* if (outOfStockDOM) */ domElements.outOfStockDOM.textContent = outOfStockCount;
    /* if (nearExpirationDOM) */ domElements.nearExpirationDOM.textContent = nearExpirationCount;
    /* if (expiredDOM) */ domElements.expiredDOM.textContent = expiredCount;
    // /* if (totalItemsCountDOM) */ domElements.totalItemsCountDOM.textContent = totalItemsCount;
    /* if (limitDropupCountDOM) */ domElements.limitDropupCountDOM.textContent = appState.currentLimit;
    /* if (totalItemsFetchDOM)*/ domElements.totalItemsFetchDOM.textContent = totalItemsFetch;

    renderPagination(totalPagesCount);
  } catch (error) {
    const errmsg = error.response.data.msg;
    errorModal(errmsg);
  }
} 

function renderPagination(totalPagesCount) {
  let paginationHTML = `
    <div class="pagination-control pagination-previous option" data-page="prev">
      <span class="material-symbols-outlined arrow pagination-icon">
        keyboard_arrow_left
      </span>
      <div class="pagination-text">
        Previous
      </div>
    </div>
    `;

    if (totalPagesCount <= 6) {
      for (let i = 1; i <= totalPagesCount; i++) {
        paginationHTML += `
          <div class="pagination-control pagination-text option ${appState.currentPage === i ? 'pagination-current-page' : ''}" data-page="${i}">
            ${i}
          </div>
        `;
      }
    } else {
      if (appState.currentPage <= 4) {
        for (let i = 1; i <= 4; i++) {
          paginationHTML += `
            <div class="pagination-control pagination-text option ${appState.currentPage === i ? 'pagination-current-page' : ''}" data-page="${i}">
              ${i}
            </div>
          `;
        }
        paginationHTML += `
          <div class="pagination-control pagination-text">...</div>
          <div class="pagination-control pagination-text option" data-page="${totalPagesCount}">
              ${totalPagesCount}
            </div>
        `;
      } else if (appState.currentPage >= totalPagesCount - 3) {
          paginationHTML += `
            <div class="pagination-control pagination-text option" data-page="1">1</div>
            <div class="pagination-control pagination-text">...</div>
          `;

          for (let i = totalPagesCount - 3; i <= totalPagesCount; i++) {
            paginationHTML += `
              <div class="pagination-control pagination-text option ${appState.currentPage === i ? 'pagination-current-page' : ''}" data-page="${i}">
                ${i}
              </div>
            `;
          }
      } else {
        paginationHTML += `
          <div class="pagination-control pagination-text option" data-page="1">1</div>
          <div class="pagination-control pagination-text">...</div>
          <div class="pagination-control pagination-text option ${appState.currentPage === appState.currentPage ? 'pagination-current-page' : ''}" data-page="${appState.currentPage}">
            ${appState.currentPage}
          </div>
          <div class="pagination-control pagination-text option" ${appState.currentPage === appState.currentPage ? 'pagination-current-page' : ''}" data-page="${appState.currentPage + 1}">
            ${appState.currentPage + 1}
          </div>
          <div class="pagination-control pagination-text">...</div>
          <div class="pagination-control pagination-text option" data-page="${totalPagesCount}">
              ${totalPagesCount}
            </div>
        `;
      }
    }
  
    paginationHTML += `
      <div class="pagination-control pagination-next option" data-page="next">
        <div class="pagination-text">
            Next
        </div>
        <span class="material-symbols-outlined arrow pagination-icon">
          keyboard_arrow_right
        </span>
      </div>
    `;

  domElements.paginationDOM.innerHTML = paginationHTML;
}

function productActionButton(productId) {
  if (!appState.creatingOrder) {
    return `
      <div class="product-details inventory-product-action-buttons">
        <span class="material-symbols-outlined js-add-batch-action inventory-add-icon" data-product-id="${productId}">
          add
        </span>
        <span class="material-symbols-outlined js-edit-action inventory-edit-icon" data-product-id="${productId}">
          edit
        </span>
        <span class="material-symbols-outlined js-delete-action inventory-delete-icon" data-product-id="${productId}">
          delete
        </span>
        <span class="material-symbols-outlined js-dropdown-action inventory-dropdown-icon" data-product-id="${productId}">
          keyboard_arrow_down
        </span>
      </div>
    `;

    // <div class="js-edit-action edit-action" data-product-id="${productId}">Edit</div>
    //     <div class="js-delete-action delete-action" data-product-id="${productId}">Delete</div>
  } else {
    return `
    <div class="create-order-action">
      <div class="js-add-to-order-button product-details inventory-add-to-cart-button" data-product-id="${productId}">
        <span class="material-symbols-outlined add-product-icon">
          add
        </span>
      </div>
      <span class="material-symbols-outlined product-details js-dropdown-action inventory-dropdown-icon" data-product-id="${productId}">
        keyboard_arrow_down
      </span>
    </div> 
    `;

    // <div class="js-replace-item-button product-details inventory-add-to-cart-button" data-product-id="${productId}">
    //     <span class="material-symbols-outlined add-product-icon">
    //       compare_arrows
    //     </span>
    //   </div>
  }
}

export function showBatch() {
  domElements.productListContainerDOM.addEventListener('click', async (e) => {
    const dropdownEl = e.target.closest('.js-dropdown-action'); 
    
    if (dropdownEl) {
      const productId = dropdownEl.dataset.productId;
      const batchContainer = document.querySelector(`.js-batch-container[data-product-id="${productId}"]`);

      const isHidden = batchContainer.classList.contains('hidden');

      if (isHidden) {
        const currentFilter = appState.currentFilter || '';
        batchContainer.classList.remove('hidden');

        try {
          const { data: { batches } } = await axios.get(`/api/v1/products/${productId}/batches`, {
            params: {
              filter: currentFilter
            },
            withCredentials: true
          });

          batchContainer.innerHTML = batches.map(batch => {
            const { _id: batchId, quantity, expirationDate, expirationStatus, stockStatus } = batch;

            let expirationClass = expirationStatus === 'expired'
              ? 'product-expired-container'
              : expirationStatus === 'expiring-soon'
              ? 'product-expiring-container'
              : expirationStatus === 'fresh'
              ? 'product-good-container'
              : ''

            let stockClass = expirationStatus === 'expired'
              ? 'product-out-of-stock-container'
              : stockStatus === 'low-stock'
              ? 'product-low-stock-container'
              : 'product-high-stock-container'

            return `
              <div class="batch-row">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div class="product-details ${stockClass}"> 
                  <span class="vanishing"> &#9679; </span> ${quantity || 0}
                </div>
                <div class="product-details ${expirationClass}"> 
                  ${expirationDate ? expirationDate.split('T')[0] : 'No Expiration'}
                </div>
                <div class="js-batch-add-action">
                  ${!appState.creatingOrder
                    ? `<div class="product-details inventory-product-action-buttons">
                        <span class="material-symbols-outlined js-batch-edit-action inventory-edit-icon" data-product-id="${productId}" data-batch-id="${batchId}">
                          edit
                        </span>
                        <span class="material-symbols-outlined js-batch-delete-action inventory-delete-icon" data-product-id="${productId}" data-batch-id="${batchId}">
                          delete
                        </span>
                      </div>`
                    : `<div class="js-replace-item-button product-details inventory-add-to-cart-button" data-product-id="${productId}" data-batch-id="${batchId}">
                        <span class="material-symbols-outlined add-product-icon">
                          compare_arrows
                        </span>
                      </div>`
                  }
                </div>
              </div>
            `;
          }).join('');
        } catch (error) {
          console.log('Error fetching batches:', error);
          batchContainer.classList.add('hidden');
        }
      } else {
        batchContainer.classList.add('hidden');
      }
    }
  });
}




