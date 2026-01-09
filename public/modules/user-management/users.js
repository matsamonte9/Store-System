import { appState, domElements } from "../../globals.js";

export const showUsers = async (filterValue = '') => {
  try {
    const { data: { users } } = await axios.get('/api/v1/user-management', {
      params: {
        filter: filterValue,
      },
      withCredentials: true,
    });

    const allUsers = users.map(user => {
      const { _id: userId, name, role, email, dailyStats } = user;

      return `
        <div class="order-card">
          <div class="order-card-details">
            <div class="order-card-details-title">
              Name:
            </div>
            <div class="order-card-details-info">
              ${name}
            </div>
          </div>
          <div class="order-card-details">
            <div class="order-card-details-title">
              Email:
            </div>
            <div class="order-card-details-info delivery-date">
              ${email}
            </div>
          </div>
          <div class="order-card-details">
            <div class="order-card-details-title">
              Role: 
            </div>
            <div class="order-card-details-info">
              ${role}
            </div>
          </div>
          ${dailyStats
            ? `
              <div class="order-card-details-footer">
                <div class="order-card-details-footer-title">
                  Daily Stats:
                </div>
                <div class="order-card-details-footer-info">
                  <div class="footer-info">
                    <div class="footer-item-classification">
                      <div class="footer-item-buy">
                        Money: ${dailyStats.totalMoney}
                      </div>
                      <div class="footer-item-buy" style="color: blue">
                        Sales: ${dailyStats.dailySales}
                      </div>
                      <div class="footer-item-buy" style="color: green">
                        Profit: ${dailyStats.dailyProfit}
                      </div>
                      <div class="footer-item-buy">
                        Transaction: ${dailyStats.transactionCount}
                      </div>
                    </div>
                  </div>
                  <div class="order-action">
                    <span class="js-edit-user-button material-symbols-outlined order-icon" data-user-id="${userId}">
                      edit
                    </span>
                    <span class="js-delete-user-button material-symbols-outlined order-delete-icon" data-user-id="${userId}">
                      delete  
                    </span>
                  </div>  
                </div>
              </div>
            `
            : `
              <div class="order-card-details-footer">
                <div class="order-card-details-footer-title">
                  Daily Stats:
                </div>
                <div class="no-stats order-card-details-footer-info">
                  <div class="footer-info">
                    <div class="footer-item-classification">
                      <div class="footer-item-buy">
                        N/A
                      </div>
                    </div>
                  </div>
                  <div class="order-action">
                    <span class="js-edit-user-button material-symbols-outlined order-icon" data-user-id="${userId}">
                      edit
                    </span>
                    <span class="js-delete-user-button material-symbols-outlined order-delete-icon" data-user-id="${userId}">
                      delete  
                    </span>
                  </div>  
                </div>
              </div>
              `
          }
        </div>
      `;
    }).join(' ');

    domElements.userListContainerDOM.innerHTML = allUsers;
  } catch (error) {
    console.log(error);
  }
}