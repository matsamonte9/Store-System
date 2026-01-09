import { appState, domElements } from "../globals.js";

export async function renderDashboardPage() {
  try {
    const { data: { stats } } = await axios.get('/api/v1/dashboard', {
      withCredentials: true
    });

    let html = '';

    if (appState.currentUser.role === 'admin' || appState.currentUser.role === 'cashier') {
      html = `
        <div class="page-title">
          Dashboard
        </div>

        <div class="money-stats">
          <div class="money-stats-container total-money">
            <div class="money-stats-title">
              Total Money
            </div>
            <div class="money-stats-count">
              ${stats.totalMoney}
            </div>
          </div>
          <div class="money-stats-container sales">
            <div class="money-stats-title">
              Sales
            </div>
            <div class="money-stats-count">
              ${stats.dailySales}
            </div>
          </div>
          <div class="money-stats-container profit">
            <div class="money-stats-title">
              Profit
            </div>
            <div class="money-stats-count">
              ${stats.dailyProfit}
            </div>
          </div>
          <div class="money-stats-container">
            <div class="money-stats-title">
              Transaction Count
            </div>
            <div class="money-stats-count">
              ${stats.transactionCount}
            </div>
          </div>
        </div>

        <div class="command-container">
          <div class="cart-command command">
            Cart (F2)
          </div>
          <div class="check-price-command command">
            Check Price (F4)
          </div>
        </div>
      `;
    } else {
      html = '<h1>No Access To This Route</h1>'
    }

    domElements.mainContentDOM.innerHTML = html;
  } catch (error) {
    console.log(error);
  }
}
