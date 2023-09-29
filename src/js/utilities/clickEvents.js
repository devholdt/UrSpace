import { API_BASE_URL } from "../settings/constants.js";
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
  const deleteUrl = `${API_BASE_URL}social/posts/${postId}`;

  if (confirm("Are you sure you want to delete this post?") === true) {
    try {
      const response = await httpRequest(deleteUrl, "DELETE");

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
