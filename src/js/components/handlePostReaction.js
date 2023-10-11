import message from "./message.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { API_URLS } from "../settings/constants.js";

export async function handlePostReaction(event) {
  const postId = event.target.dataset.id;
  const url = `${API_URLS.POSTS}/${postId}/react/${"👍"}`;

  event.target.style.color = "#ff5722";

  try {
    await httpRequest(url, "PUT", {});
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to like a post: ${error}`,
      ".message-posts"
    );
  }
}
