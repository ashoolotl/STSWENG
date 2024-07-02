const getAvailedService = async (id) => {
  try {
    const response = await fetch(`/api/v1/servicesAvailed/${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};

const getVehicleById = async (id) => {
  try {
    const response = await fetch(`/api/v1/vehicles/vehicle/${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};

const updateBooking = async (data, id) => {
  try {
    const response = await fetch(`/api/v1/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    console.log(response.status);
    console.log(resData);
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};

const updateVehicleStatus = async (data, id) => {
  try {
    const response = await fetch(`/api/v1/vehicles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData.status === "success") {
      window.location.reload();
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};

async function showPopupService(serviceId) {
  const service = await getAvailedService(serviceId);
  const vehicle = await getVehicleById(service.data.serviceAvailed.plateNumber);
  console.log(service);
  document.getElementById("servicePopupRemainingTokens").textContent = `Remaining Tokens: ${service.data.serviceAvailed.tokensAmount}`;
  document.getElementById("servicePopupPlateNumber").textContent = `Plate Number: ${service.data.serviceAvailed.plateNumber}`;
  document.getElementById("serviceBookingId").value = service.data.serviceAvailed._id;
  var image = document.getElementById("servicePopupImg");
  image.src = `/images/services/${service.data.serviceAvailed.product}.jpeg`;

  if (vehicle.data.vehicle[0].status != "Not Available") {
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "The vehicle is already in an appointment";
  } else {
    document.getElementById("servicePopup").style.display = "block";
  }
}

function closePopupService() {
  document.getElementById("servicePopup").style.display = "none";
}

function showDateTimePopupService() {
  document.getElementById("servicePopup").style.display = "none";
  document.getElementById("dateTimePopupService").style.display = "block";
}

function closeDateTimePopupService() {
  document.getElementById("dateTimePopupService").style.display = "none";
}

function validateTime() {
  var bookingTime = document.getElementById("bookingTime").value;
  if (bookingTime < "09:00" || bookingTime > "17:00") {
    alert("Please select a time between 9:00 AM and 5:00 PM.");
    document.getElementById("bookingTime").value = "09:00";
  }
}

async function submitDateTimeServiceBooking() {
  alert("Your booking is now accepted");
  document.getElementById("dateTimePopupService").style.display = "none";

  const bookingId = document.getElementById("serviceBookingId").value;

  const service = await getAvailedService(bookingId);

  const dateInput = document.getElementById("bookingDate").value;
  const timeInput = document.getElementById("bookingTime").value;
  const dateTimeString = dateInput + "T" + timeInput + ":00";
  const bookingData = {
    scheduledDate: dateTimeString,
    status: "Waiting for vehicle",
  };

  updateBooking(bookingData, service.data.serviceAvailed.bookingId);

  const vehicle = await getVehicleById(service.data.serviceAvailed.plateNumber);

  var date = new Date(dateInput + "T" + timeInput + ":00");

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  var formattedDate = date.toLocaleDateString("en-US", options);

  console.log("Appointment on " + formattedDate);

  const vehicleData = {
    status: `Appointment on ${formattedDate}`,
  };

  updateVehicleStatus(vehicleData, vehicle.data.vehicle[0]._id);
}

document.getElementById("closePopupError").addEventListener("click", function () {
  document.getElementById("errorPopup").style.display = "none";
});
