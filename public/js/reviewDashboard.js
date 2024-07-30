const createReview = async (data, platenum, service) => {
  try {
    let object = {};
    data.forEach((value, key) => {
      object[key] = value;
    });

    const response = await fetch("/api/v1/reviews", {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const resData = await response.json();

    if (resData.status === "success") {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Your review has been successfully posted.";
      window.setTimeout(() => {
        location.assign(`/reviews/${service}`);
      }, 1000);
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while posting your review. Please try again later.";
  }

  try {
    await fetch(`/api/v1/vehicles/platenum/${platenum}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Complete",
      }),
    });
  } catch (err) {
    console.error("Error updating vehicle status for item", platenum, err);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while posting your review. Please try again later.";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star-rating .star");
  const ratingInput = document.getElementById("ratingInput");

  stars.forEach((star) => {
    star.addEventListener("click", function (event) {
      event.preventDefault();
      const rating = this.getAttribute("data-rating");
      ratingInput.value = rating;
      stars.forEach((s) => {
        s.classList.remove("selected");
        if (s.getAttribute("data-rating") <= rating) {
          s.classList.add("selected");
        }
      });
    });
  });
});

document.getElementById("reviewForm").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const rating = document.getElementById("ratingInput").value;
  const review = document.getElementById("reviewText").value;
  const serviceName = document.getElementById("serviceName").value;
  const plateNumber = document.getElementById("reviewPlateNum").value;

  if (rating === "" || review.trim() === "") {
    document.getElementById("error-message").innerText = "One or more fields are empty. Please fill in all fields and try again.";
  } else {
    const data = new FormData();
    data.append("rating", rating);
    data.append("ratingMessage", review);
    data.append("service", serviceName);
    createReview(data, plateNumber, serviceName);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const reviewBtns = document.querySelectorAll(".reviewBtn");

  if (reviewBtns.length > 0) {
    reviewBtns.forEach((btn) => {
      btn.addEventListener("click", function (event) {
        const serviceName = event.target.getAttribute("data-last-service");
        const plateNumber = event.target.getAttribute("data-plate-number");
        if (serviceName) {
          document.getElementById("reviewHeader").innerText = `Leave Review for ${serviceName}`;
        }
        document.getElementById("reviewPopup").style.display = "block";
        document.getElementById("serviceName").value = serviceName;
        document.getElementById("reviewPlateNum").value = plateNumber;
      });
    });
  }
});

document.getElementById("closeReviewPopup").addEventListener("click", function () {
  document.getElementById("reviewPopup").style.display = "none";
}); 