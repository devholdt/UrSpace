export function storageSetItem(obj) {
  localStorage.setItem(obj.key, JSON.stringify(obj.value));
}

export function storageGetItem(key) {
  const storedItem = localStorage.getItem(key);

  return JSON.parse(storedItem);
}

const tokenKey = "token";
const userKey = "user";

export function saveToken(token) {
  storageSetItem({ key: tokenKey, value: token });
}

export function saveUser(user) {
  storageSetItem({ key: userKey, value: user });
}

export function getToken() {
  return storageGetItem(tokenKey);
}

export function getUser() {
  const user = storageGetItem(userKey);

  if (user) {
    return JSON.parse(user);
  }

  return null;
}

// localStorage.clear();
