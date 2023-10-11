import { formatDate } from "../utilities/formatDate.js";
import { handleEdit } from "./editPost.js";
import { handleDelete } from "../utilities/clickEvents.js";
import { getUser } from "../utilities/storage.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { handleImageModal } from "./handleImageModal.js";
import { handleComment } from "./handleComment.js";

// Initialize variables for pagination
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

  // Check if posts are currently being loaded
  if (loading) return;

  // Set the loading flag to prevent multiple requests
  loading = true;

  // Calculate the end index for displaying posts
  const end = start + postsPerPage;

  // Fetch posts from the specified URL
  const posts = await httpRequest(url);

  // Handle the case when no posts are found
  if (posts.length === 0) {
    postsContainer.innerHTML = `<p class="no-posts">No posts found</p>`;
  }

  // Iterate through the posts and create post elements
  for (let i = start; i < end && i < posts.length; i++) {
    const post = posts[i];

    // Create post element
    const postElement = document.createElement("div");

    // Populate the post element with content
    postInnerHtml(post, postElement);

    // Append the post element to the posts container
    postsContainer.appendChild(postElement);
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

  // Initialize image modal functionality
  handleImageModal();

  // Handle post commenting functionality
  handleComment();
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
  let postComments = "";
  let commentsContainer = "";

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
      <div class="btn-group m-0 pt-1 gap-1" role="group" aria-label="Post interaction">
        <button class="btn btn-light p-0 btn-edit" title="Edit" data-id="${post.id}" data-name="${post.author.name}">
        <i class="fa-regular fa-pen-to-square" data-id="${post.id}" data-name="${post.author.name}"></i>
        </button>
        <button class="btn btn-light p-0 btn-delete" title="Delete" data-id="${post.id}">
        <i class="fa-regular fa-trash-can" data-id="${post.id}"></i>
        </button>
      </div>`;
  } else {
    buttonGroup = `
      <div class="btn-group m-0 pt-1 gap-1" role="group" aria-label="Post interaction">
        <button class="btn btn-outline-secondary p-0 btn-like" title="Like">
        <i class="fa-regular fa-thumbs-up"></i>
        </button>
      </div>`;
  }

  if (post.comments.length > 0) {
    function sortComments(a, b) {
      return a.id - b.id;
    }

    post.comments.sort(sortComments);

    post.comments.forEach((comment) => {
      const commentDate = new Date(comment.created);
      const formattedCommentDate = formatDate(commentDate);

      postComments += `
        <div class="d-flex rounded-bottom post-comment">
    
          <div class="card post p-1">
    
            <div class="card-header border-0 py-1">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex gap-2">
                  <p>${comment.owner}</p>
                  <a href="#" class="fst-italic fw-light">visit profile</a>
                </div>
                <p class="fst-italic fw-light">id: ${comment.id}</p>
              </div>
            </div>
    
            <div class="card-content border-bottom">
              <div class="card-body">
                <div class="card-text">${comment.body}</div>
              </div>
            </div>
    
            <div class="d-flex align-items-center">
              <p class="mx-2 mt-0 mb-1 post-date">${formattedCommentDate}</p>
            </div>
    
          </div>
    
        </div>`;
    });

    commentsContainer = `
      <div class="d-flex flex-column gap-2">
        <h4 class="fs-6 ms-1 mb-0 mt-3">Comments</h4>
        <div class="comments d-flex flex-column gap-2 m-0">
          ${postComments}
        </div>
      </div>`;
  }

  // Update the container's HTML with post content
  container.innerHTML += `
    <div class="p-3 bg-light mb-4 rounded">
      <div class="card post border p-1" data-id="${post.id}">
        <div class="card-header border-0">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-2 align-items-end">
              <p class="fs-5">${post.author.name}</p>
              <a href="#" class="fst-italic fw-light">visit profile</a>
            </div>
            <p class="fst-italic fw-light">id: ${post.id}</p>
          </div>
        </div>
        
        <div class="card-content border-bottom">
          <div class="card-body">
            <div class="row d-flex justify-content-between">
              <h3 class="col-8 fs-4 fw-normal post-title">${post.title}</h3>
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
      </div>

      <div class="comment-form-container">

        <form class="mx-auto mt-1 comment-form" data-id="${post.id}">

          <label for="commentInput" class="form-label mb-0 mt-2 hide-label">Comment</label>

          <div class="d-flex bg-white">
            <input type="text" class="form-control shadow-none rounded-0 rounded-start" id="commentInput" name="commentInput" placeholder="comment" minlength="2" required>
            <button type="submit" data-id="${
              post.id
            }" class="comment-button btn btn-outline-secondary p-0 rounded-0 rounded-end" title="Comment">Post</button>
          </div>

          </form>
          
          <div class="comments-container">${commentsContainer}</div>

        </div>
        
      </div>`;
}
