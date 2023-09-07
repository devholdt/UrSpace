import renderMenu from "./components/renderMenu.js";
import { renderPosts } from "./components/renderPosts.js";
import { postContent } from "./utilities/clickEvents.js";
import { storageKey, storageGetItem } from "./utilities/storage.js";

renderMenu();

const posts = storageGetItem(storageKey);
renderPosts(posts);

const postBtn = document.querySelector(".btn-post");
postBtn.addEventListener("click", postContent);

// Clear local storage
const clearStorage = document.querySelector("#clearStorage");
clearStorage.onclick = function () {
  localStorage.clear();
  window.location.reload();
};
