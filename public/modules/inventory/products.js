import { appState, domElements } from "../../globals.js";

// const productContainerDOM = document.querySelector('.js-inventory-row-list-container');
// const totalProductDOM = document.querySelector('.js-total-products-count');
// const lowStockDOM = document.querySelector('.js-low-stock-count');
// const outOfStockDOM = document.querySelector('.js-out-of-stock-count');
// const nearExpirationDOM = document.querySelector('.js-near-expiration-count');
// const expiredDOM = document.querySelector('.js-expired-count');
// const paginationDOM = document.querySelector('.js-pagination');

// const totalItemsCountDOM = document.querySelector('.js-total-items-count');
// const totalItemsFetchDOM = document.querySelector('.js-total-items-fetch');
// const limitDropupCountDOM = document.querySelector('.js-limit-dropup');

// let creatingOrder = false;

export const showProducts = async (nameValue = '', sortValue = '', filterValue = '', limitValue = '', pageValue = '') => {
  try {
    const { data: { 
      products, 
      totalProductCount, 
      lowStockCount, 
      outOfStockCount, 
      nearExpirationCount, 
      expiredCount, 
      limitCount,
      totalItemsCount,
      totalItemsFetch,
      totalPagesCount,
    } } = await axios.get(`/api/v1/products`, { 
      params: { name: nameValue, sort: sortValue, filter: filterValue, limit: limitValue, page: pageValue}
    });

    appState.totalPagesCount = totalPagesCount;
    
    const allProducts = products.map(product => {
      const { id:productId, name, barcode, cost, price, stock, expirationDate, stockStatus, expirationStatus } = product;

      const dateOnly = expirationDate
      ? expirationDate.split('T')[0]
      : '';

      let stockClass = stockStatus === 'out of stock'
      ? 'product-out-of-stock-container'
      : stockStatus === 'low stock'
      ? 'product-low-stock-container'
      : 'product-high-stock-container'

      let expirationClass = expirationStatus === 'expired'
      ? 'product-expired-container'
      : expirationStatus === 'expiring soon'
      ? 'product-expiring-container'
      : expirationStatus === 'fresh'
      ? 'product-good-container'
      : ''

      return `
      <div class="js-inventory-row-list inventory-row-list">
        <img class="product-img-list" src="chippy.jpg">
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
          <span class="vanishing"> &#9679;  </span> ${stock} <span class="vanishing"> left </span>
        </div>

        <div class="product-details ${expirationClass} product-details-label">
          ${dateOnly}
        </div>

        ${productActionButton(productId)}
      </div>
    `;
    }).join(' ');

    const resultStart = (appState.currentPage - 1) * appState.currentLimit + 1; 
    const resultEnd = resultStart + limitCount - 1;

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
    console.log(error);
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
      <div class="product-details">
        <div class="js-edit-action edit-action" data-product-id="${productId}">Edit</div>
        <div class="js-delete-action delete-action" data-product-id="${productId}">Delete</div>
      </div>
    `;
  } else {
    return `
    <div class="create-order-action">
      <div class="js-add-to-order-button product-details inventory-add-to-cart-button" data-product-id="${productId}">
        <span class="material-symbols-outlined add-product-icon">
          add
        </span>
      </div>
      <div class="js-replace-item-button product-details inventory-add-to-cart-button" data-product-id="${productId}">
        <span class="material-symbols-outlined add-product-icon">
          compare_arrows
        </span>
      </div>
    </div> 
    `;
  }
}




