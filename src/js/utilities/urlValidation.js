import message from "../components/message.js";

export async function isValidImageUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      return contentType && contentType.startsWith("image/");
    }

    return;
  } catch (error) {
    message(
      "error",
      `An error occured when attempting to validate image URL: ${error}`,
      ".message-posts"
    );
    return;
  }
}
