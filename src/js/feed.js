import renderMenu from "./components/renderMenu.js";
import { URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { fetchPosts } from "./components/fetchPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import {
  currentPage,
  paginationUrl,
  setupPaginationContainers,
} from "./components/pagination.js";

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
fetchPosts(paginationUrl(currentPage));
setupPaginationContainers();
displayScrollButton(1500);
