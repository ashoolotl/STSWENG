const createReview = async (vehicleUpdate, data, id, service) => {
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

    const response2 = await fetch(`/api/v1/vehicles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleUpdate),
    });
    
    const resData = await response.json();
    const resData2 = await response2.json();

    // if (response.status === 409) {
    //   document.getElementById("errorPopup").style.display = "block";
    //   document.getElementById("errorText").innerText = "You have already reviewed this service.";
    //   return;
    // }

    if (resData.status === "success" && resData2.status === "success") {
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
  const user = document.getElementById("userId").value;
  const serviceName = document.getElementById("serviceName").value;

  if (rating === "" || review.trim() === "") {
    document.getElementById("error-message").innerText = "One or more fields are empty. Please fill in all fields and try again.";
  } else {
    const data = new FormData();
    data.append("rating", rating);
    data.append("ratingMessage", review);
    // data.append("user", user);
    data.append("service", serviceName);
    // const currentDate = new Date();
    // const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    // data.append("date", formattedDate);
    // console.log(data);
    const vehicleData = {
      status: `See Review`,
    };
    const vehicleId = '667b99dad94099b124477eac';
    createReview(vehicleData, data, vehicleId, serviceName);

  }
});

document.addEventListener("DOMContentLoaded", function () {
  const reviewBtns = document.querySelectorAll("#reviewBtn");

  if (reviewBtns.length > 0) {
    reviewBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        let serviceName = "EXPRESS WASH";
        if (btn.getAttribute("data-service-name")) {
          serviceName = this.getAttribute("data-service-name");
        }
        document.getElementById("reviewPopup").style.display = "block";
        document.getElementById("serviceName").value = serviceName;
      });
    });
  }
});

// document.getElementById("reviewBtn").addEventListener("click", function () {
//   document.getElementById("reviewPopup").style.display = "block";
// }); // opening of review popup

document.getElementById("closeReviewPopup").addEventListener("click", function () {
  document.getElementById("reviewPopup").style.display = "none";
}); // closing of review popup through x button

const seeReview = document.getElementById("see-review");
if (seeReview) {
  seeReview.addEventListener("click", function () {
    if (seeReview.getAttribute("data-service-name")) {
      location.assign(`/reviews/${seeReview.getAttribute("data-service-name")}`);
    }
  });
}