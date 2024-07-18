const updateReview = async (data, id) => {
  try {
    let object = {};
    data.forEach((value, key) => {
      object[key] = value;
    });

    const response = await fetch(`/api/v1/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();
    if (resData.status === "success") {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Your review has been successfully updated.";
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while updating your review. Please try again later.";
  }
};

const deleteReview = async (reviewId) => {
  const vehicleData = {
    status: `To Review`,
  };
  try {
    const id = "667b99dad94099b124477eac";
    const response = await fetch(`/api/v1/reviews/${reviewId}`, {
      method: "DELETE",
    });
    const response2 = await fetch(`/api/v1/vehicles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
    });
    const resData = await response.json();
    const resData2 = await response2.json();

    if (resData.status === "success" && resData2.status === "success") {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Your review has been successfully deleted.\n\nReloading...";
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while deleting your review. Please try again later.";
  }
};

const submitReply = async (data, id) => {
  try {
    let object = {};
    data.forEach((value, key) => {
      object[key] = value;
    });

    const response = await fetch(`/api/v1/reviews/${id}/reply`, {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();
    if (resData.status === "success") {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Your reply has been successfully posted.";
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while posting your reply. Please try again later.";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const userRole = document.getElementById("userRole").value;
  function handleStarsInput(stars, rating) {
    document.getElementById("ratingInput").value = rating;
    stars.forEach((s) => {
      s.classList.remove("selected");
      if (s.getAttribute("data-rating") <= rating) {
        s.classList.add("selected");
      }
    });
  }
  // star rating
  // const stars = document.querySelectorAll('.star-rating .star');
  // stars.forEach(star => {
  //     star.addEventListener('click', function() {
  //         const rating = this.getAttribute('data-rating');
  //         stars.forEach(s => {
  //             s.classList.remove('selected');
  //             if (s.getAttribute('data-rating') <= rating) {
  //                 s.classList.add('selected');
  //             }
  //         });
  //     });
  // });

  // reply button FOR ADMIN ONLY
  if (userRole === "admin") {
    const replyButton = document.querySelector(".reply-button");
    const adminInputForm = document.getElementById("admin-input");

    replyButton.addEventListener("click", function () {
      adminInputForm.style.display = "flex";
      replyButton.style.display = "none";
    });

    adminInputForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (document.getElementById('reply-text').value.trim() === "") {
        document.getElementById("errorPopup").style.display = "block";
        document.getElementById("errorText").innerText = "Reply text cannot be empty.";
      } else {
        const formData = new FormData(adminInputForm);
        const reviewId = document.getElementById("reviewId").value;
        await submitReply(formData, reviewId);
      }
    });
  } else {
    const editReviewBtn = document.getElementById("edit-review");
    if (!editReviewBtn) {
      return;
    }
    document.getElementById("edit-review").addEventListener("click", function () {
      const stars = document.querySelectorAll(".star");
      const ratingInput = document.getElementById("ratingInput");
      // for cancel button
      const originalRating = parseInt(ratingInput.value);

      const wrappedHandler = function (event) {
        const rating = parseInt(this.getAttribute("data-rating"));
        handleStarsInput(stars, rating);
      };

      stars.forEach((star) => {
        star.style.cursor = "pointer";
        star.addEventListener("click", wrappedHandler);
      });

      function applyOriginalRating() {
        handleStarsInput(stars, originalRating);
      }

      const reviewTextDiv = document.getElementById("review-text");
      const ratingMessage = reviewTextDiv.textContent.trim();

      const originalContent = reviewTextDiv.cloneNode(true);

      const label = document.createElement("label");
      label.setAttribute("for", "reviewEditText");
      const input = document.createElement("input");
      input.style.marginTop = "16px";
      input.type = "text";
      input.name = "reviewEditText";
      input.value = ratingMessage;
      input.id = "reviewEditText";
      input.maxLength = "250";

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancel";
      cancelButton.id = "cancelEditReview";

      const errorMessage = document.createElement("p");
      errorMessage.id = "error-message";
      errorMessage.style.color = "red";

      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      submitButton.textContent = "Submit";
      submitButton.id = "submitEditReview";
      const container = document.createElement("div");
      container.appendChild(label);
      container.appendChild(input);
      container.appendChild(submitButton);
      container.appendChild(cancelButton);
      container.appendChild(errorMessage);
      reviewTextDiv.replaceWith(container);

      cancelButton.addEventListener("click", function () {
        container.replaceWith(originalContent);
        applyOriginalRating(); // Restore original rating
        stars.forEach((star) => {
          star.style.cursor = "default";
          star.removeEventListener("click", wrappedHandler);
        });
      });

      submitButton.addEventListener("click", function () {
        const newRatingMessage = document.getElementById("reviewEditText").value.trim();
        const reviewId = document.getElementById("reviewId").value;

        if (newRatingMessage === "") {
          document.getElementById("error-message").innerText = "Review text cannot be empty.";
        } else if (newRatingMessage === ratingMessage && parseInt(ratingInput.value) === originalRating) {
          document.getElementById("error-message").innerText = "No changes detected. Please make a change to submit or cancel the edit.";
        } else {
          const data = new FormData();
          data.append("rating", ratingInput.value);
          data.append("ratingMessage", newRatingMessage);
          console.log(ratingInput.value, newRatingMessage, reviewId);

          const newRating = document.createElement("div");
          newRating.innerText = newRatingMessage;
          newRating.id = "review-text";
          newRating.classList.add("review-text");
          container.replaceWith(newRating);

          const currentDate = new Date();
          const formattedDate = currentDate.getMonth() + 1 + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
          document.querySelector(".review-date").innerText = `Edited ${formattedDate}`;
          data.append("date", `Edited ${formattedDate}`);

          stars.forEach((star) => {
            star.style.cursor = "default";
            star.removeEventListener("click", wrappedHandler);
          });
          updateReview(data, reviewId);
        }
      });
    });

    document.getElementById("delete-review").addEventListener("click", function () {
      const reviewId = document.getElementById("reviewId").value;
      deleteReview(reviewId);
    });
  }
});

document.getElementById("closePopupError").addEventListener("click", function () {
  document.getElementById("errorPopup").style.display = "none";
});
