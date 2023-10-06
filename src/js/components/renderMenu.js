import { getUser } from "../utilities/storage.js";
import { URLS } from "../settings/constants.js";
import { handleLogout } from "../utilities/clickEvents.js";

export default function renderMenu() {
  const { pathname } = document.location;
  const nav = document.querySelector("nav");
  const user = getUser();

  const links = [
    { href: URLS.FEED, text: "Home", icon: "fa-solid fa-house" },
    { href: URLS.PROFILE, text: "Profile", icon: "fa-solid fa-user" },
    { href: URLS.SEARCH, text: "Search", icon: "fa-solid fa-search" },
  ];

  const navProfile = document.querySelector(".user-info");

  if (user) {
    navProfile.style.display = "block";

    navProfile.style.display = "flex";

    if (user.avatar === null) {
      user.avatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-avatarture-973460_1280.png";
    }

    navProfile.innerHTML = `
    <div>
      <img src="${user.avatar}" class="avatar" alt="${user.name}'s profile picture">
      <a href="${URLS.PROFILE}">${user.name}</a>
    </div>
    <div>
      <button id="btnLogout">Log out</button>
    </div>`;

    const logoutButton = document.getElementById("btnLogout");
    logoutButton.addEventListener("click", handleLogout);
  }

  nav.innerHTML = links
    .map(
      (link) => `
      <a href="${link.href}" class="link-custom ${
        pathname === `/${link.href}` ? "active" : ""
      }"><i class="${link.icon}"></i> <span>${link.text}</span></a>`
    )
    .join("");
}
