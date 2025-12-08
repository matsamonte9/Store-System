import { fetchProductsFromCart } from "./cart.js";
import { fetchProductsToReceipt } from "./receipt.js";

export async function addToCartModal() {
  const addToCartButton = document.querySelector('.js-add-to-cart-button');

  addToCartButton.addEventListener('click', async () => {
    const html = `
      <div class="js-modal-overlay modal-overlay">
        <div class="modal-content-container add-to-cart-container">
          <div class="modal-header modal-header-cart">
            <div class="modal-title">
              Add to Cart
            </div>
            <div class="js-modal-close-button modal-close-button">
              X
            </div>
          </div>
          <div class="modal-body-cart">
            <div class="search-container">
              <div class="inventory-search-bar">
                <span class="js-search-button material-symbols-outlined search-icon">
                  search
                </span>
                <input class="js-search-input search-input" type="text" placeholder="Search by Name or Barcode...">
              </div>
            </div>

            <div class="js-add-to-cart-product-list-container add-to-cart-product-list-container">
              
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    const cartProductList = document.querySelector('.js-add-to-cart-product-list-container');
    const searchButton = document.querySelector('.js-search-button');
    const searchInput = document.querySelector('.js-search-input');
    const productList = document.querySelector('.js-add-to-cart-product-list-container');

    async function fetchSearchProducts(query = '') {
      try {
        const { data: { products } } = await axios.get(`/api/v1/products?name=${query}&limit=3`);

        const searchProducts = products.map(product => {
          return `
            <div class="add-to-cart-row-list">
              <img class="product-img-list" src="./chippy.jpg">
              <div class="product-details">
                ${product.name}
              </div>
              <div class="product-details add-to-cart-stock">
                ${product.stock}
              </div>
              <div class="product-details add-to-cart-stock">
                <span class="js-add-to-cart-product-button material-symbols-outlined add-product-icon inventory-add-to-cart-button" data-product-id="${product.id}">
                  add
                </span>
              </div>
            </div>`;
        }).join('');

        cartProductList.innerHTML = searchProducts;
      } catch (error) {
        console.log(error);
      }
    }

    fetchSearchProducts('');

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        fetchSearchProducts(searchInput.value.trim());
      }
    });

    searchButton.addEventListener('click', () => {
      fetchSearchProducts(searchInput.value.trim());
    });

    productList.addEventListener('click', async (e) => {
      const el = e.target;

      if (el.classList.contains('js-add-to-cart-product-button')) {
        const productId = el.dataset.productId;

        const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');

        const existingProduct = activeCart.find(p => p.productId === productId);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          try { 
            const { data: { product } } = await axios.get(`/api/v1/products/${productId}`);

            activeCart.push({ 
            productId: product.id,
            productName: product.name,
            expirationDate: product.expirationDate,
            unitCost: product.cost,
            unitPrice: product.price,
            quantity: 1,
            unitDiscount: 0,
            expirationStatus: product.expirationStatus,
          });
          } catch (error) {
            console.log(error);
          }
        }

        localStorage.setItem('activeCart', JSON.stringify(activeCart));
      }

      fetchProductsFromCart();
      fetchProductsToReceipt();
    });

    document.querySelector('.js-modal-close-button').addEventListener('click', () => {
      document.querySelector('.js-modal-overlay').remove();
    });
  });
}