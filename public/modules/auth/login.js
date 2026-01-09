import { appState } from "../../globals.js";

function loginAction() {
  const loginButton = document.querySelector('.js-login-button');

  loginButton.addEventListener('click', async () => {
    const email = document.querySelector('.js-email-input').value.trim();
    const password = document.querySelector('.js-password-input').value.trim();
    const errorDisplay = document.querySelector('.js-error-display');

    errorDisplay.classList.add('hidden');
    errorDisplay.textContent = '';
    
    if (!email || !password) {
      errorDisplay.textContent = 'Please Provide Email and Password';
      errorDisplay.classList.remove('hidden');
      return;
    }

    loginButton.disabled = true;

    try {
      const { data } = await axios.post('/api/v1/auth/login', 
        { email, password },
        { withCredentials: true },
      );

      const user = data.user;
      appState.currentUser = user;
      window.location.href = '/index.html';
    } catch (error) {
      errorDisplay.textContent = error.response?.data?.msg || 'Login Failed';
      errorDisplay.classList.remove('hidden');
    } finally {
      loginButton.disabled = false;
    }
  });
}

loginAction();