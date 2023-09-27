import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL, URLS } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { renderPosts } from "./components/renderPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";

const INITIAL_LIMIT = 10;
let currentPage = 1;
let currentOffset = 0;
const totalPages = Math.ceil(100 / INITIAL_LIMIT);

const user = getUser();
const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");

function generatePostsUrl(page) {
  const offset = (page - 1) * INITIAL_LIMIT;
  return `${API_BASE_URL}social/posts?limit=${INITIAL_LIMIT}&offset=${offset}`;
}

function createButton(text, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("btn", "btn-outline-primary");
  button.addEventListener("click", clickHandler);
  return button;
}

function setupPaginationContainers() {
  const containers = document.querySelectorAll(".pagination");
  containers.forEach((container) => {
    container.innerHTML = "";
    container.appendChild(
      createButton("Prev", () => handlePageClick(currentPage - 1))
    );
    for (let page = 1; page <= totalPages; page++) {
      const pageButton = createButton(page, () => handlePageClick(page));
      if (page === currentPage) {
        pageButton.classList.add("active");
      }
      container.appendChild(pageButton);
    }
    container.appendChild(
      createButton("Next", () => handlePageClick(currentPage + 1))
    );
  });
}

function handlePageClick(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    currentOffset = (page - 1) * INITIAL_LIMIT;
    renderPosts(generatePostsUrl(currentPage));
    updateActivePageButtons();
  }
}

function updateActivePageButtons() {
  const pageButtons = document.querySelectorAll(".pagination button");
  pageButtons.forEach((button) => {
    const page = parseInt(button.textContent);
    if (page === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

btnPost.addEventListener("click", handlePost);
renderPosts(generatePostsUrl(currentPage));
setupPaginationContainers();
renderMenu();
clearUrl(clearMediaUrl, mediaInput);

if (!user) {
  window.location.href = URLS.INDEX;
}
