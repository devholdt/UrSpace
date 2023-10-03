import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "./httpRequest.js";

export function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}

export function clearUrl(button, input) {
  button.addEventListener("click", () => {
    input.value = "";
  });
}

export async function handleDelete(event) {
  const postId = event.target.dataset.id;

  if (confirm("Are you sure you want to delete this post?") === true) {
    try {
      const response = await httpRequest(
        `${API_URLS.POSTS}/${postId}`,
        "DELETE"
      );

      if (response === 204) {
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return;
  }
}
