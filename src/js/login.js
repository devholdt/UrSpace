import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/api.js";
import { saveToken, saveUser } from "./utilities/storage.js";
import message from "./components/message.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { URLS } from "./settings/constants.js";

renderMenu();

const form = document.querySelector("form");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

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

  const email = emailInput.value;
  const password = passwordInput.value;

  if (email.length === 0 || password.length === 0) {
    message("error", "Email and password are required", ".message-container");
    return;
  } else {
    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await httpRequest(loginUrl, "POST", user);

      if (!response) {
        message(
          "error",
          "Please provide correct login credentials",
          ".message-container"
        );
        return;
      } else if (response.accessToken) {
        const token = response.accessToken;
        saveToken(token);
        saveUser(JSON.stringify(response));

        message(
          "success",
          `Login successful, welcome back ${response.name}`,
          ".message-container"
        );

        setTimeout(() => {
          window.location.href = URLS.HOME;
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      message(
        "error",
        "An error occured when attempting to log in",
        ".message-container"
      );
    }
  }
}

// mathi_test
// mathi_test@noroff.no
// password123bad
