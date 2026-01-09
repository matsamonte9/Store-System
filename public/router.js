import { appState } from "./globals.js";

import { fetchCurrentUser } from "./modules/auth/current-user.js";
import { renderDashboardPage } from "./pages/dashboard-page.js";
import { renderInventoryPage } from "./pages/inventory-page.js";
import { renderOrdersPage } from "./pages/orders-page.js";
import { renderUserManagementPage } from "./pages/user-management.js";
import { renderCheckPricePage } from "./pages/check-price-page.js";
import { renderCartPage } from "./pages/cart-page.js";

import { initInventoryPage } from "./modules/inventory/inventory-main.js";
import { initOrdersPage } from "./modules/orders/order-main.js";
import { initUserManagementPage } from "./modules/user-management/user-management-main.js";
import { initCheckPricePage } from "./modules/check-price/check-price-main.js";
import { initCartPage } from "./modules/cart/cart-main.js";
import { logoutAction } from "./modules/auth/logout.js";

import { partialCloseViewingOrder } from "./modules/orders/view-order.js";
import { applyRoleBasedUI} from "./utils.js";

import { initBarcodeController } from "./barcode-controller.js";

async function setUpRouter() {
  const dashboardLink = document.querySelector('.js-sidebar-dashboard');
  const inventoryLink = document.querySelector('.js-sidebar-inventory');
  const ordersLink = document.querySelector('.js-sidebar-orders');
  const userManagementLink = document.querySelector('.js-sidebar-user-management');
  const checkPriceLink = document.querySelector('.js-sidebar-check-price');
  const cartLink = document.querySelector('.js-sidebar-cart');
  const logoutLink = document.querySelector('.js-sidebar-logout');

  const barcodeInput = document.getElementById('global-barcode-input');

  try {
    await fetchCurrentUser();
    
    document.querySelector('.sidebar').classList.remove('hidden');
    applyRoleBasedUI(appState.currentUser.role);
  } catch (error) {
    window.location.href = '/login.html';
    return;
  }

  const focusBarcodeInput = () => {
    if (!barcodeInput) return;

    if (appState.activeMode === 'cart' || appState.activeMode === 'checkPrice') {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement.tagName === 'INPUT' || 
                            activeElement.tagName === 'TEXTAREA' ||
                            activeElement.isContentEditable;
      
      if (!isInputFocused) {
        requestAnimationFrame(() => {
          barcodeInput.focus();
        });
      }
    }
  };

  if (appState.currentUser.role === 'admin' || appState.currentUser.role === 'cashier') {
    if (dashboardLink.classList.contains('hidden')) return;
    partialCloseViewingOrder();
    
    renderDashboardPage();

    focusBarcodeInput();
    
    toggleSidebar(dashboardLink);
  } else {
    if (inventoryLink.classList.contains('hidden')) return;

    partialCloseViewingOrder();

    renderInventoryPage();
    initInventoryPage();
    focusBarcodeInput();
    toggleSidebar(inventoryLink);
  }

  dashboardLink?.addEventListener('click', () => {
    if (dashboardLink.classList.contains('hidden')) return;

    partialCloseViewingOrder();
    
    renderDashboardPage();
    focusBarcodeInput();
    toggleSidebar(dashboardLink);
  });
  
  inventoryLink?.addEventListener('click', () => {
    if (inventoryLink.classList.contains('hidden')) return;

    partialCloseViewingOrder();

    renderInventoryPage();
    initInventoryPage();
    focusBarcodeInput();
    toggleSidebar(inventoryLink);
  });

  ordersLink?.addEventListener('click', () => {
    if (ordersLink.classList.contains('hidden')) return;

    renderOrdersPage();
    initOrdersPage();
    focusBarcodeInput();
    toggleSidebar(ordersLink);
  });

  userManagementLink.addEventListener('click', () => {
    if (userManagementLink.classList.contains('hidden')) return;

    partialCloseViewingOrder();

    renderUserManagementPage();
    initUserManagementPage();
    focusBarcodeInput();
    toggleSidebar(userManagementLink);
  });

  checkPriceLink?.addEventListener('click', () => {
    if (checkPriceLink.classList.contains('hidden')) return;

    partialCloseViewingOrder();

    renderCheckPricePage();
    initCheckPricePage();

    appState.activeMode = 'checkPrice';
    localStorage.setItem('activeMode', 'checkPrice');
    focusBarcodeInput();

    toggleSidebar(checkPriceLink);
  });

  cartLink?.addEventListener('click', () => {
    if (cartLink.classList.contains('hidden')) return;

    partialCloseViewingOrder();

    renderCartPage();
    initCartPage();

    appState.activeMode = 'cart';
    localStorage.setItem('activeMode', 'cart');
    focusBarcodeInput();

    toggleSidebar(cartLink);
  });

  logoutLink?.addEventListener('click', async () => {
    if (logoutLink.classList.contains('hidden')) return;

    await logoutAction();
  });

  function toggleSidebar(activeLink) {
    const sidebars = document.querySelectorAll('.sidebar-link');

    sidebars.forEach(link => {
      link.classList.remove('on-this-page');
    });

    if (activeLink) {
      activeLink.classList.add('on-this-page');
    }
  }
}

async function initApp() {
  await setUpRouter();
  initBarcodeController();
}

initApp();