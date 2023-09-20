// import { storageGetItem, storageSetItem } from "./storage.js";
// import { renderPosts } from "../components/renderPosts.js";

// export function postContent() {
//   const posts = storageGetItem(storageKey);
//   const input = document.querySelector("#textContent");
//   const inputValue = input.value;

//   if (inputValue.length >= 1) {
//     const newPost = { content: inputValue, id: Date.now() };
//     input.value = "";
//     input.focus();
//     posts.push(newPost);

//     storageSetItem(storageKey, posts);
//     renderPosts(posts);
//   }
// }

export function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}
