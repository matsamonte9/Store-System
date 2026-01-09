import { appState, domElements } from "../../globals.js";

export function orderStatusToggle() {
  domElements.navBarDOM.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.classList.contains('js-nav-bar-button')) {
      const status = el.dataset.status;
      fetchOrders(status, el);
    }
  });
}

export function runDefaultNav() {
  const defaultNav = document.querySelector('.js-nav-bar-button.on-this-nav');

  if (defaultNav) {
    fetchOrders(defaultNav.dataset.status, defaultNav);
  }
}

export async function fetchOrders(status, buttonEl) {
  const ordersContainerDOM = document.querySelector('.js-order-list-container');

  try {
    const { data } = await axios.get(`/api/v1/orders?status=${status}`, {
      withCredentials: true,
    });
    const orders = data.orders;

    if (!buttonEl.classList.contains('on-this-nav')) {
      turnOffPreviousButton();

      buttonEl.classList.add('on-this-nav');
    }
    
    const html = orders.map(order => {
      const statusClass = order.status === 'draft' ? 'red' 
      : order.status === 'pending' ? 'orange'
      : 'green';

      let deliveryDateClass = '';
      let deliveryDateText = 'No Date';

      if (order.deliveryDate) {
        const today = new Date();
        const delivery = new Date(order.deliveryDate);

        deliveryDateText = new Date(order.deliveryDate).toISOString().split('T')[0];

        const diffTime = delivery - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (order.status === 'completed') {
          deliveryDateClass = 'product-good-container';
        } else {
          if (diffDays < 0) {
            deliveryDateClass = 'product-expired-container';
          } else if (diffDays <= 3) {
            deliveryDateClass = 'product-expiring-container';
          } else {
            deliveryDateClass = 'product-good-container';
          }
        }
      }

      const toBuyCount = order.items
        .filter(item => item.itemType === "adding")
        .reduce((sum, item) => sum + item.quantity, 0);
      
      const replacementCount = order.items
        .filter(item => item.itemType === "replacement")
        .reduce((sum, item) => {
          const total = item.replacements?.reduce((rSum, r) => rSum + (r.quantity || 0), 0) || 0;
          return sum + total;
        }, 0);

      return `
        <div class="order-card">
          <div class="order-card-header">
            <div class="order-status-title ${statusClass}">
              ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
            <span class="js-view-order-button material-symbols-outlined order-icon" data-order-id="${order._id}">
              north_east
            </span>
          </div>
          <div class="order-card-details">
            <div class="order-card-details-title">
              Supplier Name:
            </div>
            <div class="order-card-details-info">
              ${order.supplierName || 'No Supplier Yet'}
            </div>
          </div>
          <div class="order-card-details">
            <div class="order-card-details-title">
              Delivery Date: 
            </div>
            <div class="order-card-details-info delivery-date ${deliveryDateClass}">
              ${deliveryDateText}
            </div>
          </div>
          <div class="order-card-details">
            <div class="order-card-details-title">
              Order Type: 
            </div>
            <div class="order-card-details-info">
              ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
            </div>
          </div>
          <div class="order-card-details-footer">
            <div class="order-card-details-footer-title">
              Items:
            </div>
            <div class="order-card-details-footer-info">
              <div class="footer-info">
                <div class="footer-item-classification">
                  <div class="footer-item-buy">
                    To Buy: ${toBuyCount}
                  </div>
                  <div class="footer-item-replacement">
                    Replacement: ${replacementCount}
                  </div>
                </div>
              </div>
              <div class="order-action">
                ${ order.status === 'draft'
                  ? `<span class="js-edit-draft-order-button material-symbols-outlined order-icon" data-order-id="${order._id}">
                        edit
                      </span>`
                  : order.status === 'pending'
                  ? `<span class="js-complete-order-button material-symbols-outlined order-complete-icon" data-order-id="${order._id}">
                      check
                    </span>`
                  : ''
                }
                <span class="js-delete-order-button material-symbols-outlined order-delete-icon" data-order-id="${order._id}">
                  delete  
                </span>
              </div>  
            </div>
          </div>
        </div>
      `;
    }).join('');

    ordersContainerDOM.innerHTML = html;

    if (appState.currentPreviewOrderId) {
      const stillThereBtn = document.querySelector(`.js-view-order-button[data-order-id="${appState.currentPreviewOrderId}"]`);

      if (stillThereBtn) {
        stillThereBtn.classList.add('viewing');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function turnOffPreviousButton() {
  const previousButton = document.querySelector('.on-this-nav');

  if (previousButton) {
    previousButton.classList.remove('on-this-nav');
  }
}