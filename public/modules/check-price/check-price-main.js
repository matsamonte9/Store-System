export function initCheckPricePage() {
  const container = document.querySelector('.js-check-price-container');

  container.innerHTML = `
    <div class="check-price-empty-state">
      <h2>Scan a product barcode</h2>
      <p>Use the barcode scanner to check price</p>
    </div>
  `;
}

// import { checkPrice } from "./check-price.js";

// export function initCheckPricePage() {
//   checkPrice();
// }