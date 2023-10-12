import { httpRequest } from "../utilities/httpRequest.js";
import { API_URLS } from "../settings/constants.js";

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
