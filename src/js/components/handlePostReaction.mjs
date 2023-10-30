import message from "./message.mjs";
import { httpRequest } from "../utilities/httpRequest.mjs";
import { API_URLS } from "../settings/constants.mjs";

/**
 * Handles the user's reaction (like) of a post.
 *
 * @param {Event} event - The event object triggered when the user reacts to a post.
 */
export async function handlePostReaction(event) {
  const postId = event.target.dataset.id;
  const url = `${API_URLS.POSTS}/${postId}/react/${"👍"}`;

  // Change the color of the reaction element (e.g. a "like" button) to indicate the reaction.
  event.target.style.color = "#ff5722";

  try {
    // Send a PUT request to update the post's reaction.
    await httpRequest(url, "PUT", {});
  } catch (error) {
    message(
      "error",
      "An error occured when attempting to like a post",
      ".message-fixed"
    );
  }
}
