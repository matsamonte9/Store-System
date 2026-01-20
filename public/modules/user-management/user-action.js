import { appState, domElements } from "../../globals.js";
import { showUsers } from "./users.js";

import { successModal, errorModal } from "../shared/modals.js";

export function handleUserAction() {
  domElements.userListContainerDOM.addEventListener('click', async (e) => {

    const deleteButton = e.target.closest('.js-delete-user-button');
    if (deleteButton) {
      deleteUserModal(deleteButton);
    }

    const editButton = e.target.closest('.js-edit-user-button');
    if (editButton) {
      const userId = editButton.dataset.userId;
      editButton.classList.replace('order-icon', 'editing-user-icon');
      editUserModal(userId, editButton);
    }
  });
}

async function editUserModal(userId, buttonDOM) {
  try {
    const { data: { user } } = await axios.get(`/api/v1/user-management/${userId}`);

    const html = `
      <div class="js-modal-overlay modal-overlay">
        <div class="modal-content-container">
          <div class="edit-modal-content">
            <div class="modal-header">
              <div class="modal-title">
                Edit User
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
                  <input class="js-name-input modal-input" type="text" placeholder="Name" value="${user.name}">
                </div>
                <div class="js-error-name modal-form-error">
                
                </div>
              </div>

              <div class="input-container">
                <div class="modal-form-title">
                  Email:
                </div>
                <div class="input-area">
                  <input class="modal-input" type="text" placeholder="Email" value="${user.email}" disabled>
                </div>
                <div class="js-error-email modal-form-error">
                
                </div>
              </div>

              <div class="input-container">
                <div class="modal-form-title">
                  Role:
                </div>
                <select class="js-role-input add-product-dropdown">
                  <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>
                    Admin
                  </option>
                  <option value="cashier" ${user.role === 'cashier' ? 'selected' : ''}>
                    Cashier
                  </option>
                  <option value="inventory" ${user.role === 'inventory' ? 'selected' : ''}>
                    Inventory
                  </option>
                </select>
                <div class="js-error-role modal-form-error">
                
                </div>
              </div>

              ${user.role !== 'inventory'
                ? `
                <div class="two-column-form-container">
                  <div class="two-column">
                    <div class="modal-form-title">
                      Total Money 
                    </div>
                    <div class="input-area">
                      <input class="js-total-money-input modal-input short-input no-spinner-input" type="number" value="${user.dailyStats.totalMoney}" placeholder="Total Money">
                    </div>
                    <div class="js-error-totalMoney modal-form-error">
                
                    </div>
                  </div>
                  <div class="two-column">
                    <div class="modal-form-title">
                      Daily Sales
                    </div>
                    <div class="input-area">
                      <input class="js-daily-sales-input modal-input short-input no-spinner-input" type="number" value="${user.dailyStats.dailySales}" placeholder="Daily Sales">
                    </div>
                    <div class="js-error-dailySales modal-form-error">
                
                    </div>
                  </div>
                </div>

                <div class="two-column-form-container">
                  <div class="two-column">
                    <div class="modal-form-title">
                      Daily Profit 
                    </div>
                    <div class="input-area">
                      <input class="js-daily-profit-input modal-input short-input no-spinner-input" type="number" value="${user.dailyStats.dailyProfit}" placeholder="Daily Profit">
                    </div>
                    <div class="js-error-dailyProfit modal-form-error">
                
                    </div>
                  </div>
                  <div class="two-column">
                    <div class="modal-form-title">
                      Transaction Count
                    </div>
                    <div class="input-area">
                      <input class="js-transaction-count-input modal-input short-input no-spinner-input" type="number" value="${user.dailyStats.transactionCount}" placeholder="Transaction Count">
                    </div>
                    <div class="js-error-transactionCount modal-form-error">
                
                    </div>
                  </div>
                </div>
              `
              : ''
              }

            </div>
            
            <div class="modal-footer">
              <div class="js-edit-user-submit add-button">
                Edit User
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    const overlayDOM = document.querySelector('.js-modal-overlay');
    const closeButton = document.querySelector('.js-modal-close-button');
    const submitButton = document.querySelector('.js-edit-user-submit');

    overlayDOM.addEventListener('click', (e) => {
      if (e.target === overlayDOM || e.target === closeButton) {
        overlayDOM.remove();
        buttonDOM.classList.replace('editing-user-icon', 'order-icon');
      }
    });

    submitButton.addEventListener('click', async () => {
      try {
        const nameInput = overlayDOM.querySelector('.js-name-input').value;
        const roleInput = overlayDOM.querySelector('.js-role-input').value;

        let dailyStats = null;

        if (roleInput === 'admin' || roleInput === 'cashier') {
          const totalMoneyInput = overlayDOM.querySelector('.js-total-money-input');
  
          if (totalMoneyInput) {
            dailyStats = {
              totalMoney: Number(totalMoneyInput.value),
              dailySales: Number(overlayDOM.querySelector('.js-daily-sales-input').value),
              dailyProfit: Number(overlayDOM.querySelector('.js-daily-profit-input').value),
              transactionCount: Number(overlayDOM.querySelector('.js-transaction-count-input').value)
            };
          }
        }

        const { data } = await axios.patch(
          `/api/v1/user-management/${user._id}`, 
          { name: nameInput, role: roleInput, dailyStats },
          { withCredentials: true }
        );

        overlayDOM.remove();
        buttonDOM.classList.replace('editing-user-icon', 'order-icon');

        showUsers(appState.userManagementCurrentFilter);

        successModal(data.msg);
      } catch (error) {
        document.querySelectorAll('.modal-form-error').forEach(pastError => pastError.textContent = '');
        const errmsg = error?.response?.data.msg;
        const path = error.response.data.path;

        if (path) {
          document.querySelector(`.js-error-${path}`).textContent = errmsg;
        } else {
          overlayDOM.remove();
          errorModal(errmsg);
          buttonDOM.classList.replace('editing-user-icon', 'order-icon');
        }
      }
    });

  } catch (error) {
    const errmsg = error.response.data.msg;
    errorModal(errmsg);
  }
}

function deleteUserModal(deleteButton) {
  const userId = deleteButton.dataset.userId;

  const html = `
    <div class="js-modal-overlay modal-overlay">
      <div class="warning-modal-content-container">
        <div class="modal-content">
          <div class="modal-header">
          </div>

          <div class="modal-body">
            <div class="warning-modal-body">
              <div class="warning-logo-container logo-container">
                <img src="./warning-delete-logo.png" class="warning-logo">
              </div>
              <div class="warning-title">
                Delete
              </div>
              <div class="warning-subtitle">
                Are you sure you would like to do this?
              </div>
            </div>
          </div>
          
          <div class="warning-modal-footer">
            <div class="js-cancel-button cancel-button">
              Cancel
            </div>
            <div class="js-confirm-button confirm-button">
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const overlayDOM = document.querySelector('.js-modal-overlay');
  const closeButton = overlayDOM.querySelector('.js-cancel-button');
  const confirmButton = overlayDOM.querySelector('.js-confirm-button');

  overlayDOM.addEventListener('click', (e) => {
    if (e.target === overlayDOM || e.target === closeButton) {
      overlayDOM.remove();
    }
  });

  confirmButton.addEventListener('click', async () => {
    try {
      const { data } = await axios.delete(`/api/v1/user-management/${userId}`, {
        withCredentials: true,
      });

      showUsers(appState.userManagementCurrentFilter);

      overlayDOM.remove();
      successModal(data.msg);
    } catch (error) {
      const errmsg = error.response.data.msg;
      errorModal(errmsg);
    }
  });
}