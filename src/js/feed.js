import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { URLS } from "./settings/constants.js";
import { renderPosts } from "./components/renderPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";

const postsUrl = `${API_BASE_URL}social/posts`;
const user = getUser();

renderMenu();
renderPosts(postsUrl);

if (!user) {
  window.location.href = URLS.INDEX;
}

const clearMediaUrl = document.getElementById("clearMediaUrl");
const mediaInput = document.getElementById("postMedia");

clearUrl(clearMediaUrl, mediaInput);

const btnPost = document.querySelector(".btn-post");

btnPost.addEventListener("click", handlePost);
