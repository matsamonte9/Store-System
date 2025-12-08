import { domElements } from "../../globals.js";

import { orderStatusToggle, runDefaultNav } from "./orders.js";
import { editDraftOrder } from "./edit-draft-order.js";
import { deleteOrder } from "./delete-order.js";

import { itemsActionOrders } from "./items-action.js"
import { completeOrder } from "./complete-order.js";
import { viewOrder } from "./view-order.js";

export function initOrdersPage() {
  domElements.navBarDOM = document.querySelector('.js-nav-bar');
  domElements.orderContainerDOM = document.querySelector('.js-order-list-container');
  // domElements.viewOrderDOM = document.querySelector('.js-view-order');

  orderStatusToggle();
  runDefaultNav();
  editDraftOrder();
  viewOrder();
  deleteOrder();

  itemsActionOrders();
  completeOrder();
}