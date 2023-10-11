import renderMenu from "./components/renderMenu.js";
import message from "./components/message.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { API_URLS } from "./settings/constants.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import { handleImageModal } from "./components/handleImageModal.js";
import { handleDelete } from "./utilities/clickEvents.js";
import { handleEdit } from "./components/editPost.js";
import { postInnerHtml } from "./components/renderPosts.js";
import { handleComment } from "./components/handleComment.js";

// Get references to various elements in the HTML
const postsContainer = document.querySelector(".posts-container");
const searchForm = document.querySelector(".form-search");
const searchInput = document.getElementById("searchInput");
const messageContainer = document.querySelector(".message-container");

// Create a URL for fetching posts based on search input
const url = `${API_URLS.POSTS}?_author=true&_comments=true&_reactions=true&_tag=${searchInput.value}`;

// Render the menu and display the scroll button
renderMenu();
displayScrollButton(500);

/**
 * Renders search results based on user input when the form is submitted.
 *
 * @param {HTMLElement} form - The form element containing the search input.
 * @param {Function} httpRequest - The function to fetch search results (HTTP Request).
 */
async function renderSearchResults(form, httpRequest) {
  // Add a submit event listener to the form
  form.addEventListener("submit", (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Check if the search input is empty
    if (searchInput.value.length === 0) {
      return;
    }

    // Scroll to the top of the page
    window.scrollTo(0, 0);

    try {
      // Perform the HTTP request to fetch search results
      const posts = httpRequest;

      // Clear the existing content in the posts container
      postsContainer.innerHTML = "";

      // Display the search results
      getResults(posts);
    } catch (error) {
      // Display error message
      message(
        "error",
        `An error occured when attempting to render search results: ${error}`
      );
    }
  });
}

/**
 * Filters an array of posts based on a search value.
 *
 * @param {Array} posts - An array of post objects to filter.
 * @param {string} value - The search value to filter posts by.
 * @returns {Array} - An array of filtered post objects.
 */
function filterPosts(posts, value) {
  // Use the Array.prototype.filter method to filter posts
  return posts.filter((post) => {
    // Convert the search value and post data to lowercase for case-insensitive search
    const lowercaseValue = value.toLowerCase();
    // Check if the search value is found in author name, title, tags, or post ID
    if (
      post.author.name.toLowerCase().includes(lowercaseValue) ||
      post.title.toLowerCase().includes(lowercaseValue) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseValue)) ||
      post.id.toString().includes(value.toString())
    ) {
      // If any of the conditions are met, include the post in the filtered results
      return true;
    } else {
      // Otherwise, exclude the post from the filtered results
      return false;
    }
  });
}

/**
 * Fetches and displays filtered search results.
 *
 * @param {Function} httpRequest - The function to fetch search results (HTTP Request).
 */
async function getResults(httpRequest) {
  // Fetch posts data using the provided HTTP request function
  const posts = await httpRequest;

  // Filter the fetched posts based on the search input value
  const filteredPosts = filterPosts(posts, searchInput.value);

  // Clear the search input field, posts container, and message container
  searchInput.value = "";
  postsContainer.innerHTML = "";
  messageContainer.innerHTML = "";

  // Check if there are no filtered results
  if (filteredPosts.length === 0) {
    // Display an informational message if no results are found
    message(
      "info",
      "No results found. Try a different search query.",
      ".message-search",
      null
    );
  }

  // Display the filtered posts in the posts container
  for (const post of filteredPosts) {
    postInnerHtml(post, postsContainer);
  }

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

renderSearchResults(searchForm, await httpRequest(url, "GET"));
