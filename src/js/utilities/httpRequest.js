import { getToken } from "./storage.js";
import message from "../components/message.js";

/**
 *
 * @param {string} url - The URL to send the HTTP request to.
 * @param {string} [method="GET"] - The HTTP method for the request (e.g., "GET", "POST", etc.).
 * @param {object|null} [body=null] - The request body data to send, if applicable. Should be an object or null.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response data if the request is successful,
 *                            or rejects with an error message if the request fails.
 */
export async function httpRequest(url, method = "GET", body = null) {
  try {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      const errorData = await response.json();
      message(
        "error",
        errorData.message || "Request failed",
        ".message-container"
      );
    }
  } catch (error) {
    message(
      "error",
      "An error occured with the API call",
      ".message-container"
    );
  }
}
