import { getToken } from "./storage.js";
import message from "../components/message.js";

/**
 * A flexible and dynamic function for HTTP Requests.
 *
 * @param {string} url - The URL to send the HTTP request to.
 * @param {string} [method="GET"] - The HTTP method for the request (e.g., "GET", "POST", etc.).
 * @param {object|null} [body=null] - The request body data to send, if applicable. Should be an object or null.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response data if the request is successful,
 *                            or rejects with an error message if the request fails.
 *
 * @throws {Error} - If the HTTP request fails.
 *
 * @description This function uses the 'getToken' function to get the user token for authentication.
 */
export async function httpRequest(url, method = "GET", body = null) {
  try {
    // Get the user token from local storage
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      // Include the user's token in the request headers for authentication.
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
      message("error", "Request failed.", ".message-fixed", null);

      throw new Error("HTTP Request failed");
    }
  } catch (error) {
    message(
      "error",
      "An error occured with the API call.",
      ".message-fixed",
      null
    );

    throw error;
  }
}
