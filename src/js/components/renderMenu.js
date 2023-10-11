import { getUser } from "../utilities/storage.js";
import { URLS } from "../settings/constants.js";
import { handleLogout } from "../utilities/clickEvents.js";

/**
 * Renders the navigation menu based on the user's authentication status and current page.
 */
export default function renderMenu() {
  // Get the current page pathname
  const { pathname } = document.location;

  // Select the navigation element
  const nav = document.querySelector("nav");

  // Get user data if available
  const user = getUser();

  // Define navigation links with their href, text, and icon
  const links = [
    { href: URLS.FEED, text: "Home", icon: "fa-solid fa-house" },
    { href: URLS.PROFILE, text: "Profile", icon: "fa-solid fa-user" },
    { href: URLS.SEARCH, text: "Search", icon: "fa-solid fa-search" },
  ];

  // Select the user profile navigation element
  const navProfile = document.querySelector(".user-info");

  // Check if the user is authenticated
  if (user) {
    // Display the user profile navigation
    navProfile.style.display = "flex";

    // Set a default avatar URL if the user's avatar is null
    if (user.avatar === null) {
      user.avatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-avatarture-973460_1280.png";
    }

    // Render the user profile information
    navProfile.innerHTML = `
    <div>
      <img src="${user.avatar}" class="avatar" alt="${user.name}'s profile picture">
      <a href="${URLS.PROFILE}">${user.name}</a>
    </div>
    <div>
      <button id="btnLogout" class="border-0">Log out</button>
    </div>`;

    // Add a click event listener to the logout button
    const logoutButton = document.getElementById("btnLogout");
    logoutButton.addEventListener("click", handleLogout);
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
}
