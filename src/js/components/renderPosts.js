import { httpRequest } from "../utilities/httpRequest.js";
import { isValidImageUrl } from "../utilities/urlValidation.js";
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
              <div class="btn-group" role="group" aria-label="Post interaction">
                <button type="button" class="btn btn-outline-secondary"><i class="fa-regular fa-thumbs-up"></i></button>
                <button type="button" class="btn btn-outline-secondary"><i class="fa-regular fa-comment"></i></button>
              </div>
            </div>
          </div>`;
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured with the API call");
  }

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
