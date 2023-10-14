import { API_URLS } from "../settings/constants.mjs";
import { httpRequest } from "../utilities/httpRequest.mjs";
import { saveToken, saveUser } from "../utilities/storage.mjs";
import { URLS } from "../settings/constants.mjs";
import message from "./message.mjs";

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
export async function handleLogin(event) {
  event.preventDefault();

  // Collect email and password from the login form
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Check if email and password are provided
  if (email.length === 0 || password.length === 0) {
    message("error", "Email and password are required.", ".message-fixed");
    return;
  } else {
    // Create a user object with email and password
    const user = {
      email: email,
      password: password,
    };

    try {
      // Send a POST request to the server for login
      const response = await httpRequest(API_URLS.LOGIN, "POST", user);

      if (!response) {
        message(
          "error",
          "Please provide correct login credentials.",
          ".message-fixed"
        );
        return;
      } else if (response.accessToken) {
        // Save the access token and user data on successful login
        const token = response.accessToken;
        saveToken(token);
        saveUser(JSON.stringify(response));

        message(
          "success",
          `Login successful, welcome back ${response.name}!`,
          ".message-fixed"
        );

        setTimeout(() => {
          window.location.href = URLS.FEED;
        }, 2000);
      }
    } catch (error) {
      message(
        "error",
        "An error occured when attempting to login.",
        ".message-fixed"
      );
    }
  }
}
