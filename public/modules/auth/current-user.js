import { appState } from "../../globals.js";

export async function fetchCurrentUser() {
  try {
    const { data } = await axios.get('/api/v1/auth/current-user', {
      withCredentials: true
    });
    appState.currentUser = data.user;
  } catch (err) {
    appState.currentUser = null;
    window.location.href = '/login.html';
  }
}
