import { appState, domElements } from "../../globals.js";
import { showProducts } from "./products.js";

// let currentName = '';
// let currentSort = '';
// let currentFilter = '';
// let currentLimit = 5;
// let currentPage = 1;

let searchEnterHandler = null;
let searchButtonHandler = null;
let inventoryClickHandler = null;

export function setUpDropdowns() {
  searchInput();
  handleDropdowns();
}

function searchInput() {
  const searchInputDOM = document.querySelector('.js-search-input');
  const searchButton = document.querySelector('.js-search-icon');

  if (searchEnterHandler) searchInputDOM.removeEventListener('keydown', searchEnterHandler);
  if (searchButtonHandler) searchButton.removeEventListener('click', searchButtonHandler);

  searchEnterHandler = (e) => {
    if (e.key === 'Enter') {
      appState.currentName = e.target.value.trim();
      showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
    }
  };

  searchButtonHandler = () => {
    appState.currentName = searchInputDOM.value.trim();
    showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
  };

  searchInputDOM.addEventListener('keydown', searchEnterHandler);
  searchButton.addEventListener('click', searchButtonHandler);

  // searchInputDOM.addEventListener('keydown', (e) => {
  //   if (e.key === 'Enter') {
  //     searchListenerCount++
  //     console.log(`Search Enter Clicked: ${searchListenerCount}`);    
  //     appState.currentName = e.target.value.trim();
  //     showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
  //   }
  // });

  // searchButton.addEventListener('click', () => {
  //   searchListenerCount++
  //   console.log(`Search Button Clicked: ${searchListenerCount}`);
  //   appState.currentName = searchInputDOM.value.trim();
  //   showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
  // });
}

function handleDropdowns() {
  const filterDOM = document.querySelector('.js-filter-button');
  const filterModalDOM = document.querySelector('.js-filter-modal');
  const sortDOM = document.querySelector('.js-sort-button');
  const sortModalDOM = document.querySelector('.js-sort-modal');
  const limitModalDOM = document.querySelector('.js-limit-modal');

  if (inventoryClickHandler) {
    domElements.inventoryProductContainerDOM.removeEventListener('click', inventoryClickHandler);
  }

  inventoryClickHandler = (e) => {
    if (e.target.closest('.js-sort-button')) {
      toggleSortModal(sortDOM, sortModalDOM, filterDOM, filterModalDOM);
    }

    if (e.target.closest('.js-sort-modal') && e.target.classList.contains('option')) {
      selectSortOption(e, sortDOM, sortModalDOM);
    }

    if (e.target.closest('.js-filter-button')) {
      toggleFilterModal(sortDOM, sortModalDOM, filterDOM, filterModalDOM);
    }

    if (e.target.closest('.js-filter-modal') && e.target.classList.contains('option')) {
      selectFilterOption(e, filterDOM, filterModalDOM);
    }

    if (e.target.closest('.js-limit-button')) {
      toggleLimitModal(limitModalDOM);
    }

    if (e.target.closest('.js-limit-modal') && e.target.classList.contains('option')) {
      selectLimitOption(e, limitModalDOM);
    }

    if (e.target.closest('.js-pagination')) {
      handlePagination(e);
    }
  }

  domElements.inventoryProductContainerDOM.addEventListener('click', inventoryClickHandler);
}

