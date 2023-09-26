import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/constants.js";
import { getUser } from "./utilities/storage.js";
import { URLS } from "./settings/constants.js";
import { renderPosts } from "./components/renderPosts.js";
import { clearUrl } from "./utilities/clickEvents.js";
import { handlePost } from "./components/handlePost.js";

const postsUrl = `${API_BASE_URL}social/posts`;
const user = getUser();
const btnPost = document.querySelector(".btn-post");
const mediaInput = document.getElementById("postMedia");
const clearMediaUrl = document.getElementById("clearMediaUrl");

btnPost.addEventListener("click", handlePost);

renderMenu();
renderPosts(postsUrl);
clearUrl(clearMediaUrl, mediaInput);

if (!user) {
  window.location.href = URLS.INDEX;
}
