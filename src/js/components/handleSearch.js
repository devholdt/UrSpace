import { formatDate } from "../utilities/formatDate.js";
import { getUser } from "../utilities/storage.js";
import { setupPaginationContainers } from "./pagination.js";
import message from "./message.js";

const input = document.getElementById("searchInput");
const userData = getUser();
const resultsPerPage = 10;
let currentPage = 1;

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

export async function renderFilteredPosts(
  form,
  input,
  postsContainer,
  httpRequest
) {
  const pagination = document.querySelectorAll(".pagination");
  const loadMoreButton = document.getElementById("loadMoreButton");

  currentPage = 1;

  loadMoreButton.addEventListener("click", () => {
    currentPage++;
    console.log(currentPage);
    postsContainer.innerHTML = "";
    getResults(httpRequest, postsContainer);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    currentPage = 1;

    postsContainer.innerHTML = "";
    pagination.forEach((container) => {
      container.style.display = "none";
    });

    try {
      const posts = httpRequest;

      await getResults(posts, postsContainer);

      input.addEventListener("input", () => {
        if (input.value.length === 0) {
          postsContainer.innerHTML = "";
          pagination.forEach((container) => {
            container.style.display = "flex";
          });
          currentPage = 1;
          getResults(posts, postsContainer);
        }
      });

      input.addEventListener("search", () => {
        if (input.value.length === 0) {
          postsContainer.innerHTML = "";
          pagination.forEach((container) => {
            container.style.display = "flex";
          });
          currentPage = 1;
          getResults(posts, postsContainer);
        }
      });
    } catch (error) {
      console.error("An error occured with 'handleSearch:", error);
    }
  });
}

async function getResults(httpRequest, postsContainer) {
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;

  const posts = await httpRequest;
  const filteredPosts = filterPosts(posts, input.value);

  postsContainer.innerHTML = "";

  if (filteredPosts.length === 0) {
    message(
      "info",
      "No results found. Try a different search query.",
      ".search-results",
      null
    );
    return false;
  }

  for (let i = startIndex; i < Math.min(endIndex, filteredPosts.length); i++) {
    const post = filteredPosts[i];

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

    postsContainer.innerHTML += `
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

  if (endIndex < filteredPosts.length) {
    loadMoreButton.style.display = "flex";
  } else {
    loadMoreButton.style.display = "none";
  }
}
