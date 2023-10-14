import renderMenu from "./components/renderMenu.js";
import { API_URLS, URLS } from "./settings/constants.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import { getUser } from "./utilities/storage.js";
import { clearUrl, removeMessage } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";
import { displayPosts } from "./components/renderPosts.js";
import {
  handleSearch,
  searchInput,
  postsContainer,
  searchContainer,
} from "./components/handleSearch.js";
import "./settings/common.js";

// Get user data or redirect to the index page if the user is not authenticated
const userData = getUser();
if (!userData) {
  window.location.href = URLS.INDEX;
}

// Select the "Post" button, media input field, and clear media URL button
const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");
const filterSelect = document.getElementById("filterSelect");

// Attach a click event listener to the "Post" button to handle post creation
btnPost.addEventListener("click", handlePost);

// Render the navigation menu
renderMenu();

// Remove fixed message function
removeMessage();

// Attach functionality to clear media URL button
clearUrl(clearMediaUrl, mediaInput);

// Display a scroll-to-top button after scrolling 1500 pixels down
displayScrollButton(1500);

// Define the URL for fetching posts by the current user
const allPostsUrl = `${API_URLS.POSTS}?_author=true&_comments=true&_reactions=true`;
const followPostsUrl = `${API_URLS.POSTS}/following?_author=true&_comments=true&_reactions=true`;

// Default display of posts
displayPosts(allPostsUrl);

// Event listener for the "Reset" button
const resetButton = document.querySelector(".btn-reset");
resetButton.addEventListener("click", () => {
  start = 0;
  postsContainer.innerHTML = "";
  searchContainer.style.display = "none";
  searchInput.value = "";
  filterSelect.value = "all";

  displayPosts(allPostsUrl);
});

// Handle search functionality
searchInput.addEventListener("search", () => {
  const searchTerm = searchInput.value.trim();
  start = 0;

  if (searchTerm.length === 0) {
    return;
  }

  postsContainer.innerHTML = "";
  loadMoreButton.style.display = "none";
  searchContainer.style.display = "block";
  filterSelect.value = "all";

  handleSearch(searchTerm);
});

// Handle filter/sort functionality
let selectedValue;

filterSelect.addEventListener("change", () => {
  selectedValue = filterSelect.value;
  start = 0;

  searchInput.value = "";
  postsContainer.innerHTML = "";

  if (selectedValue === "all") {
    displayPosts(allPostsUrl);
  } else if (selectedValue === "follow") {
    displayPosts(followPostsUrl);
  }
});

loadMoreButton.addEventListener("click", () => {
  const url = selectedValue === "follow" ? followPostsUrl : allPostsUrl;

  displayPosts(url);
});
