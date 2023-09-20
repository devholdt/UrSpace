import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/api.js";
import { httpRequest } from "./utilities/httpRequest.js";
import message from "./components/message.js";
import { URLS } from "./settings/constants.js";
import { saveToken, saveUser } from "./utilities/storage.js";

renderMenu();

const form = document.querySelector("form");
const usernameInput = document.getElementById("registerUsername");
const emailInput = document.getElementById("registerEmail");
const passwordInput = document.getElementById("registerPassword");

form.addEventListener("submit", handleRegistration);

/**
 * Handles the submission of a user registration form.
 *
 * This function prevents the default form submission behavior, collects
 * user input values, sends a registration request to the server, and
 * handles the response.
 *
 * @param {Event} event The event object representing the form submission.
 * @returns {Promise<void>} A Promise that resolves when the registration is complete.
 */
async function handleRegistration(event) {
  event.preventDefault();

  const registerUrl = `${API_BASE_URL}/social/auth/register`;

  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  if (username.length === 0 || email.length === 0 || password.length === 0) {
    message(
      "error",
      "Username, email and password required",
      ".message-container"
    );
    return;
  }

  const user = {
    name: username,
    email: email,
    password: password,
  };

  try {
    const response = await httpRequest(registerUrl, "POST", user);

    if (response) {
      const loginUrl = `${API_BASE_URL}/social/auth/login`;
      const loginData = {
        email: email,
        password: password,
      };

      try {
        const loginResponse = await httpRequest(loginUrl, "POST", loginData);

        if (loginResponse.accessToken) {
          const token = loginResponse.accessToken;
          saveToken(token);
          saveUser(JSON.stringify(loginResponse));

          message(
            "success",
            `User registration was successful, welcome ${loginResponse.name}`,
            ".message-container"
          );

          setTimeout(() => {
            window.location.href = URLS.HOME;
          }, 3000);
        } else {
          message(
            "error",
            "An error occured during auto-login",
            ".message-container"
          );
        }
      } catch (loginError) {
        console.log(loginError);
        message(
          "error",
          "An error occured during auto-login",
          ".message-container"
        );
      }
    } else {
      message(
        "error",
        "Please provide correct registration credentials",
        ".message-container"
      );
    }
  } catch (error) {
    console.log(error);
    message(
      "error",
      "An error occured when attempting user registration",
      ".message-container"
    );
  }
}
