import { appState } from "../../globals.js";

export async function logoutAction() {

  try {
    const { data } = await axios.post('/api/v1/auth/logout', 
      {}, 
      { withCredentials: true }
    );

    appState.currentUser = null;
    window.location.href = '/login.html';
    console.log(data.msg);
  } catch (error) {
    console.log(error);
  }
}