const getUserInformation = async (id) => {
  try {
    const response = await fetch(`/api/v1/users/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    alert("Error fetching user information: " + err.message);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Put your JavaScript code here
  // Example:
  // Your other JavaScript code here...
});

function closeMoreInfoPopup() {
  document.getElementById("showMoreInfoPopupSubscription").style.display = "none";
}
