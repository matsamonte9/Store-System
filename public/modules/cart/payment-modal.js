import { appState } from "../../globals.js";
import { fetchProductsFromCart } from "./cart.js";
import { fetchProductsToReceipt } from "./receipt.js";

export function paymentModal(totalAmount) {
  const html = `
    <div class="js-modal-overlay modal-overlay">
      <div class="warning-modal-content-container">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              Payment
            </div>
            <div class="js-modal-close-button modal-close-button">X</div>
          </div>

          <div class="modal-body payment-modal-body">
            <div class="payment-row-container">
              <div class="payment-title">
                Cash
              </div>
              <div class="js-payment-cash payment-document">
                <div class="currency-input-wrapper">
                  <input type="number" class="js-payment-input no-spinner-input payment-input"  autofocus>
                </div>
              </div>
            </div> 
            <div class="payment-row-container">
              <div class="payment-title">
                Due Amount
              </div>
              <div class="js-total-amount payment-document">
                ${totalAmount}
              </div>
            </div> 
            <div class="payment-row-container">
              <div class="payment-title"> 
                Change
              </div>
              <div class="js-change payment-document ">
                
              </div>
            </div>          
          </div>

          <div class="modal-footer">
            <div class="js-complete-transaction-button add-button complete-transaction-button">
              Complete Transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const overlayDOM = document.querySelector('.js-modal-overlay');
  const closeButton = overlayDOM.querySelector('.js-modal-close-button');
  const completeButton = overlayDOM.querySelector('.js-complete-transaction-button');

  closeButton.addEventListener('click', () => overlayDOM.remove());

  completeButton.addEventListener('click', async () => {
    const activeCart = JSON.parse(localStorage.getItem('activeCart') || '[]');
    const cashInput = document.querySelector('.js-payment-input');

    completeButton.disabled = true;
    completeButton.textContent = 'Processing...';

    if (!appState.cartToken) {
      alert('Cart validation expired. Please validate again.');
      overlayDOM.remove();
      return;
    }

    try {
      const totalAmountElement = document.querySelector('.js-total-amount');
      const cashElement = document.querySelector('.js-payment-cash');
      const changeElement = document.querySelector('.js-change');

      const { data: { msg, totalAmount, cashValue, change } } = await axios.post('/api/v1/cart/decrease-product-stock', {
        cartToken: appState.cartToken,
        cash: Number(cashInput.value)
      }, {
        withCredentials: true
      });

      alert(msg || 'Transaction completed successfully');
      localStorage.removeItem('activeCart');
      appState.cartToken = null;
      appState.stockWarnings = [];
      fetchProductsFromCart();
      fetchProductsToReceipt();

      totalAmountElement.textContent = totalAmount;
      cashElement.innerHTML = `
        <div>
          ${cashValue}
        </div>
      `;
      changeElement.textContent = change;
      
      completeButton.innerHTML = `
        <div>
          Transaction Complete
        </div>
        <span class="material-symbols-outlined" style="color: #75FB4C">
          check_circle
        </span>
      `;
      // overlayDOM.remove();
    } catch (error) {
      completeButton.disabled = false;
      completeButton.textContent = 'Complete Transaction';
      appState.cartToken = null;
      console.log(error);
    }
  });
}