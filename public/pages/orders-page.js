import { appState, domElements } from "../globals.js";

export function renderOrdersPage() {
  let html = '';

  if (appState.currentUser.role === 'admin' || appState.currentUser.role === 'inventory') {
    html = `
      <div class="js-nav-bar orders-nav-bar">
        <div class="js-nav-bar-button create-order-nav nav-bar on-this-nav" data-status="drafts">
          Drafts
        </div>
        <div class="js-nav-bar-button pending-nav nav-bar" data-status="pendings">
          Pendings
        </div>
        <div class="js-nav-bar-button completed-nav nav-bar" data-status="completed">
          Completed
        </div>
      </div>

      <div class="js-order-list-container order-list-container">
        
      </div>
    `;
  } else {
    html = '<h1>No Access To This Route</h1>';
  }

  domElements.mainContentDOM.innerHTML = html;
}