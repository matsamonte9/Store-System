import { appState, domElements } from "../../globals.js";
import { setUpDropdowns } from "./dropdown.js";
import { setUpModals } from "./modals.js";
import { setUpOrderCreation } from "./order-creation.js";
import { showProducts, showBatch } from "./products.js";

export function initInventoryPage() {
  domElements.inventoryProductContainerDOM = document.querySelector('.js-inventory-product-list');
  domElements.productListContainerDOM =  document.querySelector('.js-inventory-row-list-container');

  domElements.paginationDOM = document.querySelector('.js-pagination');
  domElements.totalProductDOM = document.querySelector('.js-total-products-count');
  domElements.lowStockDOM = document.querySelector('.js-low-stock-count');
  domElements.outOfStockDOM = document.querySelector('.js-out-of-stock-count');
  domElements.nearExpirationDOM = document.querySelector('.js-near-expiration-count');
  domElements.expiredDOM = document.querySelector('.js-expired-count');
  // domElements.totalItemsCountDOM = document.querySelector('.js-total-items-count');
  domElements.limitDropupCountDOM = document.querySelector('.js-limit-dropup');

  showProducts(
    appState.currentName,
    appState.currentSort,
    appState.currentFilter,
    appState.currentLimit,
    appState.currentPage
  );
  showBatch();
  setUpDropdowns();
  setUpModals();
  setUpOrderCreation();
}
