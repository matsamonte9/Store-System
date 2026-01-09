import { domElements } from "../globals.js";

export function renderUserManagementPage() {
  const html = `
    <div class="page-title">
      User Management
    </div>

    <div class="js-user-management-action user-management-action">
      <div class="js-create-user-button create-user-button"> 
        <div> 
          Create User 
        </div>
        <span class="material-symbols-outlined add-product-icon">
          add
        </span>
      </div>
      <div class="inventory-filter">
        <div class="js-user-management-filter-button user-management-filter-button">
          <span class="material-symbols-outlined">
            filter_alt
          </span>
        </div>
        <div class="js-user-management-filter-modal filter-modal user-management-filter-modal hidden">
          
        </div>
      </div>
    </div>

    <div class="js-user-list-container order-list-container">
      
    </div>
  `;

  domElements.mainContentDOM.innerHTML = html;
}