import message from "./message.js";
import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { formatDate } from "../utilities/formatDate.js";

/**
 * Handles submitting comments for posts.
 */
export async function handleComment() {
  // Select all comment form containers on the page.
  const commentFormContainers = document.querySelectorAll(
    ".comment-form-container"
  );

  commentFormContainers.forEach((container) => {
    const commentForm = container.querySelector("form");
    const commentInput = commentForm.querySelector("#commentInput");

    // Construct the URL for posting the comment based on the dataset ID.
    const url = `${API_URLS.POSTS}/${commentForm.dataset.id}/comment`;

    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get the comment value from the input field.
      const commentValue = commentInput.value;

      try {
        // Get the comments container element to append the new comment.
        const commentsContainer = container.querySelector(".comments");

        // Send a POST request to the server to add a new comment.
        const newComment = await httpRequest(url, "POST", {
          body: commentValue,
        });

        const newCommentDate = new Date(newComment.created);
        const formattedNewCommentDate = formatDate(newCommentDate);

        // Create the HTML structure for the new comment.
        const commentElement = document.createElement("div");
        commentElement.classList.add(
          "d-flex",
          "rounded-bottom",
          "post-comment"
        );
        commentElement.innerHTML = `
            <div class="card post p-">
        
            <div class="card-header border-0 py-1">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex gap-2">
                        <p>${newComment.author.name}</p>
                        <a href="#" class="fst-italic fw-light">visit profile</a>
                    </div>
                    <p class="fst-italic fw-light">id: ${newComment.id}</p>
                </div>
            </div>

            <div class="card-content border-bottom">
                <div class="card-body">
                    <div class="card-text">${newComment.body}</div>
                </div>
            </div>

            <div class="d-flex justify-content-between post-bottom">
                <p class="mx-2 my-1">${formattedNewCommentDate}</p>
                <p class="mx-2 my-1 fw-light">id: ${newComment.id}</p>
            </div>

            </div>`;

        if (commentsContainer) {
          // Append the new comment to the comments container.
          commentsContainer.append(commentElement);
        }

        // Show a success message after posting the comment.
        message("success", "Comment posted!", ".message-fixed");

        // Clear the comment input field.
        commentInput.value = "";
      } catch (error) {
        message(
          "error",
          "An error occured when attempting to post a comment.",
          ".message-fixed"
        );
      }
    });
  });
}
