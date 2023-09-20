import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/api.js";

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
    return;
  } else {
    const user = {
      name: username,
      email: email,
      password: password,
    };

    try {
      const postData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };

      const response = await fetch(registerUrl, postData);
      console.log(response);

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        // Success message here

        console.log("User registration was successful");
      } else {
        // Error message here

        console.log(
          "An error has occurred when attempting the user registration"
        );
      }
    } catch (error) {
      console.log(error);
      // Error message here
    }
  }
}
