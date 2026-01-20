import { appState } from "./globals.js";

import { renderCartPage } from "./pages/cart-page.js";
import { renderCheckPricePage } from "./pages/check-price-page.js";
import { initCartPage } from "./modules/cart/cart-main.js";
import { initCheckPricePage } from "./modules/check-price/check-price-main.js";

import { addToCartByBarcode } from "./modules/cart/add-to-cart.js";
import { checkPriceByBarcode } from "./modules/check-price/check-price.js";

let barcodeInput = null;

export function initBarcodeController() {
  barcodeInput = document.getElementById('global-barcode-input');
  if (!barcodeInput) return;

  appState.activeMode = localStorage.getItem('activeMode') || null;

  if (appState.activeMode === 'checkPrice') {
    renderCheckPricePage();
    initCheckPricePage();
  } else if (appState.activeMode === 'cart') {
    renderCartPage();
    initCartPage();
  }

  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (activeEl.tagName === 'INPUT' && activeEl !== barcodeInput) return;

    if (e.key === 'F2') {
      appState.activeMode = 'cart';
      localStorage.setItem('activeMode', 'cart');
      const cartLink = document.querySelector('.js-sidebar-cart');
      if (cartLink && !cartLink.classList.contains('hidden')) {
        cartLink.click();
      }
    }

    if (e.key === 'F4') {
      appState.activeMode = 'checkPrice';
      localStorage.setItem('activeMode', 'checkPrice');
      const checkPriceLink = document.querySelector('.js-sidebar-check-price');
      if (checkPriceLink && !checkPriceLink.classList.contains('hidden')) {
        checkPriceLink.click();
      }
    }
  });

  barcodeInput.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;

    const barcode = barcodeInput.value.trim();
    if (!barcode) return;

    if (appState.activeMode === 'cart') {
      const currentPage = document.querySelector('.sidebar-link.on-this-page');
      const isOnCartPage = currentPage?.classList.contains('js-sidebar-cart');
      
      if (!isOnCartPage) {
        const cartLink = document.querySelector('.js-sidebar-cart');
        if (cartLink && !cartLink.classList.contains('hidden')) {

           document.querySelectorAll('.on-this-page').forEach(el => {
      el.classList.remove('on-this-page');
    });

          const barcodeToProcess = barcode;
          barcodeInput.value = '';

          cartLink.click();
          
          setTimeout(() => {
            barcodeInput.value = barcodeToProcess;
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true
            });
            barcodeInput.dispatchEvent(enterEvent);
          }, 100);
          
          return;
        }
      }
      
      await addToCartByBarcode(barcode);
      
    } else if (appState.activeMode === 'checkPrice') {
      const currentPage = document.querySelector('.sidebar-link.on-this-page');
      const isOnCheckPricePage = currentPage?.classList.contains('js-sidebar-check-price');
      
      if (!isOnCheckPricePage) {
        const checkPriceLink = document.querySelector('.js-sidebar-check-price');
        if (checkPriceLink && !checkPriceLink.classList.contains('hidden')) {
          const barcodeToProcess = barcode;
          barcodeInput.value = '';

          checkPriceLink.click();

          setTimeout(() => {
            barcodeInput.value = barcodeToProcess;
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true
            });
            barcodeInput.dispatchEvent(enterEvent);
          }, 100);
          
          return;
        }
      }

      await checkPriceByBarcode(barcode);
    }

    barcodeInput.value = '';
    focusBarcode();
  });
}

function focusBarcode() {
  requestAnimationFrame(() => {
    barcodeInput.focus();
  });
}



