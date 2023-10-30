/**
 * Sets an item in local storage with a given key and value.
 *
 * @param {Object} obj - An object containing the key and value to store.
 */
export function storageSetItem(obj) {
  localStorage.setItem(obj.key, JSON.stringify(obj.value));
}

/**
 * Retrieves an item from local storage using a given key.
 *
 * @param {string} key - The key used to retrieve the item from local storage.
 * @returns {any} - The item retrieved from local storage.
 */
export function storageGetItem(key) {
  const storedItem = localStorage.getItem(key);

  return JSON.parse(storedItem);
}

const tokenKey = "token";
const userKey = "user";

/**
 * Saves a user token in local storage.
 *
 * @param {string} token - The user token to save.
 */
export function saveToken(token) {
  storageSetItem({ key: tokenKey, value: token });
}

/**
 * Retrieves a user token from local storage.
 *
 * @returns {string|null} - The user token retrieved or null.
 */
export function getToken() {
  return storageGetItem(tokenKey);
}

/**
 * Saves user data in local storage.
 *
 * @param {Object} user - The user data to save.
 */
export function saveUser(user) {
  storageSetItem({ key: userKey, value: user });
}

/**
 * Retrieves user data from local storage.
 *
 * @returns {Object|null} - The user data retrieved or null.
 */
export function getUser() {
  const user = storageGetItem(userKey);

  if (user) {
    return JSON.parse(user);
  }

  return null;
}
