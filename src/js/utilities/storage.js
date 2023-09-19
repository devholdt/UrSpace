const tokenKey = "token";
const userKey = "user";

export function storageSetItem(key, value) {
  localStorage.setItem(key, value);
}

export function saveToken(token) {
  storageSetItem(tokenKey, token);
}

export function saveUser(user) {
  storageSetItem(userKey, user);
}

// export const storageKey = "posts";

// export function storageGetItem(key) {
//   const posts = localStorage.getItem(key);

//   if (!posts) {
//     return [];
//   } else {
//     return JSON.parse(posts);
//   }
// }

// export function getUser() {
//   const user = storageGetItem(userKey);

//   if (user) {
//     return user.name;
//   }

//   return null;
// }
