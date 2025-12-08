import { domElements } from "../globals.js";

export function renderInventoryPage() {
  const html = `
    <div class="page-title">
      Inventory
    </div>
    <div class="inventory-product-stats-container">
      <div class="inventory-product-stats">
        <div class="inventory-stats-title">
          Total Products
        </div>
        <div class="js-total-products-count inventory-stats-count">
          <!-- Total Products Count -->
        </div>
      </div>
      <div class="extra-div">
        <div class="divider-vertical"></div>
        <div class="inventory-product-stats">
          <div class="inventory-stats-title">
          Low Stock Products
          </div>
          <div class="js-low-stock-count inventory-stats-count">
            <!-- Low Stock Products Count -->
          </div>
        </div>
      </div>
      <div class="extra-div">
        <div class="divider-vertical"></div>
        <div class="inventory-product-stats">
          <div class="inventory-stats-title">
            Out of Stock Products
          </div>
        <div class="js-out-of-stock-count inventory-stats-count">
          <!-- Out of Stock Products Count -->
        </div> 
        </div> 
      </div>
      <div class="extra-div">
        <div class="divider-vertical"></div>
        <div class="inventory-product-stats">
          <div class="inventory-stats-title">
            Near Expiration Products
          </div>
          <div class="js-near-expiration-count inventory-stats-count">
            <!-- Near Expiring Products Count -->
          </div>
        </div>
      </div>
      <div class="extra-div">
        <div class="divider-vertical"></div>
        <div class="inventory-product-stats">
          <div class="inventory-stats-title">
            Expired Products
          </div>
          <div class="js-expired-count inventory-stats-count">
            <!-- Expired Products Count -->
          </div>
        </div>
      </div>
    </div>

    <div class="js-create-order">
      <div class="js-inventory-product-list inventory-product-list">
        <div class="inventory-product-list-header">
          <div class="inventory-product-list-customization">
            <div class="inventory-search-bar">
              <span class="material-symbols-outlined search-icon js-search-icon">
                search
              </span>
              <input class="js-search-input search-input" type="search" placeholder="Search product...">
            </div>
            <div class="divider-vertical"></div>
            <div class="js-add-product-button add-product-button">
              <div class="add-product">
                Add Product
              </div>
              <span class="material-symbols-outlined add-product-icon">
                add
              </span>
            </div>
            <div class="js-create-order-button add-product-button">
              <div class="add-product">
                Create Order
              </div>
              <span class="material-symbols-outlined add-product-icon">
                add
              </span>
            </div>
          </div>

          <div class="inventory-category-selector">
            <div class="js-inventory-sort inventory-sort">
              <div class="js-sort-button category-selector-title">
                <span class="material-symbols-outlined sort-icon">
                  swap_vert
                </span>
                <div class="sort">
                  Sort by
                </div>
              </div>
              <div id="js-sortSelect" class="js-sort-modal sort-modal hidden">
                <!-- Sort Dropdown -->
              </div>
            </div>
            <div class="js-inventory-filter inventory-filter">
              <div class="js-filter-button category-selector-title">
                <span class="material-symbols-outlined filter-icon">
                  filter_alt
                </span>
                <div class="filter">
                  Filter
                </div>
              </div>
              <div class="js-filter-modal filter-modal hidden">
                <!-- Filter Modal -->
              </div>
            </div>
          </div>
        </div>
        
        <div class="inventory-list-title-container">
          <div class="list-title">
            Image
          </div>
          <div class="list-title">
            Product Name
          </div>
          <div class="list-title">
            Barcode
          </div>
          <div class="list-title">
            Cost
          </div>
          <div class="list-title">
            Price
          </div>
          <div class="list-title">
            Stock
          </div>
          <div class="list-title">
            Expiration
          </div>
          <div class="list-title">
            <!-- Action Button -->
          </div>
        </div>
        <div class="js-inventory-row-list-container inventory-row-list-container">
          <!-- Products -->
        </div>

        <div class="inventory-pagination-container">
          <div class="inventory-pagination-left">
            <div class="js-pagination-result pagination-result pagination-text">
            </div>
            <div class="js-limit-button limit-button">
              <div class="js-limit-dropup pagination-dropdown-num pagination-text">
                
              </div>
              <span class="material-symbols-outlined">
                keyboard_arrow_up
              </span>
            </div>
            <div class="js-limit-modal limit-modal hidden">
              <!-- Limit Modal -->
            </div>
          </div>


          <div class="js-pagination inventory-pagination-right">
            
          </div>
        </div>
      </div>

      <div class="js-create-order-container create-order-container hidden">
        
      </div>
    </div>
  `;

  domElements.mainContentDOM.innerHTML = html;
}