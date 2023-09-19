import renderMenu from "./components/renderMenu.js";
import { formValidation } from "./utilities/formValidation.js";
import { API_BASE_URL } from "./settings/api.js";
import { storageSetItem } from "./utilities/storage.js";

renderMenu();
formValidation();

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
    return;
  } else {
    const user = {
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

      const response = await fetch(loginUrl, postData);
      console.log(response);

      if (response.ok) {
        const json = await response.json();
        console.log(json);

        const token = json.accessToken;
        storageSetItem("token", token);

        // Success message here
      } else {
        // Error message here

        console.log("An error has occured when attempting the user login");
      }
    } catch (error) {
      console.log(error);
      // Error message here
    }
  }
}

// mathi_test
// mathi_test@noroff.no
// password123bad
