import renderMenu from "./components/renderMenu.js";
import message from "./components/message.js";
import { httpRequest } from "./utilities/httpRequest.js";
import { API_URLS, DEFAULT_URLS } from "./settings/constants.js";
import { displayScrollButton } from "./utilities/scrollEvents.js";
import { handleImageModal } from "./components/handleImageModal.js";
import { handleDelete } from "./utilities/clickEvents.js";
import { handleEdit } from "./components/editPost.js";
import { generatePostHTML } from "./components/renderPosts.js";
import { handleComment } from "./components/handleComment.js";

// Render the menu and display the scroll button
renderMenu();
displayScrollButton(500);

// Get references to various elements in the HTML
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const containerParagraph = document.querySelector("#searchContainer p");
const userResultsDiv = document.getElementById("userResults");
const postResultsDiv = document.getElementById("postResults");
const userSearchHeading = document.querySelector(".user-search-heading");
const postSearchHeading = document.querySelector(".post-search-heading");

const usersUrl = `${API_URLS.PROFILES}?_posts=true?`;
const postsUrl = `${API_URLS.POSTS}?_author=true&_comments=true&_reactions=true&_tag=${searchInput.value}`;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm.length === 0) {
    return;
  }

  handleSearch(searchTerm);
});

async function handleSearch(searchTerm) {
  const usersPromise = getUsersBySearchTerm(searchTerm);
  const postsPromise = getPostsBySearchTerm(searchTerm);

  const [users, posts] = await Promise.all([usersPromise, postsPromise]);

  updateUserResults(users);
  updatePostResults(posts);
}

function updateUserResults(users) {
  userResultsDiv.innerHTML = "";
  containerParagraph.innerHTML = "";

  userSearchHeading.innerHTML = "Users";
  userSearchHeading.classList.add("bg-primary");

  if (users.length === 0) {
    message(
      "info",
      "No users found. Try a different search query.",
      ".message-search-users",
      null
    );
  }

  users.forEach((user) => {
    const userElement = createUserResultElement(user);
    userResultsDiv.appendChild(userElement);
  });
}

function updatePostResults(posts) {
  postResultsDiv.innerHTML = "";
  containerParagraph.innerHTML = "";

  postSearchHeading.innerHTML = "Posts";
  postSearchHeading.classList.add("bg-primary");

  if (posts.length === 0) {
    message(
      "info",
      "No posts found. Try a different search query.",
      ".message-search-posts",
      null
    );
  }

  posts.forEach((post) => {
    const postElement = createPostResultElement(post);
    postResultsDiv.appendChild(postElement);
  });

  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });

  // Add event listeners for edit buttons
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  // Initialize image modal functionality
  handleImageModal();

  // Handle post commenting functionality
  handleComment();
}

async function getUsersBySearchTerm(searchTerm) {
  searchTerm = searchInput.value;

  try {
    const users = await httpRequest(usersUrl, "GET");

    return users.filter((user) => {
      const lowercaseValue = searchTerm.toLowerCase();

      if (user.name.toLowerCase().trim().includes(lowercaseValue)) {
        return true;
      } else {
        return false;
      }
    });
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to fetch search results (users): ${error}`,
      ".message-search-users",
      null
    );
    return Promise.resolve([]);
  }
}

async function getPostsBySearchTerm(searchTerm) {
  searchTerm = searchInput.value;

  try {
    const posts = await httpRequest(postsUrl, "GET");

    return posts.filter((post) => {
      const lowercaseValue = searchTerm.toLowerCase().trim();

      if (
        post.author.name.toLowerCase().trim().includes(lowercaseValue) ||
        post.title.toLowerCase().trim().includes(lowercaseValue) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseValue)) ||
        post.id.toString().includes(searchTerm.toString())
      ) {
        return true;
      } else {
        return false;
      }
    });
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to fetch search results (posts): ${error}`,
      ".message-search-posts",
      null
    );
  }
}

function createUserResultElement(user) {
  const userElement = document.createElement("div");
  userElement.classList.add("col-md-4", "col-sm-6", "px-1");

  let userAvatar = "";

  if (user.avatar) {
    userAvatar = user.avatar;
  } else {
    userAvatar = DEFAULT_URLS.AVATAR;
  }

  userElement.innerHTML = `
  <button class="btn btn-outline-light">
    <a href="profile.html?name=${user.name}" class="d-flex gap-2 text-decoration-none search-result-user">
      <img src="${userAvatar}" class="avatar" alt="${user.name}'s avatar" onerror="this.src='${DEFAULT_URLS.AVATAR}'">
      <p class="my-auto">${user.name}</p>
    </a>
  </button>`;

  return userElement;
}

function createPostResultElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("px-1");
  postElement.innerHTML = generatePostHTML(post);
  return postElement;
}