function toggleSortModal(sortDOM, sortModalDOM, filterDOM, filterModalDOM) {
  const html = `
    <div class="option option-divider" data-sort="name">
      Name (A-Z)
    </div>
    <div class="option option-divider" data-sort="-name">
      Name (Z-A)
    </div>
    <div class="option option-divider" data-sort="cost">
      Cost (Low-High)
    </div>
    <div class="option option-divider" data-sort="-cost">
      Cost (High-Low)
    </div>
    <div class="option option-divider" data-sort="price">
      Price(Low-High)
    </div>
    <div class="option option-divider" data-sort="-price">
      Price (High-Low)
    </div>
    <div class="option option-divider" data-sort="stock">
      Stock (Low-High)
    </div>
    <div class="option option-divider" data-sort="-stock">
      Stock (High-Low)
    </div>
    <div class="option option-divider" data-sort="expirationDate">
      Expiration (Near-Far)
    </div>
    <div class="option option-divider" data-sort="-expirationDate">
      Expiration (Near-Far)
    </div>
`;
  const isHidden = sortModalDOM.classList.contains('hidden');

  if (isHidden) {
    filterModalDOM.classList.add('hidden');
    if (!appState.currentFilter) filterDOM.classList.remove('current-dropdown');

    sortModalDOM.innerHTML = html;
    sortModalDOM.classList.remove('hidden');
    sortDOM.classList.add('current-dropdown');
  } else {
    sortModalDOM.classList.add('hidden');
    sortDOM.classList.remove('current-dropdown');
  }
}

function selectSortOption(e, sortDOM, sortModalDOM) {
  appState.currentSort = e.target.dataset.sort;
  appState.currentPage = 1;
  showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
  sortModalDOM.classList.add('hidden');
  sortDOM.classList.remove('current-dropdown');
}

function toggleFilterModal(sortDOM, sortModalDOM, filterDOM, filterModalDOM) {
  const html = `
    <div class="option option-divider" data-filter="">
      Show All
    </div>
    <div class="option option-divider" data-filter="out-of-stock">
      Out of Stock
    </div>
    <div class="option option-divider" data-filter="low-stock">
      Low Stock
    </div>
    <div class="option option-divider" data-filter="high-stock">
      High Stock
    </div>
    <div class="option option-divider" data-filter="expired">
      Expired
    </div>
    <div class="option option-divider" data-filter="expiring-soon">
      Expiring Soon
    </div>
    <div class="option option-divider" data-filter="fresh">
      Fresh
    </div>
`;
  const isHidden = filterModalDOM.classList.contains('hidden');

  if (isHidden) {
    sortModalDOM.classList.add('hidden');
    sortDOM.classList.remove('current-dropdown');

    filterModalDOM.innerHTML = html;
    filterModalDOM.classList.remove('hidden');
    filterDOM.classList.add('current-dropdown');
  } else {
    filterModalDOM.classList.add('hidden');
    if (!appState.currentFilter) filterDOM.classList.remove('current-dropdown');
  }
}

function selectFilterOption(e, filterDOM, filterModalDOM) {
  appState.currentFilter = e.target.dataset.filter;
  appState.currentPage = 1;
  showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
  filterModalDOM.classList.add('hidden');
  if (!appState.currentFilter) filterDOM.classList.remove('current-dropdown');
}

function toggleLimitModal(limitModalDOM) {

  const html = `
    <div class="option option-divider" data-limit="5">
      5
    </div>
    <div class="option option-divider" data-limit="10">
      10
    </div>
    <div class="option option-divider" data-limit="15">
      15
    </div>
    <div class="option option-divider" data-limit="20">
      20
    </div>
  `;

  const isHidden = limitModalDOM.classList.contains('hidden');

  if (isHidden) {
    limitModalDOM.innerHTML = html;
    limitModalDOM.classList.remove('hidden');
  } else {
    limitModalDOM.classList.add('hidden');
  }
}

function selectLimitOption(e, limitModalDOM) {
  appState.currentLimit = Number(e.target.dataset.limit);
  appState.currentPage = 1;
  showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
  limitModalDOM.classList.add('hidden');
}

function handlePagination(e) {
  const option = e.target.closest('.option');
  const pageData = option.dataset.page;


  if (pageData === 'prev') {
    if (appState.currentPage > 1) appState.currentPage--;
  } else if (pageData === 'next') {
    if (appState.currentPage < appState.totalPagesCount) appState.currentPage++;
  } else {
    appState.currentPage = Number(pageData);
  }

  showProducts(appState.currentName, appState.currentSort, appState.currentFilter, appState.currentLimit, appState.currentPage);
}