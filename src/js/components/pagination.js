import { API_URLS } from "../settings/constants.js";
import { renderPosts } from "./renderPosts.js";

export let currentPage = 1;
export const INITIAL_LIMIT = 10;
let totalPages = 10;

export function generatePostsUrl(page) {
  const offset = (page - 1) * INITIAL_LIMIT;
  return `${API_URLS.POSTS}?_author=true&limit=${INITIAL_LIMIT}&offset=${offset}`;
}

function createButton(text, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("btn", "btn-outline-primary");
  button.addEventListener("click", clickHandler);
  return button;
}

export function setTotalPages(totalPosts) {
  totalPages = Math.max(Math.ceil(totalPosts / INITIAL_LIMIT), 10);
}

export function updatePaginationUI() {
  const pageButtons = document.querySelectorAll(".pagination button");
  pageButtons.forEach((button) => {
    const page = parseInt(button.textContent);
    button.classList.toggle("active", page === currentPage);
  });
}

export function handlePageClick(page) {
  if (page >= 1 && page <= totalPages && page !== currentPage) {
    currentPage = page;
    renderPosts(generatePostsUrl(currentPage));
    updatePaginationUI();
  }
}

export function setupPaginationContainers() {
  const containers = document.querySelectorAll(".pagination");

  containers.forEach((container) => {
    container.style.display = "flex";
    if (container) {
      container.innerHTML = "";
      const prevButton = createButton("prev", () =>
        handlePageClick(currentPage - 1)
      );
      prevButton.classList.add("rounded-start");
      container.appendChild(prevButton);

      for (let page = 1; page <= totalPages; page++) {
        const pageButton = createButton(page.toString(), () =>
          handlePageClick(page)
        );
        pageButton.classList.add("page-button");
        pageButton.classList.toggle("active", page === currentPage);
        container.appendChild(pageButton);
      }

      const nextButton = createButton("next", () =>
        handlePageClick(currentPage + 1)
      );
      nextButton.classList.add("rounded-end");
      container.appendChild(nextButton);
    }
  });
}