import { httpRequest } from "../utilities/httpRequest.js";
import { clearUrl } from "../utilities/clickEvents.js";
import { API_URLS } from "../settings/constants.js";
import { getUser } from "../utilities/storage.js";
import message from "./message.js";

/**
 * Handles the editing of a post.
 *
 * @param {Event} event - The event triggered when editing a post.
 */
export async function handleEdit(event) {
  // Get user data and post ID from event attributes
  const userData = getUser();
  const postId = event.target.getAttribute("data-id");
  const postUrl = `${API_URLS.POSTS}/${postId}`;

  // Define the HTML content for the edit modal
  const modalHtml = `
      <div id="editModal" class="modal flex-column justify-content-center">
        <div class="modal-content py-5">
          <i class="fa-solid fa-circle-xmark close-btn" id="closeEditModal"></i>
  
          <form id="editForm" class="d-flex flex-column mx-auto">
  
          <h2>Edit Post</h2>
  
          <div class="mb-2">
            <label for="editTitle" class="form-label m-0">Title</label>
            <input type="text" class="form-control shadow-none" id="editTitle" name="editTitle">
          </div>
  
          <div class="mb-2">
            <label for="editBody" class="form-label m-0">Body</label>
            <textarea class="form-control shadow-none" id="editBody" name="editBody"></textarea>
          </div>
  
          <div class="mb-2">
            <label for="editMedia" class="form-label m-0">Media URL</label>
            <div class="d-flex">
                <input type="text" class="form-control shadow-none url-input" id="editMedia" name="editMedia">
                <button type="button" class="btn btn-light btn-clear" id="clearEditMediaUrl">
                  <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
          </div>
  
          <div class="mb-4">
            <label for="editTags" class="form-label m-0">Tags</label>
            <input type="text" class="form-control shadow-none" id="editTags" name="editTags">
          </div>
  
          <div class="d-flex justify-content-between edit-submit">
            <div class="message-container message-edit d-flex justify-content-center"></div>
            <button type="submit" class="btn btn-post" title="Edit">Save</button>
          </div>
  
          </form>
  
        </div>
      </div>`;

  // Insert the edit modal HTML into the document body
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Get references to elements in the edit modal
  const editModal = document.getElementById("editModal");
  const editMedia = document.getElementById("editMedia");
  const clearMediaUrl = document.getElementById("clearEditMediaUrl");

  // Attach a clear URL function to the edit media URL input
  clearUrl(clearMediaUrl, editMedia);

  try {
    // Fetch the post data for editing
    const post = await httpRequest(postUrl, "GET");

    // If post not found/doesn't exist, display an error message
    if (!post) {
      message("error", "Post not found or API response is invalid");
      return;
    }

    const postName = event.target.dataset.name;
    const modalContent = editModal.querySelector(".modal-content");
    const closeButton = editModal.querySelector("#closeEditModal");

    if (closeButton) {
      // Add a click event listener to close the edit modal
      closeButton.addEventListener("click", () => {
        editModal.style.display = "none";
      });
    }

    if (postName === userData.name) {
      // Populate the edit form with post data if the user is authorized
      modalContent.querySelector("#editTitle").value = post.title;
      modalContent.querySelector("#editBody").value = post.body;
      modalContent.querySelector("#editMedia").value = post.media || "";
      modalContent.querySelector("#editTags").value = post.tags.join(", ");

      // Display the edit modal
      editModal.style.display = "flex";

      // Add a submit event listener to the edit form
      modalContent
        .querySelector("form")
        .addEventListener("submit", async (event) => {
          event.preventDefault();

          const tagsInput = document.getElementById("editTags");
          const tagsInputValue = tagsInput.value;
          const editedTags = tagsInputValue
            .split(", ")
            .map((tag) => tag.trim());

          if (editedTags.length > 6) {
            message("error", "You can only add up to 6 tags", ".message-edit");
            return;
          }

          // Create an edited post object with form input values
          const editedPost = {
            title: modalContent.querySelector("#editTitle").value,
            body: modalContent.querySelector("#editBody").value,
            media: modalContent.querySelector("#editMedia").value,
            tags: editedTags,
          };

          // Send a PUT request to update the post
          const updateResponse = await httpRequest(postUrl, "PUT", editedPost);

          if (updateResponse.updated) {
            // Display a success message and update the post UI
            message("success", "Post edited successfully", ".message-edit");

            setTimeout(() => {
              post.title = editedPost.title;
              post.body = editedPost.body;
              post.media = editedPost.media;
              post.tags = editedPost.tags;
              updatePostUI(postId, post);
              editModal.style.display = "none";
            }, 1000);
          }
        });
    } else {
      console.error("Unauthorized to edit this post.");
      message("error", "Unauthorized to edit this post.", ".message-edit");
    }
  } catch (error) {
    console.error("Error fetching post data:", error);
    message("error", `Error fetching post data: ${error}`, ".message-edit");
  }
}

/**
 * Updates the user interface to display edited post information.
 *
 * @param {string} postId - The ID of the post to update.
 * @param {object} post - The updated post data.
 */
function updatePostUI(postId, post) {
  // Find the post container element with the specified data-id attribute
  const postContainer = document.querySelector(`.post[data-id="${postId}"]`);

  // Find elements within the post container to update
  const titleElement = postContainer.querySelector(".post-title");
  const bodyElement = postContainer.querySelector(".card-text");
  const mediaElement = postContainer.querySelector(".thumbnail-img");
  const tagsElement = postContainer.querySelector(".post-tags");

  // Update the post information in the UI
  titleElement.textContent = post.title;
  bodyElement.textContent = post.body;

  // Update tags by creating HTML for each tag and joining them
  tagsElement.innerHTML = post.tags
    .map((tag) => `<span class="badge bg-dark">${tag}</span>`)
    .join(" ");

  // Update the media element if it exists
  if (mediaElement) {
    if (post.media) {
      mediaElement.setAttribute("src", post.media);
      mediaElement.style.display = "block"; // Display the media element if media URL is provided
    } else {
      mediaElement.style.display = "none"; // Hide the media element if no media URL
    }
  }
}
