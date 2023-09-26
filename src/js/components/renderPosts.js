import { httpRequest } from "../utilities/httpRequest.js";
import message from "./message.js";

/**
 * Renders posts from the API by sending an HTTP GET request and
 * displays them in the DOM.
 *
 * @param {string} url - The URL to send the HTTP Request to fetch posts.
 * @returns
 */
export async function renderPosts(url) {
  const postsContainer = document.querySelector(".posts-container");

  try {
    const posts = await httpRequest(url, "GET");
    const numberOfPosts = 10;

    if (posts.length >= numberOfPosts) {
      postsContainer.innerHTML = "";
      for (let i = 0; i < numberOfPosts; i++) {
        const post = posts[i];

        let postMedia;

        if (!post.media) {
          postMedia = "";
        } else {
          postMedia = `<img src="${post.media}" alt="Post media">`;
        }

        postsContainer.innerHTML += `
          <div class="card m-4">
            <div class="card-header">
              <p>${post.title}</p>
            </div>
            <div class="card-body">
              <p class="card-text">${post.body}</p>
              ${postMedia}
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
