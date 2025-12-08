export const appState = {
  // Avoid Event Listener Stacking
  // dropdownsInitialized: false,

  // Inventory
  creatingOrder: false,
  editingItemId: null,
  editingItemType: null,
  currentOrderItems: [],
  currentOrderId: null,

  // Inventory Filter
  currentName : '',
  currentSort : '',
  currentFilter : '',
  currentLimit : 5,
  currentPage : 1,
  totalPagesCount: 1,

  // Orders
  currentPreviewOrderId: null,
  currentPreviewOrderItems: [],
  currentPreviewOrderAction: null,
  previewEditingItemId: null,
  previewEditingItemType: null,

  // Cart 
  cartEditingProductId: null,
  pausedCart: false,
}

export const domElements = {
  // All
  bodyDOM: document.querySelector('.js-body-container'),
  mainContentDOM: document.querySelector('.main-content'),

  // Inventory

  inventoryProductContainerDOM: null,
  productListContainerDOM: null,
  paginationDOM: null,

  // Inventory Stats
  totalProductDOM: null,
  lowStockDOM: null,
  outOfStockDOM: null,
  nearExpirationDOM: null,
  expiredDOM: null,
  totalItemsCountDOM: null,
  totalItemsFetchDOM: null,
  limitDropupCountDOM: null,

  // Orders

  viewOrderDOM: document.querySelector('.js-view-order'),
  navBarDOM: null,
  orderContainerDOM: null,

  // Cart 

  cartProductListContainer: null,
}