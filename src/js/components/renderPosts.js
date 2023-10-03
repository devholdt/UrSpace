import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { handleDelete, clearUrl } from "../utilities/clickEvents.js";
import { getUser } from "../utilities/storage.js";
import message from "./message.js";

const userData = getUser();

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

    if (posts.length === 0) {
      postsContainer.innerHTML = `<p class="no-posts">No posts found</p>`;
    }

    postsContainer.innerHTML = "";

    for (const post of posts) {
      let postMedia = "";
      let modalContent = "";
      let buttonGroup = "";

      let postTags = [];

      const postDate = new Date(post.created);

      const day = postDate.getDate().toString().padStart(2, "0");
      const month = (postDate.getMonth() + 1).toString().padStart(2, "0");
      const year = postDate.getFullYear().toString().slice(-2);
      const hours = postDate.getHours().toString().padStart(2, "0");
      const minutes = postDate.getMinutes().toString().padStart(2, "0");

      const formattedPostDate = `${day}/${month}/${year} ${hours}:${minutes}`;

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
                <div class="post-tags">
                  <span class="badge bg-light text-dark py-1 px-2">${post.tags}</span>
                </div>
               <!-- <div class="card-follow" data-name="${post.author.name}">
                  <i class="fa-regular fa-square-plus follow-button" title="Follow" data-name="${post.author.name}"></i>
                </div> -->
              </div>
            </div>

            <div class="card-content border-bottom">
              <div class="card-body">
                <p class="fs-4">${post.title}</p>
                <p class="card-text">${post.body}</p>
                ${postMedia}
                ${modalContent}
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
            <p class="d-flex justify-content-end mx-2 mt-0 mb-1 post-date">${formattedPostDate}</p>
            ${buttonGroup}
            </div>
            
          </div>`;

      // const usersFollowed = await handleFollowing();

      // function checkFollowed(usersFollowed, postAuthor) {
      //   if (usersFollowed.includes(postAuthor)) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }

      // const followIcons = document.querySelectorAll(".card-follow");

      // followIcons.forEach((icon) => {
      //   const followButton = icon.querySelector(".follow-button");
      //   const username = icon.dataset.name;

      //   if (checkFollowed(usersFollowed, username)) {
      //     followButton.classList.add("fa-solid", "unfollow-user");
      //     followButton.classList.remove("fa-regular", "follow-user");

      //     const unfollowUser = icon.querySelector(".unfollow-user");

      //     unfollowUser.addEventListener("click", (e) => {
      //       const username = e.target.dataset.name;

      //       handleUnfollow(username);

      //       unfollowUser.classList.remove("fa-solid", "unfollow-user");
      //       unfollowUser.classList.add("fa-regular", "follow-user");
      //     });
      //   } else {
      //     followButton.classList.remove("fa-solid", "unfollow-user");
      //     followButton.classList.add("fa-regular", "follow-user");

      //     const followUser = icon.querySelector(".follow-user");

      //     followUser.addEventListener("click", (e) => {
      //       const username = e.target.dataset.name;

      //       handleFollow(username);

      //       followUser.classList.add("fa-solid", "unfollow-user");
      //       followUser.classList.remove("fa-regular", "follow-user");
      //     });
      //   }
      // });
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured with the API call");
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  const editButtons = document.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  attachEventListeners();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("modal-active");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".modal-content").addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

function closeModal(e) {
  if (
    e.target.classList.contains("modal") ||
    e.target.classList.contains("close-btn")
  ) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.classList.remove("modal-active");
    });
  }
}

function attachEventListeners() {
  const thumbnailImages = document.querySelectorAll(".thumbnail-img");

  thumbnailImages.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const modalId = thumbnail.getAttribute("data-modal-id");
      openModal(modalId);
    });
  });
}

async function handleEdit(event) {
  const postId = event.target.getAttribute("data-id");
  const postUrl = `${API_URLS.POSTS}/${postId}`;

  const modalHtml = `
    <div id="editModal" class="modal flex-column justify-content-center">
      <div class="modal-content py-5">
        <i class="fa-solid fa-circle-xmark close-btn" id="closeEditModal"></i>

        <form id="editForm" class="d-flex flex-column mx-auto">

        <h2>Edit Post</h2>

        <div class="mb-2">
          <label for="editTitle" class="form-label m-0">Title</label>
          <input type="text" class="form-control shadow-none" id="editTitle" name="editTitle">
        </div>

        <div class="mb-2">
          <label for="editBody" class="form-label m-0">Body</label>
          <textarea class="form-control shadow-none" id="editBody" name="editBody"></textarea>
        </div>

        <div class="mb-2">
          <label for="editMedia" class="form-label m-0">Media URL</label>
          <div class="d-flex">
              <input type="text" class="form-control shadow-none url-input" id="editMedia" name="editMedia">
              <button type="button" class="btn btn-light btn-clear" id="clearEditMediaUrl"><i
                      class="fa-solid fa-xmark"></i></button>
          </div>
        </div>

        <div class="mb-4">
          <label for="editTags" class="form-label m-0">Tags</label>
          <input type="text" class="form-control shadow-none" id="editTags" name="editTags">
        </div>

        <div class="d-flex justify-content-between edit-submit">
          <div class="message-container d-flex justify-content-center"></div>
          <button type="submit" class="btn btn-post" title="Edit">Save</button>
        </div>

        </form>

      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const editModal = document.getElementById("editModal");
  const editMedia = document.getElementById("editMedia");
  const editMediaUrl = document.getElementById("clearEditMediaUrl");

  clearUrl(editMediaUrl, editMedia);

  try {
    const post = await httpRequest(postUrl, "GET");

    if (!post) {
      console.error("Post not found or API response is invalid");
      return;
    }

    const postName = event.target.dataset.name;

    const modalContent = editModal.querySelector(".modal-content");

    const closeButton = editModal.querySelector("#closeEditModal");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        editModal.style.display = "none";
      });
    }

    if (postName === userData.name) {
      modalContent.querySelector("#editTitle").value = post.title;
      modalContent.querySelector("#editBody").value = post.body;
      modalContent.querySelector("#editMedia").value = post.media || "";

      const editTagsInput = modalContent.querySelector("#editTags");

      if (post.tags && post.tags.length > 0) {
        const tagsString = post.tags.join(", ");
        editTagsInput.value = tagsString;
      }

      editModal.style.display = "flex";

      modalContent
        .querySelector("form")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const editedPost = {
            title: modalContent.querySelector("#editTitle").value,
            body: modalContent.querySelector("#editBody").value,
            media: modalContent.querySelector("#editMedia").value,
            tags: editTagsInput.value.split(",").map((tag) => tag.trim()),
          };

          const updateResponse = await httpRequest(postUrl, "PUT", editedPost);

          if (updateResponse.updated) {
            message("success", "Post edited successfully");

            setTimeout(() => {
              post.title = editedPost.title;
              post.body = editedPost.body;
              post.media = editedPost.media;
              post.tags = editedPost.tags;
              updatePostUI(postId, post);
              editModal.style.display = "none";
            }, 1000);
          }
        });
    } else {
      console.error("Unauthorized to edit this post.");
      message("error", "Unauthorized to edit this post.");
    }
  } catch (error) {
    console.error("Error fetching post data:", error);
    message("error", `Error fetching post data: ${error}`);
  }
}

