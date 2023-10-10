import renderMenu from "./components/renderMenu.js";
import { API_URLS, URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import { displayPosts } from "./components/renderPosts.js";

// Get user data or redirect to the index page if the user is not authenticated
const userData = getUser();
if (!userData) {
  window.location.href = URLS.INDEX;
}

// Select the "Post" button, media input field, and clear media URL button
const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");

// Attach a click event listener to the "Post" button to handle post creation
btnPost.addEventListener("click", handlePost);

// Render the navigation menu
renderMenu();

// Attach functionality to clear media URL button
clearUrl(clearMediaUrl, mediaInput);

// Display a scroll-to-top button after scrolling 1500 pixels down
displayScrollButton(1500);

// Define the URL for fetching posts by the current user
const url = `${API_URLS.POSTS}?_author=true`;

// Display the initial set of posts
displayPosts(url);

// Attach a click event listener to the "Load More" button to fetch and display more posts
loadMoreButton.addEventListener("click", () => {
  displayPosts(url);
});
