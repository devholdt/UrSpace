export const storageKey = "posts";

export function storageSetItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function storageGetItem(key) {
  const posts = localStorage.getItem(key);

  if (!posts) {
    return [];
  } else {
    return JSON.parse(posts);
  }
}

const tokenKey = "token";
const userKey = "user";

export function saveToken(token) {
  storageSetItem(tokenKey, token);
}

export function saveUser(user) {
  storageSetItem(userKey, user);
}

export function getUser() {
  const user = storageSetItem(userKey);

  if (user) {
    return user.email;
  }

  return null;
}
