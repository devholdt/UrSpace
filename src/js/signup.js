import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/constants.js";
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
form.addEventListener("submit", handleRegistration);

const clearAvatarBtn = document.getElementById("clearAvatarUrl");
const clearBannerBtn = document.getElementById("clearBannerUrl");
const avatarInput = document.getElementById("registerAvatar");
const bannerInput = document.getElementById("registerBanner");

clearAvatarBtn.addEventListener("click", () => {
  avatarInput.value = "";
});

clearBannerBtn.addEventListener("click", () => {
  bannerInput.value = "";
});

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

  const registerUrl = `${API_BASE_URL}social/auth/register`;

  // Retrieve input values
  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const avatar = avatarInput.value;
  const banner = bannerInput.value;

  // Validate required input values
  if (username.length === 0 || email.length === 0 || password.length === 0) {
    message("error", "Username, email and password required");
    return;
  }

  // Validate image URLs
  if (
    (avatar && !(await isValidImageUrl(avatar))) ||
    (banner && !(await isValidImageUrl(banner)))
  ) {
    message("error", "Invalid image URL");
    return;
  }

  const user = {
    name: username,
    email: email,
    password: password,
    avatar: avatar || null,
    banner: avatar || null,
  };

  try {
    const response = await httpRequest(registerUrl, "POST", user);

    console.log(response);

    if (response) {
      const loginUrl = `${API_BASE_URL}social/auth/login`;
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
            `User registration was successful, welcome ${loginResponse.name}`
          );

          setTimeout(() => {
            window.location.href = URLS.HOME;
          }, 3000);
        } else {
          message("error", "An error occured during auto-login");
        }
      } catch (loginError) {
        console.log(loginError);
        message("error", "An error occured during user registration");
      }
    } else {
      message("error", "Please provide correct registration credentials");
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured when attempting user registration");
  }
}

async function isValidImageUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      return contentType && contentType.startsWith("image/");
    }

    return;
  } catch (error) {
    console.log(error);
    return;
  }
}
