import { API_BASE_URL } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import message from "./message.js";

/**
 * Renders posts from the API by sending an HTTP GET request and
 * displays them in the DOM.
 *
 * @param {string} url - The URL to send the HTTP Request to fetch posts.
 * @returns
 */
export async function renderPosts(url) {
  const postsContainer = document.querySelector(".posts-container");

  try {
    const posts = await httpRequest(url, "GET");

    if (posts.length === 0) {
      postsContainer.innerHTML = `<p class="no-posts">No posts found</p>`;
    }

    postsContainer.innerHTML = "";

    for (const post of posts) {
      let postMedia = "";
      let modalContent = "";
      let buttonGroup = "";

      if (post.media) {
        const modalId = `modal-${post.id}`;
        postMedia = `
          <div class="thumbnail">
            <img src="${post.media}" alt="Post media thumbnail" class="thumbnail-img" data-modal-id="${modalId}">
          </div>`;
        modalContent = `
            <div class="modal" id="${modalId}">
              <span class="close-btn" data-modal-id="${modalId}">&times;</span>
                <img src="${post.media}" alt="Full-sized post media" class="modal-content">
            </div>`;
      }

      if (location.pathname === "/profile.html") {
        buttonGroup = `
        <div class="btn-group" role="group" aria-label="Post interaction">
          <button class="btn btn-outline-secondary btn-edit" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
          <button class="btn btn-outline-secondary btn-delete" title="Delete" data-id="${post.id}"><i class="fa-regular fa-trash-can" data-id="${post.id}"></i></button>
        </div>`;
      } else {
        buttonGroup = `
        <div class="btn-group" role="group" aria-label="Post interaction">
          <button class="btn btn-outline-secondary btn-like" title="Like"><i class="fa-regular fa-thumbs-up"></i></button>
          <button class="btn btn-outline-secondary btn-comment" title="Comment"><i class="fa-regular fa-comment"></i></button>
        </div>`;
      }

      postsContainer.innerHTML += `
          <div class="card m-4 post">
            <div class="card-header border-0 bg-white">
              <p>${post.title}</p>
            </div>
            <div class="card-content">
              <div class="card-body">
                <p class="card-text">${post.body}</p>
                ${postMedia}
                ${modalContent}
              </div>
              ${buttonGroup}
            </div>
          </div>`;
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured with the API call");
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  attachEventListeners();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("modal-active");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".modal-content").addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

function closeModal(e) {
  if (
    e.target.classList.contains("modal") ||
    e.target.classList.contains("close-btn")
  ) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.classList.remove("modal-active");
    });
  }
}

function attachEventListeners() {
  const thumbnailImages = document.querySelectorAll(".thumbnail-img");

  thumbnailImages.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const modalId = thumbnail.getAttribute("data-modal-id");
      openModal(modalId);
    });
  });
}

async function handleDelete(event) {
  const postId = event.target.dataset.id;
  const deleteUrl = `${API_BASE_URL}social/posts/${postId}`;

  try {
    const response = await httpRequest(deleteUrl, "DELETE");

    if (response === 204) {
      console.log("Post successfully deleted");

      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      console.log("Ejjoj");
    }
  } catch (error) {
    console.log(error);
  }
}
