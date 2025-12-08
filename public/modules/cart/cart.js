// let pausedCart = false;
import { appState, domElements } from "../../globals.js";

export function fetchProductsFromCart() {
  // const cartProductListContainer = document.querySelector('.js-cart-row-list-container');
  
  const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

  if (activeCart.length === 0) {
    domElements.cartProductListContainer.innerHTML = `
      <div class="empty-row-list">No Item In The Cart</div>
    `;
    return;
  }

  domElements.cartProductListContainer.innerHTML = activeCart.map(product => {

    let expirationClass = product.expirationStatus === 'expired'
      ? 'product-expired-container'
      : product.expirationStatus === 'expiring soon'
      ? 'product-expiring-container'
      : product.expirationStatus === 'fresh'
      ? 'product-good-container'
      : ''

    const isEditing = appState.cartEditingProductId === product.productId;
    
    return `
      <div class="cart-row-list" data-product-id="${product.productId}">
        <img class="product-img-list" src="../chippy.jpg">
        <div class="product-details">
          ${product.productName}
        </div>
        <div class="product-details ${expirationClass}">
          ${product.expirationDate ? new Date(product.expirationDate).toISOString().split('T')[0] : ''}
        </div>
        <div class="product-details">
          ₱${product.unitCost}.00
        </div>
        <div class="product-details">
          ₱${product.unitPrice}.00
        </div>
        ${isEditing
          ? `<input type="number" value="${product.quantity}" class="js-quantity-input quantity-input" autofocus>`
          : `<div class="product-details">
              ${product.quantity}
            </div>`
        }
        ${isEditing
          ? `<input type="number" value="${product.unitDiscount}" class="js-discount-input quantity-input">`
          : `<div class="product-details">
               ₱${product.unitDiscount}.00
            </div>`
        }
        <div class="product-details">
          ₱${((product.quantity * product.unitPrice) - (product.unitDiscount * product.quantity)).toLocaleString()}.00
        </div>
        <div class="product-details">
          ${isEditing
            ? ` <div class="js-save-action edit-action" data-product-id="${product.productId}">Save</div>
            `
            : ` <div class="js-edit-action edit-action" data-product-id="${product.productId}">Edit</div>
            `
          }
          <div class="js-delete-action delete-action" data-product-id="${product.productId}">Delete</div>
        </div>
      </div>
    `;
  }).join('');
}

