import message from "../components/message.js";

export async function isValidImageUrl(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // URL is not accessible.
      return false;
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.startsWith("image/")) {
      // It's an image.
      return true;
    } else {
      // It's not an image.
      return false;
    }
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to validate image URL: ${error}`,
      ".message-posts"
    );
    return false;
  }
}
