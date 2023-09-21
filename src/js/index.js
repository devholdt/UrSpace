import renderMenu from "./components/renderMenu.js";
import { API_BASE_URL } from "./settings/api.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { getUser } from "./utilities/storage.js";
import message from "./components/message.js";

renderMenu();

/**
 * Handles HTTP GET request to API to fetch posts and display them.
 *
 * @param {string} url The URL to send the HTTP request to.
 */
async function renderPosts(url) {
  const postsContainer = document.querySelector(".posts-container");
  const userData = getUser();

  if (!userData) {
    postsContainer.innerHTML = `<p class="posts-message">Log in to read posts here</p>`;
    document.querySelector(".posts-message").style.display = "block";

    return;
  }

  try {
    const posts = await httpRequest(url, "GET");
    const numberOfPosts = 10;

    if (posts.length >= numberOfPosts) {
      postsContainer.innerHTML = "";
      for (let i = 0; i < numberOfPosts; i++) {
        const post = posts[i];
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
      }
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured with the API call");
  }
}

const postsUrl = `${API_BASE_URL}/social/posts`;

renderPosts(postsUrl);
