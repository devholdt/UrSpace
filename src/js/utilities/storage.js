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
