import { API_URLS } from "../settings/constants.mjs";
import { httpRequest } from "../utilities/httpRequest.mjs";
import { isValidImageUrl } from "../utilities/urlValidation.mjs";
import message from "./message.mjs";

/**
 * Handles the submission of a new post form.
 *
 * @param {Event} event - The form submission event.
 */
export async function handlePost(event) {
  event.preventDefault();

  // Get references to form input elements
  const titleInput = document.querySelector(".title-input");
  const title = titleInput.value;
  const body = document.querySelector(".body-input").value;
  const mediaInput = document.querySelector(".media-input");
  const media = mediaInput.value;
  const tagsInput = document.querySelector(".tags-input");
  const tags = tagsInput.value.split(", ").map((tag) => tag.trim());

  // Check if the number of tags exceeds the allowed limit
  if (tags.length > 6) {
    message("error", "You can only add up to 6 tags.", ".message-post");
    return;
  }

  // Check if the title input is empty
  if (title.length === 0) {
    message("error", "Title required.", ".message-post");
    titleInput.style.borderColor = "#ff4444";
    titleInput.style.borderWidth = "3px";

    // Reset the title input's border color and width after a delay
    setTimeout(() => {
      titleInput.style.borderColor = "#dee2e6";
      titleInput.style.borderWidth = "1px";
    }, 1900);
    return;
  }

  // Check if media URL is valid
  const isValidMedia = await isValidImageUrl(media);

  if (media && !isValidMedia) {
    message("error", "Invalid media URL", ".message-post");
    mediaInput.style.borderColor = "#ff4444";
    mediaInput.style.borderWidth = "3px";

    // Reset the media input's border color and width after a delay
    setTimeout(() => {
      mediaInput.style.borderColor = "#dee2e6";
      mediaInput.style.borderWidth = "1px";
    }, 1900);
    return;
  }

  // Create a post object with the form inputs
  const post = {
    title: title,
    body: body,
    media: media,
    tags: tags,
  };

  try {
    // Send a POST request to create a new post using the provided HTTP request function
    const response = await httpRequest(API_URLS.POSTS, "POST", post);

    if (response) {
      message("success", "Post successful!", ".message-post");

      // Reload the page after a delay
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (!response) {
      message(
        "error",
        "An error occured while attempting to post.",
        ".message-fixed"
      );
      return;
    }
  } catch (error) {
    message("error", "An error occured.", ".message-fixed");
  }
}
