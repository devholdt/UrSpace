import renderMenu from "./components/renderMenu.js";
import { getUser } from "./utilities/storage.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { API_URLS } from "./settings/constants.js";
import { formatDate } from "./utilities/formatDate.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import message from "./components/message.js";

renderMenu();
displayScrollButton(500);

const searchResults = document.getElementById("searchResults");
const searchForm = document.querySelector(".form-search");
const searchInput = document.getElementById("searchInput");
const messageContainer = document.querySelector(".message-container");
const userData = getUser();

function filterPosts(posts, value) {
  return posts.filter((post) => {
    const lowercaseValue = value.toLowerCase();
    if (
      post.author.name.toLowerCase().includes(lowercaseValue) ||
      post.title.toLowerCase().includes(lowercaseValue) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseValue))
    ) {
      return true;
    } else {
      return false;
    }
  });
}

async function renderSearchResults(form, httpRequest) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (searchInput.value.length === 0) {
      return;
    }

    window.scrollTo(0, 0);

    searchResults.innerHTML = "";

    try {
      const posts = httpRequest;

      getResults(posts);
    } catch (error) {
      console.error("An error occured with 'renderSearchresults' function");
    }
  });
}

async function getResults(httpRequest) {
  const posts = await httpRequest;
  const filteredPosts = filterPosts(posts, searchInput.value);

  searchResults.innerHTML = "";
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
    let postMedia = "";
    let modalContent = "";
    let buttonGroup = "";

    const postDate = new Date(post.created);
    const updateDate = new Date(post.updated);
    const formattedPostDate = formatDate(postDate);
    const formattedUpdateDate = formatDate(updateDate);
    let updatedTime = `(<i>Edit ${formattedUpdateDate}</i>)`;

    if (formattedPostDate === formattedUpdateDate) {
      updatedTime = "";
    }

    if (post.media) {
      const modalId = `modal-${post.id}`;
      postMedia = `
    <div class="thumbnail">
        <img src="${post.media}" alt="Post media thumbnail" class="thumbnail-img" data-modal-id="${modalId}">
    </div>`;
      modalContent = `
    <div class="modal" id="${modalId}">
        <i class="fa-solid fa-circle-xmark close-btn" data-modal-id="${modalId}"></i>
        <img src="${post.media}" alt="Full-sized post media" class="modal-content">
    </div>`;
    }

    if (post.author.name === userData.name) {
      buttonGroup = `
    <div class="btn-group m-0" role="group" aria-label="Post interaction">
        <button class="btn btn-light p-0 btn-edit" title="Edit" data-id="${post.id}" data-name="${post.author.name}">
        <i class="fa-regular fa-pen-to-square" data-id="${post.id}" data-name="${post.author.name}"></i>
        </button>
        <button class="btn btn-light p-0 btn-delete" title="Delete" data-id="${post.id}">
        <i class="fa-regular fa-trash-can" data-id="${post.id}"></i>
        </button>
    </div>`;
    } else {
      buttonGroup = `
    <div class="btn-group m-0" role="group" aria-label="Post interaction">
        <button class="btn btn-outline-secondary p-0 btn-like" title="Like">
        <i class="fa-regular fa-thumbs-up"></i>
        </button>
        <button class="btn btn-outline-secondary p-0 btn-comment" title="Comment">
        <i class="fa-regular fa-comment"></i>
        </button>
    </div>`;
    }

    searchResults.innerHTML += `
  <div class="card m-4 post" data-id="${post.id}">

      <div class="card-header border-0">
          <div class="d-flex justify-content-between align-items-center">
              <p class="fs-6 card-header_name">${post.author.name}</p>
              <div class="card-follow" data-name="${post.author.name}">
                  <i class="fa-regular fa-square-plus follow-button" title="Follow" data-name="${
                    post.author.name
                  }"></i>
              </div>
          </div>
      </div>

      <div class="card-content border-bottom">
          <div class="card-body">
              <div class="row d-flex justify-content-between">
                  <p class="col-8 fs-4">${post.title}</p>
                  <div class="col-4 p-0 d-flex align-items-start justify-content-end flex-wrap gap-1 post-tags">
                      ${post.tags
                        .map(
                          (tag) => `<span class="badge bg-dark">${tag}</span>`
                        )
                        .join(" ")}
                  </div>
              </div>
              <p class="card-text">${post.body}</p>
              ${postMedia}
              ${modalContent}
          </div>
      </div>

      <div class="d-flex justify-content-between align-items-center">
          <p class="d-flex justify-content-end mx-2 mt-0 mb-1 post-date">${formattedPostDate} ${updatedTime}</p>
          ${buttonGroup}
      </div>

  </div>`;
  }
}

renderSearchResults(
  searchForm,
  await httpRequest(
    `${API_URLS.POSTS}?_author=true&_tag=${searchInput.value}`,
    "GET"
  )
);
