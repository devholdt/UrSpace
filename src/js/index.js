import renderMenu from "./components/renderMenu.js";
// import { postContent } from "./utilities/clickEvents.js";
import { API_BASE_URL } from "./settings/api.js";
import message from "./components/message.js";

renderMenu();

// const postBtn = document.querySelector(".btn-post");
// postBtn.addEventListener("click", postContent);

const postsUrl = `${API_BASE_URL}/social/posts`;

async function renderPosts(url) {
  try {
    const token = localStorage.getItem("token");

    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, fetchOptions);
    // console.log(response);

    if (response.ok) {
      const posts = await response.json();
      // console.log(posts);

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
    } else {
      console.log("An error occured when attempting to fetch posts");
      message(
        "error",
        "An error occured when attempting to fetch posts",
        ".message-container"
      );
    }
  } catch (error) {
    console.log(error);
    message(
      "error",
      "An error occured when attempting to call the API",
      ".message-container"
    );
  }
}

renderPosts(postsUrl);
