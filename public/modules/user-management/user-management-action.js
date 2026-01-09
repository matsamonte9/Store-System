import { appState, domElements } from "../../globals.js";

import { showUsers } from "./users.js";

let userManagementClickHandler = null;
let createUserClickHandler = null;

export function setupUserManagementAction() {
  handleFilterModal();
  handleCreateUser();
}

function handleCreateUser() {
  if (createUserClickHandler) {
    domElements.userManagementActionDOM.removeEventListener('click', createUserClickHandler);
  }

  createUserClickHandler = (e) => {
    const createUserButton = e.target.closest('.js-create-user-button');
    if (!createUserButton) return;

    createUserModal();
  }

  domElements.userManagementActionDOM.addEventListener('click', createUserClickHandler);
}

function createUserModal() {
  const html = `
    <div class="js-modal-overlay modal-overlay">
      <div class="modal-content-container">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              Create User
            </div>
            <div class="js-modal-close-button modal-close-button">
              X
            </div>
          </div>

          <div class="modal-body">

            <div class="input-container">
              <div class="modal-form-title">
                Name:
              </div>
              <div class="input-area">
                <input class="js-name-input modal-input" type="text" placeholder="ex. Juan Dela Cruz">
              </div>
              <div class="modal-form-error">
                
              </div>
            </div>

            <div class="input-container">
              <div class="modal-form-title">
                Email:
              </div>
              <div class="input-area">
                <input class="js-email-input modal-input" type="email" placeholder="juandelacruz@example.com">
              </div>
              <div class="modal-form-error">
                
              </div>
            </div>

            <div class="input-container">
              <div class="modal-form-title">
                Password:
              </div>
              <div class="input-area">
                <input class="js-password-input modal-input" type="password" placeholder="*********">
              </div>
              <div class="modal-form-error">
                
              </div>
            </div>

            <div class="input-container">
              <div class="modal-form-title">
                Role:
              </div>
              <select class="js-role-input add-product-dropdown">
                <option value="admin">
                  Admin
                </option>
                <option value="cashier">
                  Cashier
                </option>
                <option value="inventory">
                  Inventory
                </option>
              </select>
            </div>



          </div>
          
          <div class="modal-footer">
            <div class="js-create-user-submit add-button">
              Create User
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
  
  const overlayDOM = document.querySelector('.js-modal-overlay');
  const closeButton = document.querySelector('.js-modal-close-button');
  const submitButton = document.querySelector('.js-create-user-submit');

  overlayDOM.addEventListener('click', (e) => {
    if (e.target === overlayDOM || e.target === closeButton) {
      overlayDOM.remove();
    }
  });

  submitButton.addEventListener('click', async () => {
    try {
      const nameInput = overlayDOM.querySelector('.js-name-input').value;
      const emailInput = overlayDOM.querySelector('.js-email-input').value;
      const passwordInput = overlayDOM.querySelector('.js-password-input').value;
      const roleInput = overlayDOM.querySelector('.js-role-input').value;

      const { data } = await axios.post(
        `/api/v1/user-management`, 
        { name: nameInput, email: emailInput, password: passwordInput, role: roleInput, },
        { withCredentials: true }
      );

      overlayDOM.remove();

      showUsers(appState.userManagementCurrentFilter);
    } catch (error) {
      console.log(error);
    }
  });
}

function handleFilterModal() {
  const filterDOM = document.querySelector('.js-user-management-filter-button');
  const filterModalDOM = document.querySelector('.js-user-management-filter-modal');

  if (userManagementClickHandler) {
    domElements.userManagementActionDOM.removeEventListener('click', userManagementClickHandler);
  }

  userManagementClickHandler = (e) => {
    if (e.target.closest('.js-user-management-filter-button')) {
      toggleUserManagementFilterModal(filterDOM, filterModalDOM);
    }

    if (e.target.closest('.js-user-management-filter-modal')) {
      selectFilterOption(e, filterDOM, filterModalDOM);
    }
  }

  domElements.userManagementActionDOM.addEventListener('click', userManagementClickHandler);
}

function toggleUserManagementFilterModal(filterDOM, filterModalDOM) {
  const html = `
    <div class="option option-divider" data-filter="">
      Show All
    </div>
    <div class="option option-divider" data-filter="admin">
      Admin
    </div>
    <div class="option option-divider" data-filter="cashier">
      Cashier
    </div>
    <div class="option option-divider" data-filter="inventory">
      Inventory
    </div>
  `;

  const isHidden = filterModalDOM.classList.contains('hidden');

  if (isHidden) {
    filterModalDOM.classList.remove('hidden');
    filterModalDOM.innerHTML = html;
    filterDOM.classList.add('current-dropdown');
  } else {
    filterModalDOM.classList.add('hidden');
    filterDOM.classList.remove('current-dropdown');
  }
}

function selectFilterOption(e, filterDOM, filterModalDOM) {
  appState.userManagementCurrentFilter = e.target.dataset.filter;
  showUsers(appState.userManagementCurrentFilter);
  filterDOM.classList.remove('current-dropdown');
  filterModalDOM.classList.add('hidden');
}   