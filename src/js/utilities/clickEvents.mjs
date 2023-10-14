import message from "../components/message.mjs";
import { API_URLS } from "../settings/constants.mjs";
import { httpRequest } from "./httpRequest.mjs";

/**
 * Logs the user out by removing token and user data from localStorage and reloading the page.
 */
export function handleLogout() {
  if (confirm("Are you sure you want to log out?") === true) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  }
}

/**
 * Clears the input value when a button is clicked.
 *
 * @param {Element} button - The button that triggers the input value clearing.
 * @param {Element} input - The input field to clear.
 */
export function clearUrl(button, input) {
  button.addEventListener("click", () => {
    input.value = "";
  });
}

/**
 * Handles the deletion of a post, displaying a confirmation dialog.
 *
 * @param {Event} event - The event object triggered when the delete button is clicked.
 */
export async function handleDelete(event) {
  const postId = event.target.dataset.id;

  if (confirm("Are you sure you want to delete this post?") === true) {
    try {
      const response = await httpRequest(
        `${API_URLS.POSTS}/${postId}`,
        "DELETE"
      );

      if (response === 204) {
        location.reload();
      }
    } catch (error) {
      message(
        "error",
        "An error occured when attempting to delete a post.",
        ".message-fixed"
      );
    }
  } else {
    return;
  }
}

/**
 * Removes a displayed message by clearing its content when the message area is clicked.
 */
export function removeMessage() {
  const messageFixed = document.querySelector(".message-fixed");

  messageFixed.addEventListener("click", () => {
    messageFixed.innerHTML = "";
  });
}
