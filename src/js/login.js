import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/api.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { saveToken, saveUser, getUser } from "./utilities/storage.js";
import { URLS } from "./settings/constants.js";
import message from "./components/message.js";

renderMenu();

// If user is already logged in, redirect to profile
const userData = getUser();
if (userData) {
  window.location.href = URLS.PROFILE;
}

const form = document.querySelector("form");
form.addEventListener("submit", handleLogin);

/**
 * Handles the submission of a user login form.
 *
 * This function prevents the default form submission behavior, collects
 * user input values, sends a login request to the server, and
 * handles the response.
 *
 * @param {Event} event The event object representing the form submission.
 * @returns {Promise<void>} A Promise that resolves when the login is complete.
 */
async function handleLogin(event) {
  event.preventDefault();

  const loginUrl = `${API_BASE_URL}/social/auth/login`;

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email.length === 0 || password.length === 0) {
    message("error", "Email and password are required");
    return;
  } else {
    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await httpRequest(loginUrl, "POST", user);

      if (!response) {
        message("error", "Please provide correct login credentials");
        return;
      } else if (response.accessToken) {
        const token = response.accessToken;
        saveToken(token);
        saveUser(JSON.stringify(response));

        message("success", `Login successful, welcome back ${response.name}`);

        setTimeout(() => {
          window.location.href = URLS.HOME;
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      message("error", "An error occured when attempting to log in");
    }
  }
}
