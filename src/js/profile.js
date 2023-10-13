import renderMenu from "./components/renderMenu.js";
import message from "./components/message.js";
import { API_URLS, URLS, DEFAULT_URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { displayPosts } from "./components/renderPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { isValidImageUrl } from "./utilities/urlValidation.js";
import {
  handleFollowUser,
  handleUnfollowUser,
  displayFollows,
} from "./components/handleFollows.js";

// Get the 'name' query string
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const username = params.get("name");

document.title = `UrSpace | ${username}'s profile`;

if (!queryString) {
  params.set("name", `${getUser().name}`);
  document.location.search = params;
}

// Get user data or redirect to the index page if the user is not authenticated
const localUserData = getUser();
if (!localUserData) {
  window.location.href = URLS.INDEX;
}

// The URL to fetch the logged-in user's posts and data
const postsUrl = `${API_URLS.PROFILES}/${username}/posts?_author=true&_comments=true&_reactions=true`;
const userUrl = `${API_URLS.PROFILES}/${username}?_followers=true&_following=true`;
const loggedInUserUrl = `${API_URLS.PROFILES}/${localUserData.name}?_followers=true&_following=true`;

// Render the navigation menu
renderMenu();

// Render the profile content
renderProfile();

// Display the logged-in user's posts
displayPosts(postsUrl);

loadMoreButton.addEventListener("click", () => {
  displayPosts(postsUrl);
});

/**
 * Renders the user's profile information, including banner and avatar.
 */
async function renderProfile() {
  // Get references to the profile info and banner elements
  const profilePostsHeading = document.querySelector(".profile-posts h2");
  const profileBanner = document.querySelector(".profile-container_banner");
  const profileInfo = document.querySelector(".profile-container_info");

  try {
    const apiUserData = await httpRequest(userUrl, "GET");
    const loggedInUserData = await httpRequest(loggedInUserUrl, "GET");

    // Ensure there's a default avatar URL if userData.avatar is null
    if (apiUserData.avatar === null) {
      apiUserData.avatar = DEFAULT_URLS.AVATAR;
    }

    // Ensure there's a default banner URL if userData.banner is null
    if (apiUserData.banner === null) {
      apiUserData.banner = DEFAULT_URLS.BANNER;
    }

    // Update the profile banner HTML with the user's banner image
    profileBanner.innerHTML = `
      <div class="profile-banner-image">
        <img src="${apiUserData.banner}" class="banner" id="userBanner" alt="${apiUserData.name}'s banner image" onerror="this.src='${DEFAULT_URLS.BANNER}'">
      </div>`;

    // Update the profile info HTML with the user's avatar and name
    profileInfo.innerHTML = `
      <div class="text-center pb-5 bg-light mb-5 text-dark">
        <div class="d-flex justify-content-end">
          <button id="userSettingsButton" class="btn btn-dark m-1 rounded-0">Settings</button>
          <button id="followUserButton" class="btn btn-primary m-1 rounded-0" style="display: none;">Follow ${apiUserData.name}</button>
          <button id="unfollowUserButton" class="btn btn-dark m-1 rounded-0" style="display: none;">Unfollow ${apiUserData.name}</button>
        </div>
        <div class="profile-info-details gap-4 align-items-center justify-content-evenly p-4">
            <img src="${apiUserData.avatar}" class="avatar border border-2 border-dark" id="userAvatar" alt="${apiUserData.name}'s avatar" onerror="this.src='${DEFAULT_URLS.AVATAR}'">
            <div>
                <h1 class="m-0">${apiUserData.name}</h1>
                <p class="profile-email">${apiUserData.email}</p>
                <hr class="my-3">
                <div>
                  <p class="m-0">${apiUserData._count.posts} posts</p>
                  <p class="m-0">${apiUserData._count.followers} followers</p>
                  <p class="m-0">${apiUserData._count.following} followed</p>
              </div>
            </div>
          </div>
      </div>`;

    displayFollows(apiUserData);

    // Get the settings and follow buttons
    const userSettingsButton = document.getElementById("userSettingsButton");
    const followUserButton = document.getElementById("followUserButton");
    const unfollowUserButton = document.getElementById("unfollowUserButton");

    // Display heading previously hidden heading
    profilePostsHeading.style.display = "block";

    // Style changes depending on profile state
    if (apiUserData.name !== loggedInUserData.name) {
      profilePostsHeading.innerHTML = `${apiUserData.name}'s posts`;
      userSettingsButton.style.display = "none";
      followUserButton.style.display = "block";

      const loggedInUserFollowing = loggedInUserData.following;
      loggedInUserFollowing.forEach((user) => {
        if (user.name === apiUserData.name) {
          followUserButton.style.display = "none";
          unfollowUserButton.style.display = "block";
        }
      });

      followUserButton.addEventListener("click", async () => {
        try {
          await handleFollowUser(
            apiUserData.name,
            followUserButton,
            unfollowUserButton
          );
        } catch (error) {
          message(
            "error",
            `An error occured when attempting to follow ${apiUserData.name}: ${error}`,
            ".message-posts"
          );
        }
      });

      unfollowUserButton.addEventListener("click", async () => {
        try {
          await handleUnfollowUser(
            apiUserData.name,
            unfollowUserButton,
            followUserButton
          );
        } catch (error) {
          message(
            "error",
            `An error occured when attempting to unfollow ${apiUserData.name}: ${error}`,
            ".message-posts"
          );
        }
      });
    } else {
      profilePostsHeading.innerHTML = "Your posts";
    }
    // Run handleUserSettings function on button click
    userSettingsButton.addEventListener("click", () => {
      handleUserSettings();
    });
  } catch (error) {
    message(
      "error",
      "An error occured when attempting to render profile",
      ".message-posts"
    );
  }
}

/**
 * Handles user settings by displaying a modal for changing avatar and banner images.
 */
async function handleUserSettings() {
  // HTML for the user settings modal
  const modalHtml = `
  <div id="userSettingsModal" class="modal p-2 flex-column justify-content-center">
  <div class="modal-content px-3 pt-5">

    <i class="fa-solid fa-circle-xmark close-btn"></i>

    <form id="userSettingsForm" class="d-flex flex-column mx-auto">

    <h2>Settings</h2>

      <div class="mt-3">
        <label for="newAvatarUrl" class="form-label m-0">Change avatar image</label>
        <div class="d-flex">
          <input type="text" class="form-control shadow-none" id="newAvatarUrl" placeholder="Enter new avatar image URL">
          <button type="button" class="btn btn-light btn-clear" id="clearNewAvatarUrl">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="my-3">
        <label for="newBannerUrl" class="form-label m-0">Change banner image</label>
        <div class="d-flex">
          <input type="text" class="form-control shadow-none" id="newBannerUrl" placeholder="Enter new banner image URL">
          <button type="button" class="btn btn-light btn-clear" id="clearNewBannerUrl">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="d-flex justify-content-between new-banner-submit">
        <div class="message-container message-settings d-flex justify-content-center"></div>
        <button class="btn btn-post" id="saveUserSettingsButton" title="Save" disabled>Save</button>
      </div>
    
    </form>

  </div>`;

  // Insert the modal HTML into the document
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Get references to DOM elements
  const userSettingsModal = document.getElementById("userSettingsModal");
  const newAvatar = document.getElementById("newAvatarUrl");
  const newBanner = document.getElementById("newBannerUrl");
  const clearAvatarUrl = document.getElementById("clearNewAvatarUrl");
  const clearBannerUrl = document.getElementById("clearNewBannerUrl");

  // Initialize click event handlers to clear input fields
  clearUrl(clearAvatarUrl, newAvatar);
  clearUrl(clearBannerUrl, newBanner);

  try {
    // Construct the URL for the user's profile data
    const url = `${API_URLS.PROFILES}/${localUserData.name}`;

    // Fetch the user's profile data, including avatar and banner images
    const userMedia = await httpRequest(url, "GET");

    // Get references to avatar and banner input fields
    const newAvatar = userSettingsModal.querySelector("#newAvatarUrl");
    const newBanner = userSettingsModal.querySelector("#newBannerUrl");

    // Get reference to save settings button
    const saveUserSettingsButton = document.querySelector(
      "#saveUserSettingsButton"
    );

    // Get reference to close button
    const closeUserSettingsModalButton = userSettingsModal.querySelector(
      "#userSettingsModal .close-btn"
    );

    // Add event listener to close button to hide the modal
    if (closeUserSettingsModalButton) {
      closeUserSettingsModalButton.addEventListener("click", () => {
        userSettingsModal.style.display = "none";
        newAvatar.value = "";
        newBanner.value = "";
      });
    }

    // Display the user settings modal
    userSettingsModal.style.display = "flex";

    const handleInput = () => {
      const avatarValue = newAvatar.value.trim();
      const bannerValue = newBanner.value.trim();

      // Enable the button if either input has a non-empty value
      saveUserSettingsButton.disabled = !(avatarValue || bannerValue);
    };

    newAvatar.addEventListener("input", handleInput);
    newBanner.addEventListener("input", handleInput);

    // Initialize a new user media object with the current avatar and banner values
    let newUserMedia = {
      avatar: userMedia.avatar,
      banner: userMedia.banner,
    };

    // Add event listener to the form for handling form submission
    userSettingsModal
      .querySelector("form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get new avatar and banner values from input fields
        const newAvatarValue = newAvatar.value;
        const newBannerValue = newBanner.value;

        // Update newUserMedia object only if the input values are not empty
        if (newAvatarValue.trim() !== "") {
          newUserMedia.avatar = newAvatarValue;
        }

        if (newBannerValue.trim() !== "") {
          newUserMedia.banner = newBannerValue;
        }

        // Check if the new image URLs are valid
        if (
          !(await isValidImageUrl(newUserMedia.avatar)) ||
          !(await isValidImageUrl(newUserMedia.banner))
        ) {
          message("error", "Invalid image URL", ".message-settings");
          return;
        }

        const response = await httpRequest(`${url}/media`, "PUT", newUserMedia);

        if (response) {
          message(
            "success",
            "Image(s) successfully changed",
            ".message-settings"
          );

          setTimeout(() => {
            userMedia.avatar = newUserMedia.avatar;
            userMedia.banner = newUserMedia.banner;

            const avatarImage = document.getElementById("userAvatar");
            avatarImage.src = newUserMedia.avatar;

            const bannerImage = document.getElementById("userBanner");
            bannerImage.src = newUserMedia.banner;

            userSettingsModal.style.display = "none";
          }, 2000);
        }
      });
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to change the banner image. ${error}`,
      ".message-banner"
    );
  }
}
