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

document.addEventListener('DOMContentLoaded', function () {
  const statusFilter = document.getElementById('status-filter');
  console.log(statusFilter.value);
  const serviceBookings = document.querySelectorAll('.car');
  console.log(serviceBookings.length);

  statusFilter.addEventListener('change', function (e) {
    const selectedStatus = statusFilter.value.toLowerCase() == 'pending' ? 'pending:' : statusFilter.value.toLowerCase();
    console.log(selectedStatus);
    filterBookings(selectedStatus);
  });

  function filterBookings(status) {
    serviceBookings.forEach((booking) => {
      const bookingStatus = booking.getAttribute('data-status').toLowerCase();
      if (status === 'all' || bookingStatus === status) {
        booking.classList.remove('hide');
      } else {
        booking.classList.add('hide');
      }
    });
  }
});
