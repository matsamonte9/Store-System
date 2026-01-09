export function applyRoleBasedUI(role) {
  const roleAccess = {
    admin: [
      'dashboard',
      'inventory',
      'orders',
      'check-price',
      'cart',
      'user-management',
    ],
    cashier: [
      'dashboard',
      'check-price',
      'cart',
    ],
    inventory: [
      'inventory',
      'orders',
      'check-price',
    ],
  };

  const map = {
    dashboard: '.js-sidebar-dashboard',
    inventory: '.js-sidebar-inventory',
    orders: '.js-sidebar-orders',
    'check-price': '.js-sidebar-check-price',
    cart: '.js-sidebar-cart',
    'user-management': '.js-sidebar-user-management',
  };

  const allowed = roleAccess[role] || [];

  Object.entries(map).forEach(([key, selector]) => {
    const el = document.querySelector(selector);
    if (!el) return;

    el.classList.toggle('hidden', !allowed.includes(key));
  });
}