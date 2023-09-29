import { httpRequest } from "../utilities/httpRequest.js";
import { handleDelete } from "../utilities/clickEvents.js";
import { getUser } from "../utilities/storage.js";
import message from "./message.js";

const userData = getUser();

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

      const postDate = new Date(post.created);

      const day = postDate.getDate().toString().padStart(2, "0");
      const month = (postDate.getMonth() + 1).toString().padStart(2, "0");
      const year = postDate.getFullYear().toString().slice(-2);
      const hours = postDate.getHours().toString().padStart(2, "0");
      const minutes = postDate.getMinutes().toString().padStart(2, "0");

      const formattedPostDate = `${day}/${month}/${year} ${hours}:${minutes}`;

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

      if (post.author.name === userData.name) {
        buttonGroup = `
        <div class="btn-group m-0" role="group" aria-label="Post interaction">
          <button class="btn btn-light p-0 btn-edit" title="Edit" data-id="${post.id}"><i class="fa-regular fa-pen-to-square" data-id="${post.id}"></i></button>
          <button class="btn btn-light p-0 btn-delete" title="Delete" data-id="${post.id}"><i class="fa-regular fa-trash-can" data-id="${post.id}"></i></button>
        </div>`;
      } else {
        buttonGroup = `
        <div class="btn-group m-0" role="group" aria-label="Post interaction">
          <button class="btn btn-outline-secondary p-0 btn-like" title="Like"><i class="fa-regular fa-thumbs-up"></i></button>
          <button class="btn btn-outline-secondary p-0 btn-comment" title="Comment"><i class="fa-regular fa-comment"></i></button>
        </div>`;
      }

      postsContainer.innerHTML += `
          <div class="card m-4 post">

            <div class="card-header border-0">
              <div class="d-flex justify-content-between align-items-center">
                <p class="fs-6 card-header_name">${post.author.name}</p>
                <div class="card-follow">
                  <i class="fa-regular fa-square-plus" title="Follow" data-name="${post.author.name}"></i>
                  <i class="fa-solid fa-square-plus" title="Unfollow" data-name="${post.author.name}"></i>
                </div>
              </div>
            </div>

            <div class="card-content border-bottom">
              <div class="card-body">
                <p class="fs-4">${post.title}</p>
                <p class="card-text">${post.body}</p>
                ${postMedia}
                ${modalContent}
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
            <p class="d-flex justify-content-end mx-2 mt-0 mb-1 post-date">${formattedPostDate}</p>
            ${buttonGroup}
            </div>
            
          </div>`;

      const followIcons = document.querySelectorAll(".card-follow");

      followIcons.forEach((icon) => {
        const hollowIcon = icon.querySelector(".fa-regular");
        const solidIcon = icon.querySelector(".fa-solid");

        icon.addEventListener("click", (e) => {
          if (
            hollowIcon.style.display === "block" ||
            hollowIcon.style.display === ""
          ) {
            hollowIcon.style.display = "none";
            solidIcon.style.display = "block";

            console.log("Followed", e.target.dataset.name);
          } else {
            hollowIcon.style.display = "block";
            solidIcon.style.display = "none";

            console.log("Unfollowed", e.target.dataset.name);
          }
        });

        if (post.author.name === userData.name) {
          hollowIcon.style.display = "none";
        }
      });
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
