import renderMenu from "./components/renderMenu.js";
import { API_URLS, URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import { displayPosts } from "./components/renderPosts.js";

const userData = getUser();
if (!userData) {
  window.location.href = URLS.INDEX;
}

const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");

btnPost.addEventListener("click", handlePost);

renderMenu();
clearUrl(clearMediaUrl, mediaInput);

displayScrollButton(1500);

const url = `${API_URLS.POSTS}?_author=true`;

displayPosts(url);

loadMoreButton.addEventListener("click", () => {
  displayPosts(url);
});
