import { renderInventoryPage } from "./pages/inventory-page.js";
import { renderOrdersPage } from "./pages/orders-page.js"
import { renderCheckPricePage } from "./pages/check-price-page.js";
import { renderCartPage } from "./pages/cart-page.js"

import { initInventoryPage } from "./modules/inventory/inventory-main.js";
import { initOrdersPage } from "./modules/orders/order-main.js";
import { initCheckPricePage } from "./modules/check-price/check-price-main.js";
import { initCartPage } from "./modules/cart/cart-main.js";

import { partialCloseViewingOrder } from "./modules/orders/view-order.js";

function setUpRouter() {
  const inventoryLink = document.querySelector('.js-sidebar-inventory');
  const ordersLink = document.querySelector('.js-sidebar-orders');
  const checkPriceLink = document.querySelector('.js-sidebar-check-price');
  const cartLink = document.querySelector('.js-sidebar-cart');
  
  inventoryLink.addEventListener('click', () => {
    partialCloseViewingOrder();

    renderInventoryPage();
    initInventoryPage();
    
    toggleSidebar(inventoryLink);
  });

  ordersLink.addEventListener('click', () => {
    renderOrdersPage();
    initOrdersPage();

    toggleSidebar(ordersLink);
  });

  checkPriceLink.addEventListener('click', () => {
    partialCloseViewingOrder();

    renderCheckPricePage();
    initCheckPricePage();

    toggleSidebar(checkPriceLink);
  });

  cartLink.addEventListener('click', () => {
    partialCloseViewingOrder();

    renderCartPage();
    initCartPage();

    toggleSidebar(cartLink);
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

setUpRouter();