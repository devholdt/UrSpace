import { httpRequest } from "../utilities/httpRequest.js";
import { API_URLS, DEFAULT_URLS } from "../settings/constants.js";

export async function handleFollowUser(name, button1, button2) {
  const followUrl = `${API_URLS.PROFILES}/${name}/follow`;
  const response = await httpRequest(followUrl, "PUT", {});
  if (response) {
    button1.style.display = "none";
    button2.style.display = "block";
  }
}

export async function handleUnfollowUser(name, button1, button2) {
  const followUrl = `${API_URLS.PROFILES}/${name}/unfollow`;
  const response = await httpRequest(followUrl, "PUT", {});
  if (response) {
    button1.style.display = "none";
    button2.style.display = "block";
  }
}

export async function displayFollows(userData) {
  const profileFollowing = document.querySelector(".profile-following");
  const profileFollowers = document.querySelector(".profile-followers");

  if (userData.following.length > 0) {
    userData.following.forEach((user) => {
      profileFollowing.innerHTML += `
      <a href="profile.html?name=${user.name}" class="d-flex border-top px-3 py-2 rounded">
        <img src="${user.avatar}" class="avatar" alt="${user.name}'s avatar" onerror="this.src='${DEFAULT_URLS.AVATAR}'">
        <p class="my-auto ms-2">${user.name}</p>
      </a>`;
    });
  } else {
    profileFollowing.innerHTML += `${userData.name} is not following anyone`;
  }

  if (userData.followers.length > 0) {
    userData.followers.forEach((user) => {
      profileFollowers.innerHTML += `
      <a href="profile.html?name=${user.name}" class="d-flex border-top px-3 py-2 rounded">
        <img src="${user.avatar}" class="avatar" alt="${user.name}'s avatar" onerror="this.src='${DEFAULT_URLS.AVATAR}'">
        <p class="my-auto ms-2">${user.name}</p>
      </a>`;
    });
  } else {
    profileFollowers.innerHTML += `${userData.name} is not followed by anyone`;
  }
}
