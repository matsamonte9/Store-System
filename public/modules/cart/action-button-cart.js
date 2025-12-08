import { appState, domElements } from "../../globals.js";
import { fetchProductsFromCart } from "./cart.js";
import { fetchProductsToReceipt } from "./receipt.js";

export function actionButtonCart() {
  // const cartProductListContainer = document.querySelector('.js-cart-row-list-container');

  domElements.cartProductListContainer.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.classList.contains('js-edit-action')) {
      const productId = el.dataset.productId;

      appState.cartEditingProductId = productId;
      fetchProductsFromCart();
      fetchProductsToReceipt();

      const row = domElements.cartProductListContainer.querySelector(`.cart-row-list[data-product-id="${productId}"]`);
      const quantityInput = row.querySelector('.js-quantity-input');
      const discountInput = row.querySelector('.js-discount-input');

      quantityInput.focus();

      quantityInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          discountInput.focus();
        }
      });

      discountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {  
          appState.cartEditingProductId = null;
          
          const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

          const product = activeCart.find(p => p.productId === productId);
          if (product) {
            product.quantity = Number(quantityInput.value);
            if ((product.unitPrice - discountInput.value) > product.unitCost) {
              product.unitDiscount = Number(discountInput.value);
            } else {
              alert('Discount is greater than your cost');
              return;
            }
          }

          localStorage.setItem('activeCart', JSON.stringify(activeCart));
      
          fetchProductsFromCart();
          fetchProductsToReceipt();
        }
      });
    } else if (el.classList.contains('js-save-action')) {
      appState.cartEditingProductId = null;

      const productId = el.dataset.productId;
      const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

      const product = activeCart.find(p => p.productId === productId);
      if (product) {
        const row = el.closest('.cart-row-list');
        const quantityInput = row.querySelector('.js-quantity-input');
        const discountInput = row.querySelector('.js-discount-input');

        product.quantity = Number(quantityInput.value);
        if ((product.unitCost - discountInput.value) > 0) {
          product.unitDiscount = Number(discountInput.value);
        } else {
          alert('Discount is less than your cost');
          return; 
        }
      }

      localStorage.setItem('activeCart', JSON.stringify(activeCart));
      
      fetchProductsFromCart();
      fetchProductsToReceipt();
    } else if (el.classList.contains('js-delete-action')) {
      const productId = el.dataset.productId;

      const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

      const updatedCart = activeCart.filter(p => p.productId !== productId);

      localStorage.setItem('activeCart', JSON.stringify(updatedCart));

      fetchProductsFromCart();
      fetchProductsToReceipt();
    }
  });
}

      