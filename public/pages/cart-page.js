import { domElements } from "../globals.js";

export function renderCartPage() {
  const html = `
    <div class="cart-main-buttons">
      <div class="js-add-to-cart-button add-to-cart-button"> 
        <div> 
          Add to Cart 
        </div>
        <span class="material-symbols-outlined add-product-icon">
          add
        </span>
      </div>
      <div class="js-pause-cart-button add-to-cart-button"> 
        <div> 
          Pause Cart
        </div>
        <span class="material-symbols-outlined add-product-icon">
          pause
        </span>
      </div>
    </div>

    <div class="cart-container">
      <div class="js-cart-order-summary cart-order-summary">
        <div class="order-summary-header">
          <div class="list-title">
            Image
          </div>
          <div class="list-title">
            Product Name
          </div>
          <div class="list-title">
            Expiration
          </div>
          <div class="list-title">
            Unit Cost
          </div>
          <div class="list-title">
            Unit Price
          </div>
          <div class="list-title">
            Qty
          </div>
          <div class="discount-container"> 
            <div class="list-title">
              Unit Disc 
            </div>
          </div>
          <div class="list-title">
            Total
          </div>
          <div class="list-title">
            
          </div>
        </div>
        
        <div class="js-cart-row-list-container cart-row-list-container">
          
        </div>
      </div>

      <div>
        <div class="js-cart-payment-summary cart-payment-summary">
          <div class="store-details">
            <div class="store-name"> 
              Ma. Jesusa Gen. Merch.
            </div>

            <div> Purok 8 Bo. Militar Palayan City </div>
            <div> +639292292312 </div>
            <div>Date: 2025-08-25</div>
          </div>
          
          <hr>

          <div class="receipt-item-list-header"> 
            <div>Name</div>
            <div>Qty</div>
            <div>Price</div>
          </div>

          <div class="js-receipt-item receipt-item">
            
          </div>

          <hr>
          <div class="receipt-total">
            <strong>Total</strong>
            <strong class="js-receipt-total"></strong>
          </div>
          <p class="receipt-thanks">Thank you for shopping!</p>
          <p class="receipt-thanks">This receipt is for reference only and cannot be used for tax claiming or official accounting purposes.</p>
        </div>
        <div class="js-print-receipt print-receipt add-button">
          Print Receipt
        </div>
      </div>
    </div>
  `;

  domElements.mainContentDOM.innerHTML = html;
}