export async function checkPrice() {
  const checkPriceContainer = document.querySelector('.js-check-price-container');
  
  try {
    const { data: { product } } = await axios.get(`/api/v1/products/${'68f4f11b155a565d41f97899'}`);

    let stockClass = product.stockStatus === 'out of stock'
      ? 'product-out-of-stock-container'
      : product.stockStatus === 'low stock'
      ? 'product-low-stock-container'
      : product.stockStatus === 'high stock'
      ? 'product-high-stock-container'
      : ''


    let expirationClass = product.expirationStatus === 'expired'
      ? 'product-expired-container'
      : product.expirationStatus === 'expiring soon'
      ? 'product-expiring-container'
      : product.expirationStatus === 'fresh'
      ? 'product-good-container'
      : ''

    const html = `
      <div class="check-price-product-image-container">
        <img class="check-price-product-image" src="./chippy.jpg">
      </div>
      <div class="check-price-product-details">
        <div class="check-price-product-name">
          ${product.name}
        </div>
        <div class="check-price-product-barcode">
          ${product.barcode}
        </div>
        <div class="check-price-product-price">
          <div class="cost-column">
            <div class="product-detail-title">
              Cost
            </div>
            <div class="column-price">
              &#8369;${product.cost}.00 
            </div>
          </div>
          <div class="selling-price-column">
            <div class="product-detail-title">
              Selling Price
            </div>
            <div class="column-price">
              &#8369;${product.price}.00
            </div>
          </div>
        </div>
        <div class="check-price-product-details-container">
          <div class="product-detail-title">
            Stock
          </div>
          <div class="${stockClass}">
            &#9679; ${product.stock} left
          </div>
        </div>
        <div class="check-price-product-details-container">
          <div class="product-detail-title">
            Expiration
          </div>
          <div class="${expirationClass}">
            ${product.expirationDate ? new Date(product.expirationDate).toISOString().split('T')[0] : ''}
          </div>
        </div>
        <div class="check-price-add-to-cart-container">
          <div class="check-price-quantity-container">
            <input class="js-check-price-quantity-input check-price-quantity-input" type="number" value="1" autofocus>
          </div>
          <div class="js-check-price-add-to-cart-button check-price-add-to-cart-button" data-product-id="${product.id}">
            Add to Cart
          </div>
        </div>
      </div>
    `;

    checkPriceContainer.innerHTML = html;

    const quantityInput = document.querySelector('.js-check-price-quantity-input');
    const addToCartButton = document.querySelector('.js-check-price-add-to-cart-button');

    addToCartButton.addEventListener('click', async () => {
      const productId = addToCartButton.dataset.productId;
      const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');
      
      const existingProduct = activeCart.find(p => p.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += Number(quantityInput.value)
      } else {
        try { 
          const { data: { product } } = await axios.get(`/api/v1/products/${productId}`);

          activeCart.push({ 
          productId: product.id,
          productName: product.name,
          expirationDate: product.expirationDate,
          unitCost: product.cost,
          unitPrice: product.price,
          quantity: Number(quantityInput.value),
          unitDiscount: 0,
          expirationStatus: product.expirationStatus,
        });
        } catch (error) {
          console.log(error);
        }
      }

      localStorage.setItem('activeCart', JSON.stringify(activeCart));
      console.log(activeCart);
    });
  } catch (error) {
    console.log(error);
  }
}