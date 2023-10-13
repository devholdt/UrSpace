import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { isValidImageUrl } from "../utilities/urlValidation.js";
import message from "./message.js";

/**
 * Handles the submission of a new post form.
 *
 * @param {Event} event - The form submission event.
 */
export async function handlePost(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get references to form input elements
  const titleInput = document.querySelector(".title-input");
  const title = titleInput.value;
  const body = document.querySelector(".body-input").value;
  const media = document.querySelector(".media-input").value;
  const tagsInput = document.querySelector(".tags-input");
  const tags = tagsInput.value.split(", ").map((tag) => tag.trim());

  // Check if the number of tags exceeds the allowed limit
  if (tags.length > 6) {
    message("error", "You can only add up to 6 tags", ".message-post");
    return;
  }

  // Check if the title input is empty
  if (title.length === 0) {
    message("error", "Title required", ".message-post");
    titleInput.style.borderColor = "#ff4444";
    titleInput.style.borderWidth = "3px";

    // Reset the title input's border color and width after a delay
    setTimeout(() => {
      titleInput.style.borderColor = "#dee2e6";
      titleInput.style.borderWidth = "1px";
    }, 1900);
    return;
  }

  const isValidMedia = await isValidImageUrl(media);

  if (media && !isValidMedia) {
    message("error", "Invalid media URL", ".message-post");
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
      // Display a success message if the post is successful
      message("success", "Post successful", ".message-post");

      // Reload the page after a delay
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (!response) {
      // Display an error message if the post request fails
      message(
        "error",
        "An error occured while attempting to post",
        ".message-post"
      );
      return;
    }
  } catch (error) {
    // display an error message if an error occurs during the request
    message("error", `An error occured: ${error}`, ".message-post");
  }
}
