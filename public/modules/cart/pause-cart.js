import { appState } from "../../globals.js";
import { fetchProductsFromCart } from "./cart.js";
import { fetchProductsToReceipt } from "./receipt.js";

export function pauseCart() {
  const pauseButton = document.querySelector('.js-pause-cart-button');
  const pauseCartItems = JSON.parse(localStorage.getItem('pauseCart') || '[]');

  if (pauseCartItems.length > 0) {
    appState.pausedCart = true;

    pauseButton.classList.replace('add-to-cart-button', 'resume-cart');
    pauseButton.innerHTML = `
      <div>Resume Cart</div>
      <span class="material-symbols-outlined add-product-icon">play_arrow</span>
    `;
  }

  pauseButton.addEventListener('click', () => {
    const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');
    const pauseCart = JSON.parse(localStorage.getItem('pauseCart') || '[]');

    if (appState.pausedCart) {
      appState.pausedCart = false;
      localStorage.setItem('activeCart', JSON.stringify(pauseCart));
      localStorage.setItem('pauseCart', '[]');
      fetchProductsFromCart();
      fetchProductsToReceipt();
      pauseButton.classList.replace('resume-cart', 'add-to-cart-button');
      pauseButton.innerHTML = `
        <div> 
          Pause Cart
        </div>
        <span class="material-symbols-outlined add-product-icon">
          pause
        </span>
      `;
      return;
    }
    
    if (activeCart.length === 0) {
      return;
    }

    appState.pausedCart = true;
    localStorage.setItem('pauseCart', JSON.stringify(activeCart));
    localStorage.setItem('activeCart', '[]');
    fetchProductsFromCart();
    fetchProductsToReceipt();
    pauseButton.classList.replace('add-to-cart-button', 'resume-cart');
    pauseButton.innerHTML = `
      <div> 
        Resume Cart
      </div>
      <span class="material-symbols-outlined add-product-icon">
        play_arrow
      </span>
    `;
  });
}