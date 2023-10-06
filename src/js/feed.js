import renderMenu from "./components/renderMenu.js";
import { URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { renderPosts } from "./components/renderPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import {
  currentPage,
  generatePostsUrl,
  setupPaginationContainers,
} from "./components/pagination.js";

const user = getUser();
if (!user) {
  window.location.href = URLS.INDEX;
}

const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");

btnPost.addEventListener("click", handlePost);

renderMenu();
clearUrl(clearMediaUrl, mediaInput);
renderPosts(generatePostsUrl(currentPage));
setupPaginationContainers();
displayScrollButton(1500);
