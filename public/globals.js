export const appState = {
  // Avoid Event Listener Stacking
  // dropdownsInitialized: false,

  // General

  activeMode: null,

  // Login
  currentUser: null,

  // Inventory
  creatingOrder: false,
  editingCreatingOrderItem: {
    productId: null,
    itemType: null,
    batchId: null,
  },
  currentOrderItems: [],
  currentOrderId: null,

  // Inventory Filter
  currentName : '',
  currentSort : 'name',
  currentFilter : '',
  currentLimit : 10,
  currentPage : 1,
  totalPagesCount: 1,

  // Orders
  currentPreviewOrderId: null,
  currentPreviewOrderItems: [],
  currentPreviewOrderAction: null,
  editingOrderedItem: {
    productId: null,
    itemType: null,
    batchId: null,
  },

  // User Management
  userManagementCurrentFilter: '',

  // Cart 
  cartEditingProductId: null,
  pausedCart: false,
  stockWarnings: [],
  cartToken: null,
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

  // User Management

  userManagementActionDOM: null,
  userListContainerDOM: null,

  // Cart 

  cartProductListContainer: null,
}