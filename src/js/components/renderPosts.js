import { formatDate } from "../utilities/formatDate.js";
import { handleEdit } from "./editPost.js";
import { handleDelete } from "../utilities/clickEvents.js";

/**
 * Renders an array of posts to a specified container.
 *
 * @param {Array} posts - An array of post objects to render.
 * @param {Object} userData - User data for the currently logged-in user.
 * @param {HTMLElement} container - The container ellement where the posts will be rendered.
 * @returns {void}
 */
export function renderPosts(posts, userData) {
  const postsContainer = document.querySelector(".posts-container");

  for (const post of posts) {
    let postMedia = "";
    let modalContent = "";
    let buttonGroup = "";

    const postDate = new Date(post.created);
    const updateDate = new Date(post.updated);
    const formattedPostDate = formatDate(postDate);
    const formattedUpdateDate = formatDate(updateDate);
    let updatedTime = `(<i>Edit ${formattedUpdateDate}</i>)`;

    if (formattedPostDate === formattedUpdateDate) {
      updatedTime = "";
    }

    if (post.media) {
      const modalId = `modal-${post.id}`;
      postMedia = `
        <div class="thumbnail">
          <img src="${post.media}" alt="Post media thumbnail" class="thumbnail-img" data-modal-id="${modalId}">
        </div>`;
      modalContent = `
        <div class="modal" id="${modalId}">
          <i class="fa-solid fa-circle-xmark close-btn" data-modal-id="${modalId}"></i>
          <img src="${post.media}" alt="Full-sized post media" class="modal-content">
        </div>`;
    }

    if (post.author.name === userData.name) {
      buttonGroup = `
        <div class="btn-group m-0" role="group" aria-label="Post interaction">
          <button class="btn btn-light p-0 btn-edit" title="Edit" data-id="${post.id}" data-name="${post.author.name}">
          <i class="fa-regular fa-pen-to-square" data-id="${post.id}" data-name="${post.author.name}"></i>
          </button>
          <button class="btn btn-light p-0 btn-delete" title="Delete" data-id="${post.id}">
          <i class="fa-regular fa-trash-can" data-id="${post.id}"></i>
          </button>
        </div>`;
    } else {
      buttonGroup = `
        <div class="btn-group m-0" role="group" aria-label="Post interaction">
          <button class="btn btn-outline-secondary p-0 btn-like" title="Like">
          <i class="fa-regular fa-thumbs-up"></i>
          </button>
          <button class="btn btn-outline-secondary p-0 btn-comment" title="Comment">
          <i class="fa-regular fa-comment"></i>
          </button>
        </div>`;
    }

    postsContainer.innerHTML += `
      <div class="card m-4 post" data-id="${post.id}">

        <div class="card-header border-0">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-2 align-items-end">
              <p class="card-header_name fs-5">${post.author.name}</p>
              <a href="#" class="fst-italic fw-light">visit profile</a>
            </div>
            <p class="fst-italic fw-light">id: ${post.id}</p>
          </div>
        </div>
        
        <div class="card-content border-bottom">
          <div class="card-body">
            <div class="row d-flex justify-content-between">
              <p class="col-8 fs-4">${post.title}</p>
              <div class="col-4 p-0 d-flex align-items-start justify-content-end flex-wrap gap-1 post-tags">
                ${post.tags
                  .map((tag) => `<span class="badge bg-dark">${tag}</span>`)
                  .join(" ")}
              </div>
            </div>
            <p class="card-text">${post.body}</p>
            ${postMedia}
            ${modalContent}
          </div>
        </div>
            
        <div class="d-flex justify-content-between align-items-center">
          <p class="d-flex justify-content-end mx-2 mt-0 mb-1 post-date">${formattedPostDate} ${updatedTime}</p>
          ${buttonGroup}
        </div>
            
      </div>`;
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  const editButtons = document.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });
}
