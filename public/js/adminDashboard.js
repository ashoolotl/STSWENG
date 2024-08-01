document.addEventListener("DOMContentLoaded", async () => {
  const updateStatusButtons = document.querySelectorAll(".update-status");
  if (updateStatusButtons.length > 0) {
    updateStatusButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        console.log("update status clicked");
        const vehiclePlatNum = e.target.dataset.vehicleplatenum;
        try {
          await fetch(`/api/v1/vehicles/platenum/${vehiclePlatNum}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "To Review",
            }),
          });
          location.reload();
        } catch (err) {
          console.error("Error updating vehicle status for item", vehiclePlatNum, err);
          document.getElementById("errorPopup").style.display = "block";
          document.getElementById("errorText").innerText = "Failed to update vehicle status. Please try again later.";
        }
      });
    });
  }
});
