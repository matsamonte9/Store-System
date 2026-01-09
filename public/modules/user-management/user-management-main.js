import { appState, domElements } from "../../globals.js";

import { setupUserManagementAction } from "./user-management-action.js";
import { showUsers } from "./users.js";
import { handleUserAction } from "./user-action.js";

export function initUserManagementPage() {
  domElements.userListContainerDOM = document.querySelector('.js-user-list-container');
  domElements.userManagementActionDOM = document.querySelector('.js-user-management-action');

  showUsers(appState.userManagementCurrentFilter);
  setupUserManagementAction();
  handleUserAction(); 
}