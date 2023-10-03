import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { isValidImageUrl } from "../utilities/urlValidation.js";
import { saveToken, saveUser } from "../utilities/storage.js";
import { URLS } from "../settings/constants.js";
import message from "../components/message.js";
import { clearUrl } from "../utilities/clickEvents.js";

const clearAvatarBtn = document.getElementById("clearAvatarUrl");
const avatarInput = document.getElementById("registerAvatar");

const clearBannerBtn = document.getElementById("clearBannerUrl");
const bannerInput = document.getElementById("registerBanner");

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
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const avatar = avatarInput.value;
  const banner = bannerInput.value;

  if (username.length === 0 || email.length === 0 || password.length === 0) {
    message("error", "Username, email and password required");
    return;
  }

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
    banner: banner || null,
  };

  try {
    const response = await httpRequest(API_URLS.REGISTER, "POST", user);

    if (response) {
      const loginData = {
        email: email,
        password: password,
      };

      try {
        const loginResponse = await httpRequest(
          API_URLS.LOGIN,
          "POST",
          loginData
        );

        if (loginResponse.accessToken) {
          const token = loginResponse.accessToken;
          saveToken(token);
          saveUser(JSON.stringify(loginResponse));

          message(
            "success",
            `User registration was successful, welcome ${loginResponse.name}`
          );

          setTimeout(() => {
            window.location.href = URLS.FEED;
          }, 2000);
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
