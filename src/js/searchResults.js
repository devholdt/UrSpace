import renderMenu from "./components/renderMenu.js";
import message from "./components/message.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { API_URLS } from "./settings/constants.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import { handleImageModal } from "./components/handleImageModal.js";
import { handleDelete } from "./utilities/clickEvents.js";
import { handleEdit } from "./components/editPost.js";
import { postInnerHtml } from "./components/renderPosts.js";

const postsContainer = document.querySelector(".posts-container");
const searchForm = document.querySelector(".form-search");
const searchInput = document.getElementById("searchInput");
const messageContainer = document.querySelector(".message-container");
const url = `${API_URLS.POSTS}?_author=true&_tag=${searchInput.value}`;

renderMenu();
displayScrollButton(500);

async function renderSearchResults(form, httpRequest) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (searchInput.value.length === 0) {
      return;
    }

    window.scrollTo(0, 0);

    try {
      const posts = httpRequest;

      postsContainer.innerHTML = "";

      getResults(posts);
    } catch (error) {
      console.error(
        "An error occured with 'renderSearchresults' function:",
        error
      );
    }
  });
}

function filterPosts(posts, value) {
  return posts.filter((post) => {
    const lowercaseValue = value.toLowerCase();
    if (
      post.author.name.toLowerCase().includes(lowercaseValue) ||
      post.title.toLowerCase().includes(lowercaseValue) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseValue)) ||
      post.id.toString().includes(value.toString())
    ) {
      return true;
    } else {
      return false;
    }
  });
}

async function getResults(httpRequest) {
  const posts = await httpRequest;
  const filteredPosts = filterPosts(posts, searchInput.value);

  searchInput.value = "";
  postsContainer.innerHTML = "";
  messageContainer.innerHTML = "";

  if (filteredPosts.length === 0) {
    message(
      "info",
      "No results found. Try a different search query.",
      ".message-search",
      null
    );
  }

  for (const post of filteredPosts) {
    postInnerHtml(post, postsContainer);
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  const editButtons = document.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  handleImageModal();
}

renderSearchResults(searchForm, await httpRequest(url, "GET"));
