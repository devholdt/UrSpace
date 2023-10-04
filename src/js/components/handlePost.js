import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { isValidImageUrl } from "../utilities/urlValidation.js";
import message from "./message.js";

export async function handlePost(event) {
  event.preventDefault();

  const titleInput = document.getElementById("postTitle");
  const title = titleInput.value;

  const body = document.getElementById("postBody").value;
  const media = document.getElementById("postMedia").value;

  const tagsInput = document.getElementById("postTags");
  const tags = tagsInput.value.split(", ").map((tag) => tag.trim());

  if (tags.length > 6) {
    message("error", "You can only add up to 6 tags", ".message-post");
    return;
  }

  if (title.length === 0) {
    message("error", "Title required", ".message-post");
    titleInput.style.borderColor = "#ff4444";
    titleInput.style.borderWidth = "3px";

    setTimeout(() => {
      titleInput.style.borderColor = "white";
    }, 1900);
    return;
  }

  if (media && !(await isValidImageUrl(media))) {
    message("error", "Invalid media URL", ".message-post");
    return;
  }

  const post = {
    title: title,
    body: body,
    media: media,
    tags: tags,
  };

  try {
    const response = await httpRequest(API_URLS.POSTS, "POST", post);

    if (response) {
      message("success", "Post successful", ".message-post");

      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (!response) {
      message(
        "error",
        "An error occured while attempting to post",
        ".message-post"
      );
      return;
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured", ".message-post");
  }
}
