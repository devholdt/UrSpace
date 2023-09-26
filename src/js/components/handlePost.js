import { API_BASE_URL } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { isValidImageUrl } from "../utilities/urlValidation.js";
import message from "./message.js";

const postsUrl = `${API_BASE_URL}social/posts`;

export async function handlePost(event) {
  event.preventDefault();

  const titleInput = document.getElementById("postTitle");

  const title = titleInput.value;
  const body = document.getElementById("postBody").value;
  const media = document.getElementById("postMedia").value;

  if (title.length === 0) {
    message("error", "Title required");
    titleInput.style.borderColor = "#ff4444";

    setTimeout(() => {
      titleInput.style.borderColor = "#dee2e6";
    }, 1900);
    return;
  }

  if (media && !(await isValidImageUrl(media))) {
    message("error", "Invalid media URL");
    return;
  }

  const post = {
    title: title,
    body: body,
    media: media,
  };

  try {
    const response = await httpRequest(postsUrl, "POST", post);

    console.log(response);

    if (response) {
      message("success", "Post successful");

      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (!response) {
      message("error", "An error occured while attempting to post");
      return;
    }
  } catch (error) {
    console.log(error);
    message("error", "An error occured");
  }
}
