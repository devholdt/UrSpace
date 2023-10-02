import { API_BASE_URL } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";

export async function handleFollow(username) {
  const followUrl = `${API_BASE_URL}social/profiles/${username}/follow`;

  try {
    const response = httpRequest(followUrl, "PUT", {});

    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export async function handleUnfollow(username) {
  const unfollowUrl = `${API_BASE_URL}social/profiles/${username}/unfollow`;

  try {
    const response = httpRequest(unfollowUrl, "PUT", {});

    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
