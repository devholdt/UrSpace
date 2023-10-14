import renderMenu from "./renderMenu.mjs";
import message from "./message.mjs";
import { httpRequest } from "../utilities/httpRequest.mjs";
import { API_URLS, DEFAULT_URLS } from "../settings/constants.mjs";
import { displayScrollButton } from "../utilities/scrollEvents.mjs";
import { handleImageModal } from "./handleImageModal.mjs";
import { handleDelete } from "../utilities/clickEvents.mjs";
import { handleEdit } from "./editPost.mjs";
import { generatePostHTML } from "./renderPosts.mjs";
import { handleComment } from "./handleComment.mjs";

// Render the menu and display the scroll button
renderMenu();
displayScrollButton(500);

// Get references to various elements in the HTML
const searchInput = document.getElementById("searchInput");
const userResultsDiv = document.getElementById("userResults");
const postResultsDiv = document.getElementById("postResults");
const userSearchHeading = document.querySelector(".user-search-heading");
const postSearchHeading = document.querySelector(".post-search-heading");
const postsContainer = document.querySelector(".posts-container");
const searchContainer = document.querySelector(".search-container");

const usersUrl = `${API_URLS.PROFILES}?_posts=true?`;
const postsUrl = `${API_URLS.POSTS}?_author=true&_comments=true&_reactions=true&_tag=${searchInput.value}`;

/**
 * Handle search functionality based on the given search term.
 *
 * @param {string} searchTerm - The term to search for.
 */
async function handleSearch(searchTerm) {
  const usersPromise = getUsersBySearchTerm(searchTerm);
  const postsPromise = getPostsBySearchTerm(searchTerm);

  const [users, posts] = await Promise.all([usersPromise, postsPromise]);

  updateUserResults(users);
  updatePostResults(posts);
}

/**
 * Update the user search results in the UI.
 *
 * @param {Array} users - The array of user search results.
 */
function updateUserResults(users) {
  userResultsDiv.innerHTML = "";

  userSearchHeading.innerHTML = "Users";
  userSearchHeading.classList.add("bg-primary");

  if (users.length === 0) {
    message(
      "info",
      "No users found. Try a different search query.",
      ".user-results",
      null
    );
  }

  users.forEach((user) => {
    const userElement = createUserResultElement(user);
    userResultsDiv.appendChild(userElement);
  });
}

/**
 * Update the post search results in the UI.
 *
 * @param {Array} posts - The array of posts search results.
 */
function updatePostResults(posts) {
  postResultsDiv.innerHTML = "";

  postSearchHeading.innerHTML = "Posts";
  postSearchHeading.classList.add("bg-primary");

  if (posts.length === 0) {
    message(
      "info",
      "No posts found. Try a different search query.",
      ".post-results",
      null
    );
  }

  posts.forEach((post) => {
    const postElement = createPostResultElement(post);
    postResultsDiv.appendChild(postElement);
  });

  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  // Add event listeners for edit buttons
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
 * Fetch user search results based on the search term.
 *
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Array>} - An array of user search results.
 */
async function getUsersBySearchTerm(searchTerm) {
  searchTerm = searchInput.value;

  try {
    const users = await httpRequest(usersUrl, "GET");

    return users.filter((user) => {
      const lowercaseValue = searchTerm.toLowerCase();

      if (user.name.toLowerCase().trim().includes(lowercaseValue)) {
        return true;
      } else {
        return false;
      }
    });
  } catch (error) {
    message(
      "error",
      "An error occured when attempting to fetch search results (users).",
      ".user-results",
      null
    );
    return Promise.resolve([]);
  }
}

/**
 * Fetch post search results based on the search term.
 *
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Array>} - An array of post search results.
 */
async function getPostsBySearchTerm(searchTerm) {
  searchTerm = searchInput.value;

  try {
    const posts = await httpRequest(postsUrl, "GET");

    return posts.filter((post) => {
      const lowercaseValue = searchTerm.toLowerCase().trim();

      if (
        post.author.name.toLowerCase().trim().includes(lowercaseValue) ||
        post.title.toLowerCase().trim().includes(lowercaseValue) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseValue)) ||
        post.id.toString().includes(searchTerm.toString())
      ) {
        return true;
      } else {
        return false;
      }
    });
  } catch (error) {
    message(
      "error",
      "An error occured when attempting to fetch search results (posts).",
      ".post-results",
      null
    );
  }
}

/**
 * Create an HTML element for a user search result.
 *
 * @param {Object} user - The user data for the search result.
 * @returns {HTMLElement} - The HTML element representing the user result.
 */
function createUserResultElement(user) {
  const userElement = document.createElement("div");
  userElement.classList.add("col-md-4", "col-sm-6", "px-1");

  let userAvatar = "";

  if (user.avatar) {
    userAvatar = user.avatar;
  } else {
    userAvatar = DEFAULT_URLS.AVATAR;
  }

  userElement.innerHTML = `
  <button class="btn btn-outline-light">
    <a href="profile.html?name=${user.name}" class="d-flex gap-2 text-decoration-none search-result-user">
      <img src="${userAvatar}" class="avatar" alt="${user.name}'s avatar" onerror="this.src='${DEFAULT_URLS.AVATAR}'">
      <p class="my-auto">${user.name}</p>
    </a>
  </button>`;

  return userElement;
}

/**
 * Create an HTML element for a post search result.
 *
 * @param {Object} post - The post data for the search result.
 * @returns {HTMLElement} - The HTML element representing the post result.
 */
function createPostResultElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("px-1");
  postElement.innerHTML = generatePostHTML(post);
  return postElement;
}

export { handleSearch, searchInput, postsContainer, searchContainer };
