export function renderCheckPriceProduct(product) {
  const checkPriceContainer = document.querySelector('.js-check-price-container');

  const html = `
    <div class="check-price-product-image-container">
      <img class="check-price-product-image" src="${product.image ? product.image : 'chippy.jpg'}" alt="${product.name}">
    </div>

    <div class="check-price-product-details">
      <div class="check-price-product-name">${product.name}</div>
      <div class="check-price-product-barcode">${product.barcode}</div>

      <div class="check-price-product-price">
        <div class="cost-column">
          <div class="product-detail-title">Cost</div>
          <div class="column-price">&#8369;${product.cost}.00</div>
        </div>

        <div class="selling-price-column">
          <div class="product-detail-title">Selling Price</div>
          <div class="column-price">&#8369;${product.price}.00</div>
        </div>
      </div>

      <div class="check-price-add-to-cart-container">
        <div class="check-price-quantity-container">
          <input class="js-check-price-quantity-input check-price-quantity-input" type="number" value="1">
        </div>
        <div class="js-check-price-add-to-cart-button check-price-add-to-cart-button"
          data-product-id="${product._id}">
          Add to Cart
        </div>
      </div>
    </div>
  `;

  checkPriceContainer.innerHTML = html;
}