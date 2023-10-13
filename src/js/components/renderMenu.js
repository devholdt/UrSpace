import message from "./message.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { getUser } from "../utilities/storage.js";
import { URLS, DEFAULT_URLS, API_URLS } from "../settings/constants.js";
import { handleLogout } from "../utilities/clickEvents.js";

/**
 * Renders the navigation menu based on the user's authentication status and current page.
 */
export default async function renderMenu() {
  // Get the current page pathname
  const { pathname } = document.location;

  // Select the navigation elements
  const nav = document.querySelector("nav.position-sticky");
  const hamburgerNav = document.querySelector(".navbar-nav");

  // Get user URL
  const userUrl = `${API_URLS.PROFILES}/${getUser().name}`;

  try {
    const apiUserData = await httpRequest(userUrl, "GET");

    // Define navigation links with their href, text, and icon
    const links = [
      { href: URLS.FEED, text: "Home", icon: "fa-solid fa-house" },
      {
        href: URLS.PROFILE,
        text: "Profile",
        icon: "fa-solid fa-user",
      },
      { href: URLS.SEARCH, text: "Search", icon: "fa-solid fa-search" },
    ];

    // Select the user profile navigation element
    const headerNavProfile = document.querySelector(".user-info-header");
    const hamburgerNavProfile = document.querySelector(".user-info-hamburger");

    // Check if the user is authenticated
    if (apiUserData) {
      // Set a default avatar URL if the user's avatar is null
      if (apiUserData.avatar === null) {
        apiUserData.avatar = DEFAULT_URLS.AVATAR;
      }

      // Render the user profile information
      headerNavProfile.innerHTML = `
    <div>
      <img src="${apiUserData.avatar}" class="avatar" alt="${apiUserData.name}'s profile picture" onerror='this.src="${DEFAULT_URLS.AVATAR}"'>
      <a href="${URLS.PROFILE}?name=${apiUserData.name}">${apiUserData.name}</a>
    </div>
    <div>
      <button id="btnLogoutHeader" class="border-0">Log out</button>
    </div>`;

      hamburgerNavProfile.innerHTML = `
    <div>
      <img src="${apiUserData.avatar}" class="avatar" alt="${apiUserData.name}'s profile picture" onerror='this.src="${DEFAULT_URLS.AVATAR}"'>
      <a href="${URLS.PROFILE}?name=${apiUserData.name}">${apiUserData.name}</a>
    </div>
    <div>
      <button id="btnLogoutHamburger" class="btn btn-outline-dark">Log out</button>
    </div>`;

      // Add a click event listener to the logout buttons
      const logoutButtonHeader = document.getElementById("btnLogoutHeader");
      const logoutButtonHamburger =
        document.getElementById("btnLogoutHamburger");
      logoutButtonHeader.addEventListener("click", handleLogout);
      logoutButtonHamburger.addEventListener("click", handleLogout);
    }

    // Render the navigation links based on the current page
    nav.innerHTML = links
      .map(
        (link) => `
    <a href="${link.href}" class="link-custom ${
          pathname === `/${link.href}` ? "active" : ""
        }"><i class="${link.icon}"></i> <span>${link.text}</span></a>`
      )
      .join("");

    hamburgerNav.innerHTML = links
      .map(
        (link) => `
    <li class="d-flex justify-content-center border-top py-2">
      <a href="${link.href}" class="link-custom ${
          pathname === `/${link.href}` ? "active" : ""
        }">
        <i class="${link.icon}"></i> <span>${link.text}</span>
      </a>
    </li>`
      )
      .join("");
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to fetch user data_ ${error}`,
      ".message-posts",
      null
    );
  }
}
