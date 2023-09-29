import renderMenu from "./components/renderMenu.js";
import { URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { renderPosts } from "./components/renderPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";
import {
  generatePostsUrl,
  setupPaginationContainers,
  updatePaginationUI,
  currentPage,
} from "./components/pagination.js";

const user = getUser();
if (!user) {
  window.location.href = URLS.INDEX;
}

const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");
const paginationContainers = document.querySelectorAll(".pagination");

paginationContainers.forEach((container) => {
  setupPaginationContainers(container, renderPosts, updatePaginationUI);
});

btnPost.addEventListener("click", handlePost);
renderPosts(generatePostsUrl(currentPage));

renderMenu();
clearUrl(clearMediaUrl, mediaInput);

const paginationTop = document.querySelector(".top-pagination");
const paginationBottom = document.querySelector(".bottom-pagination");

document.onscroll = () => {
  if (window.scrollY >= 550) {
    if (paginationTop && paginationBottom) {
      paginationBottom.style.position = "sticky";
      paginationBottom.style.bottom = "1em";
    }
  } else if (window.scrollY < 550) {
    paginationBottom.style.position = "relative";
  }
};
