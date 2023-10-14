import message from "./message.mjs";
import { API_URLS } from "../settings/constants.mjs";
import { httpRequest } from "../utilities/httpRequest.mjs";
import { isValidImageUrl } from "../utilities/urlValidation.mjs";
import { saveToken, saveUser } from "../utilities/storage.mjs";
import { URLS } from "../settings/constants.mjs";
import { clearUrl } from "../utilities/clickEvents.mjs";

// Get input and clear button for avatar URL
const avatarInput = document.getElementById("registerAvatar");
const clearAvatarBtn = document.getElementById("clearAvatarUrl");

// Get input and clear button for banner URL
const bannerInput = document.getElementById("registerBanner");
const clearBannerBtn = document.getElementById("clearBannerUrl");

// Clears URL inputs on button click
clearUrl(clearAvatarBtn, avatarInput);
clearUrl(clearBannerBtn, bannerInput);

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
export async function handleRegistration(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Collect user input values from the registration form
  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const avatar = avatarInput.value;
  const banner = bannerInput.value;

  // Check if username, email, and password are provided
  if (username.length === 0 || email.length === 0 || password.length === 0) {
    message(
      "error",
      "Username, email and password required.",
      ".message-fixed"
    );
    return;
  }

  // Check if provided image URLs are valid
  const isValidAvatar = await isValidImageUrl(avatar);
  const isValidBanner = await isValidImageUrl(banner);

  if (!isValidAvatar || !isValidBanner) {
    message("error", "Invalid image URL.", ".message-fixed");
    return;
  }

  // Create a user object with registration data
  const user = {
    name: username,
    email: email,
    password: password,
    avatar: avatar || null,
    banner: banner || null,
  };

  try {
    // Send a POST request to the server for user registration
    const response = await httpRequest(API_URLS.REGISTER, "POST", user);

    if (response) {
      // Create login data for auto-login
      const loginData = {
        email: email,
        password: password,
      };

      try {
        // Send a login request to the server for auto-login
        const loginResponse = await httpRequest(
          API_URLS.LOGIN,
          "POST",
          loginData
        );

        if (loginResponse.accessToken) {
          // Save the access token and user data on successful auto-login
          const token = loginResponse.accessToken;
          saveToken(token);
          saveUser(JSON.stringify(loginResponse));

          message(
            "success",
            `User registration was successful, welcome ${loginResponse.name}!`,
            ".message-fixed"
          );

          setTimeout(() => {
            window.location.href = URLS.FEED;
          }, 2000);
        } else {
          message(
            "error",
            "An error occured during auto-login.",
            ".message-fixed"
          );
        }
      } catch (error) {
        message(
          "error",
          "An error occured during user registration.",
          ".message-fixed"
        );
      }
    } else {
      message(
        "error",
        "Please provide correct registration credentials.",
        ".message-fixed"
      );
    }
  } catch (error) {
    message(
      "error",
      "An error occured when attempting user registration.",
      ".message-fixed"
    );
  }
}
