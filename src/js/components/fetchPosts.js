import message from "./message.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { handleDelete } from "../utilities/clickEvents.js";
import { handleEdit } from "./editPost.js";
import { getUser } from "../utilities/storage.js";
import { renderPosts } from "./renderPosts.js";
import { handleImageModal } from "./handleImageModal.js";

/**
 * Fetches posts from the API by sending an HTTP GET
 * request and displays them in the DOM.
 *
 * @param {string} url - The URL to send the HTTP Request to fetch posts.
 * @returns
 */
export async function fetchPosts(url) {
  const postsContainer = document.querySelector(".posts-container");
  const userData = getUser();

  try {
    const posts = await httpRequest(url, "GET");

    if (posts.length === 0) {
      postsContainer.innerHTML = `<p class="no-posts">No posts found</p>`;
    }

    postsContainer.innerHTML = "";

    renderPosts(posts, userData, postsContainer);
  } catch (error) {
    console.log(error);
    message(
      "error",
      "An error occurred with the API call",
      ".message-posts",
      null
    );
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  const editButtons = document.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  handleImageModal();
}
