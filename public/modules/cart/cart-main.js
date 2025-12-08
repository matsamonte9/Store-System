import { domElements } from "../../globals.js";
import { actionButtonCart } from "./action-button-cart.js";
import { addToCartModal } from "./add-to-cart.js";
import { fetchProductsFromCart } from "./cart.js";
import { pauseCart } from "./pause-cart.js";
import { completeCartAndPrintReceipt } from "./print-receipt.js";
import { fetchProductsToReceipt } from "./receipt.js";

export function initCartPage() {
  domElements.cartProductListContainer = document.querySelector('.js-cart-row-list-container');

  fetchProductsFromCart();
  fetchProductsToReceipt();
  pauseCart();
  completeCartAndPrintReceipt();
  addToCartModal();

  actionButtonCart();
}