function updatePostUI(postId, post) {
  const postContainer = document.querySelector(`.post[data-id="${postId}"]`);
  const titleElement = postContainer.querySelector(".fs-4");
  const bodyElement = postContainer.querySelector(".card-text");
  const mediaElement = postContainer.querySelector(".thumbnail-img");
  const tagsElement = postContainer.querySelector(".post-tags");

  titleElement.textContent = post.title;
  bodyElement.textContent = post.body;
  tagsElement.textContent = post.tags.join(" ");

  if (mediaElement) {
    if (post.media) {
      mediaElement.setAttribute("src", post.media);
      mediaElement.style.display = "block";
    } else {
      mediaElement.style.display = "none";
    }
  }
}

// async function handleFollowing() {
//   const url = `${API_BASE_URL}social/profiles/${userData.name}?_following=true`;

//   try {
//     const response = await httpRequest(url, "GET");
//     const usersFollowed = response.following;
//     const usernames = usersFollowed.map((user) => user.name);
//     return usernames;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// }

// function updateButtonState(username) {
//   const followIcons = document.querySelectorAll(".card-follow");

//   followIcons.forEach((icon) => {
//     const followUser = icon.querySelector(".follow-user");
//     const unfollowUser = icon.querySelector(".unfollow-user");
//     const userFollowed = icon.dataset.name === username;

//     followUser.style.display = userFollowed ? "none" : "block";
//     unfollowUser.style.display = userFollowed ? "block" : "none";
//   });
// }

// async function handleFollow(username) {
//   const followUrl = `${API_BASE_URL}social/profiles/${username}/follow`;

//   try {
//     const response = httpRequest(followUrl, "PUT", {});
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function handleUnfollow(username) {
//   const unfollowUrl = `${API_BASE_URL}social/profiles/${username}/unfollow`;

//   try {
//     const response = httpRequest(unfollowUrl, "PUT", {});
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }

// <i class="fa-solid fa-square-plus unfollow-user" title="Unfollow" data-name="${post.author.name}"></i>
