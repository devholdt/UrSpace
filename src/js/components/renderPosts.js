import { formatDate } from "../utilities/formatDate.js";
import { handleEdit } from "./editPost.js";
import { handleDelete } from "../utilities/clickEvents.js";
import { getUser } from "../utilities/storage.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { handleImageModal } from "./handleImageModal.js";

let start = 0;
let loading = false;

/**
 * Displays a list of posts in a container and handles pagination.
 *
 * @param {string} url - The URL to fetch the posts from.
 */
export async function displayPosts(url) {
  const postsContainer = document.querySelector(".posts-container");
  const loadMoreButton = document.getElementById("loadMoreButton");
  const postsPerPage = 10;

  if (loading) return; // Check if posts are currently being loaded

  loading = true; // Set the loading flag to prevent multiple requests

  const end = start + postsPerPage; // Calculate the end index for displaying posts

  const posts = await httpRequest(url); // Fetch posts from the specified URL

  // Handle the case when no posts are found
  if (posts.length === 0) {
    postsContainer.innerHTML = `<p class="no-posts">No posts found</p>`;
  }

  // Iterate through the posts and create post elements
  for (let i = start; i < end && i < posts.length; i++) {
    const post = posts[i];

    const postElement = document.createElement("div"); // Create post element
    postInnerHtml(post, postElement); // Populate the post element with content
    postsContainer.appendChild(postElement); // Append the post element to the posts container
  }

  // Update the start index and reset the loading flag
  start = end;
  loading = false;

  // Hide the load more button if there are no more posts to load
  if (start >= posts.length) {
    loadMoreButton.style.display = "none";
  }

  // Add event listeners to delete buttons
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  // Add event listeners to edit buttons
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  handleImageModal(); // Handle image modal
}

/**
 * Updates the HTML content of a container with post data.
 *
 * @param {Object} post - The post object to display.
 * @param {HTMLElement} container - The container where the post content should be displayed.
 */
export function postInnerHtml(post, container) {
  const userData = getUser(); // Get user data for comparison

  // Initialize variables for post media, modal content, and button group
  let postMedia = "";
  let modalContent = "";
  let buttonGroup = "";

  // Convert post dates to formatted strings
  const postDate = new Date(post.created);
  const updateDate = new Date(post.updated);
  const formattedPostDate = formatDate(postDate);
  const formattedUpdateDate = formatDate(updateDate);
  let updatedTime = `(<i>Edit ${formattedUpdateDate}</i>)`;

  // Check if post and update dates are the same
  if (formattedPostDate === formattedUpdateDate) {
    updatedTime = "";
  }

  // Handle post media and modal content
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

  // Generate button group based on user data
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

  // Update the container's HTML with post content
  container.innerHTML += `
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
            <p class="col-8 fs-4 post-title">${post.title}</p>
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
