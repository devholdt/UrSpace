import renderMenu from "./components/renderMenu.js";
import { URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";

renderMenu();

async function renderProfile() {
  const profileBanner = document.querySelector(".profile-container_banner");
  const profileInfo = document.querySelector(".profile-container_info");
  const userData = getUser();

  if (!userData) {
    window.location.href = URLS.LOGIN;

    return;
  }

  if (userData.avatar === null) {
    userData.avatar =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-avatarture-973460_1280.png";
  }

  if (userData.banner === null) {
    userData.banner =
      "https://images.unsplash.com/photo-1557682260-96773eb01377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2029&q=80";
  }

  profileBanner.innerHTML = `
  <div>
    <img src="${userData.banner}" class="banner" alt="${userData.name}'s banner"
  </div>`;

  profileInfo.innerHTML = `
    <div class="d-flex align-items-center gap-3">
        <img src="${userData.avatar}" class="avatar" alt="${userData.name}'s avatar">
        <div>
            <h2 class="m-0">${userData.name}</h2>
            <p class="profile-email">${userData.email}</p>
            <div class="profile-bio">
                <p>Changeable profile bio here, max 60 characters</p>
            </div>
        </div>
    </div>`;
}

renderProfile();
