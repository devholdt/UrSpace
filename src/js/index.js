import { API_BASE_URL } from "./settings/api.js";
import renderMenu from "./components/renderMenu.js";
import message from "./components/message.js";
import { httpRequest } from "./utilities/httpRequest.js";

renderMenu();

const postsUrl = `${API_BASE_URL}/social/posts`;

async function renderPosts(url) {
  try {
    const posts = await httpRequest(url, "GET");

    const postsContainer = document.querySelector(".posts-container");
    postsContainer.innerHTML = "";

    if ((posts.length = 10)) {
      posts.forEach((post) => {
        postsContainer.innerHTML += `
          <div class="card m-4">
            <div class="card-header">
              <p>${post.title}</p>
            </div>
            <div class="card-body">
              <p class="card-text">${post.body}</p>
            </div>
            <div class="btn-group m-3" role="group" aria-label="Post interaction">
              <button class="btn btn-custom" title="Like">
                <i class="fa-regular fa-thumbs-up"></i>
              </button>
              <button class="btn btn-custom" title="Repost">
                <i class="fa-solid fa-retweet"></i>
              </button>
              <button class="btn btn-custom" title="Comment">
                <i class="fa-regular fa-comment"></i>
              </button>
            </div>
          </div>`;
      });
    }
  } catch (error) {
    console.log(error);
    message(
      "error",
      "An error occured with the API call",
      ".message-container"
    );
  }
}

renderPosts(postsUrl);
