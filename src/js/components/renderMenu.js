import { getUser } from "../utilities/storage.js";
import { URLS } from "../settings/constants.js";
import { handleLogout } from "../utilities/clickEvents.js";

export default function renderMenu() {
  const { pathname } = document.location;
  const nav = document.querySelector("nav");
  const user = getUser();

  const links = [
    { href: URLS.HOME, text: "Home", icon: "fa-solid fa-house" },
    { href: URLS.LOGIN, text: "Login", icon: "fa-solid fa-right-to-bracket" },
    { href: URLS.SIGNUP, text: "Sign up", icon: "fa-solid fa-user-plus" },
  ];

  const navProfile = document.querySelector(".nav-profile");

  if (user) {
    navProfile.style.display = "block";

    // Removes login and signup links and
    // adds profile link for logged-in users
    links.splice(1, 2);
    links.push({
      href: URLS.PROFILE,
      text: "Profile",
      icon: "fa-solid fa-user",
    });

    if (user.avatar === null) {
      user.avatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }

    navProfile.innerHTML = `
    <div>
      <img src="${user.avatar}" class="profile-pic" alt="${user.name}'s profile picture">
      <a href="${URLS.PROFILE}">${user.name}</a>
    </div>
    <button id="btnLogout" class="btn btn-custom">Log out</button>`;

    const logoutButton = document.getElementById("btnLogout");
    logoutButton.addEventListener("click", handleLogout);
  }

  // Generate menu links with dynamic classes for "active" state
  nav.innerHTML = links
    .map(
      (link) => `
      <a href="${link.href}" class="custom-link ${
        pathname === `/${link.href}` ? "active" : ""
      }"><i class="${link.icon}"></i> <span>${link.text}</span></a>`
    )
    .join("");
}
