import { httpRequest } from "../utilities/httpRequest.js";
import { clearUrl } from "../utilities/clickEvents.js";
import { API_URLS } from "../settings/constants.js";
import { getUser } from "../utilities/storage.js";
import message from "./message.js";

export async function handleEdit(event) {
  const userData = getUser();
  const postId = event.target.getAttribute("data-id");
  const postUrl = `${API_URLS.POSTS}/${postId}`;

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
                <button type="button" class="btn btn-light btn-clear" id="clearEditMediaUrl"><i
                        class="fa-solid fa-xmark"></i></button>
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

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const editModal = document.getElementById("editModal");
  const editMedia = document.getElementById("editMedia");
  const editMediaUrl = document.getElementById("clearEditMediaUrl");

  clearUrl(editMediaUrl, editMedia);

  try {
    const post = await httpRequest(postUrl, "GET");

    if (!post) {
      console.error("Post not found or API response is invalid");
      return;
    }

    const postName = event.target.dataset.name;

    const modalContent = editModal.querySelector(".modal-content");

    const closeButton = editModal.querySelector("#closeEditModal");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        editModal.style.display = "none";
      });
    }

    if (postName === userData.name) {
      modalContent.querySelector("#editTitle").value = post.title;
      modalContent.querySelector("#editBody").value = post.body;
      modalContent.querySelector("#editMedia").value = post.media || "";
      modalContent.querySelector("#editTags").value = post.tags.join(", ");

      editModal.style.display = "flex";

      modalContent
        .querySelector("form")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const tagsInput = document.getElementById("editTags");
          const tagsInputValue = tagsInput.value;
          const editedTags = tagsInputValue
            .split(", ")
            .map((tag) => tag.trim());

          if (editedTags.length > 6) {
            message("error", "You can only add up to 6 tags", ".message-edit");
            return;
          }

          const editedPost = {
            title: modalContent.querySelector("#editTitle").value,
            body: modalContent.querySelector("#editBody").value,
            media: modalContent.querySelector("#editMedia").value,
            tags: editedTags,
          };

          const updateResponse = await httpRequest(postUrl, "PUT", editedPost);

          if (updateResponse.updated) {
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

function updatePostUI(postId, post) {
  const postContainer = document.querySelector(`.post[data-id="${postId}"]`);
  const titleElement = postContainer.querySelector(".fs-4");
  const bodyElement = postContainer.querySelector(".card-text");
  const mediaElement = postContainer.querySelector(".thumbnail-img");
  const tagsElement = postContainer.querySelector(".post-tags");

  titleElement.textContent = post.title;
  bodyElement.textContent = post.body;
  tagsElement.innerHTML = post.tags
    .map((tag) => `<span class="badge bg-dark">${tag}</span>`)
    .join(" ");

  if (mediaElement) {
    if (post.media) {
      mediaElement.setAttribute("src", post.media);
      mediaElement.style.display = "block";
    } else {
      mediaElement.style.display = "none";
    }
  }
}
