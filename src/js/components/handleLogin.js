import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { saveToken, saveUser } from "../utilities/storage.js";
import { URLS } from "../settings/constants.js";
import message from "../components/message.js";

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
  // Prevent the default form submission behavior
  event.preventDefault();

  // Collect email and password from the login form
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Check if email and password are provided
  if (email.length === 0 || password.length === 0) {
    message("error", "Email and password are required", ".message-index");
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
        // Handle incorrect login credentials
        message(
          "error",
          "Please provide correct login credentials",
          ".message-index"
        );
        return;
      } else if (response.accessToken) {
        // Save the access token and user data on successful login
        const token = response.accessToken;
        saveToken(token);
        saveUser(JSON.stringify(response));

        // Display a success message and redirect after a delay
        message(
          "success",
          `Login successful, welcome back ${response.name}`,
          ".message-index"
        );

        setTimeout(() => {
          window.location.href = URLS.FEED;
        }, 2000);
      }
    } catch (error) {
      // Handle errors that occur during login
      console.log("An error occured when attempting to loging:", error);
      message(
        "error",
        "An error occured when attempting to login",
        ".message-index"
      );
    }
  }
}
