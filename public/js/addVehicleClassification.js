// this function is used to get all vehicle classifications
const getAllVehicleClassification = async () => {
  try {
    const res = await fetch("/api/v1/vehicle-classifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const resData = await res.json();
    return resData;
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching vehicle classifications. Please try again later.";
  }
};

// this function is used to create a new vehicle classification
const addVehicle = async (data) => {
  try {
    let object = {};
    data.forEach((value, key) => {
      object[key] = value;
    });
    console.log(JSON.stringify(object));

    const res = await fetch("/api/v1/vehicle-classifications", {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful (status code 2xx)
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const resData = await res.json();
    console.log(resData.status);

    if (resData.status === "success") {
      document.getElementById("addCarSuccessPopup").style.display = "block";
    }
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};
// opening of add car popup
document.getElementById("add").addEventListener("click", function () {
  document.getElementById("addCarPopup").style.display = "block";
});
// closing of add car popup through x button
document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("addCarPopup").style.display = "none";
});
// closing of success popup through x button
document.getElementById("closeSuccessPopup").addEventListener("click", function () {
  document.getElementById("addCarSuccessPopup").style.display = "none";
  window.location.reload();
});
// closing of success popup after clicking done button
document.getElementById("closeBtn").addEventListener("click", function () {
  document.getElementById("addCarSuccessPopup").style.display = "none";
  window.location.reload();
});

// add a new vehicle classification on submit
document.getElementById("addCarForm").addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("addCarPopup").style.display = "none";

  // create a form data since we are uploading photo
  const formData = new FormData();
  const name = document.getElementById("vehicleClassification").value;
  const photo = document.getElementById("photo").files[0];

  formData.append("name", name);
  formData.append("photo", photo);
  addVehicle(formData);
});

// this function is used to update vehicle classification
const updateVehicleClassification = async (data, id) => {
  try {
    const res = await fetch(`/api/v1/vehicle-classifications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is successful (status code 2xx)
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const resData = await res.json();
    console.log(resData.status);
    if (resData.status === "success") {
      document.getElementById("successPopupEdit").style.display = "block";
    }
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while updating vehicle classification. Please try again later.";
  }
};

// edit a vehicle classification on submit
document.getElementById("editCarForm").addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("editCarPopup").style.display = "none";
  const form = new FormData();
  form.append("name", document.getElementById("vehicleClassificationEdit").value);
  var id = document.getElementById("vehicleClassId").value;
  var fileInput = document.getElementById("photoEdit");
  // Check if any file is selected
  if (fileInput.files && fileInput.files[0]) {
    // An image is uploaded
    form.append("photo", document.getElementById("photoEdit").files[0]);
  }

  updateVehicleClassification(form, id);
});

// closing of edit car popup through x button
document.getElementById("closePopupEdit").addEventListener("click", function () {
  document.getElementById("editCarPopup").style.display = "none";
});
// closing of success popup through x button
document.getElementById("closeSuccessPopupEdit").addEventListener("click", function () {
  document.getElementById("successPopupEdit").style.display = "none";
  window.location.reload();
});
// closing of success popup after clicking done button
document.getElementById("closeBtnEdit").addEventListener("click", function () {
  document.getElementById("successPopupEdit").style.display = "none";
  window.location.reload();
});

const deleteVehicleClassification = async (id) => {
  try {
    const res = await fetch(`/api/v1/vehicle-classifications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful (status code 2xx)
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const resData = await res.json();
    console.log(resData.status);
    if (resData.status === undefined) {
      document.getElementById("successPopupDelete").style.display = "block";
      window.location.reload();
    }
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while deleting vehicle classification. Please try again later.";
  }
};
// closing of success popup through x button
document.getElementById("closeSuccessPopupDelete").addEventListener("click", function () {
  setTimeout(function () {}, 2000);
  document.getElementById("successPopupDelete").style.display = "none";
  window.location.reload();
});
// closing of success popup after clicking done button
document.getElementById("closeBtnEdit").addEventListener("click", function () {
  setTimeout(function () {}, 2000);
  document.getElementById("successPopupEdit").style.display = "none";
  window.location.reload();
});

document.addEventListener("DOMContentLoaded", async () => {
  const editButtons = document.querySelectorAll("#vehicleClassificationEditBtn");
  const deleteButtons = document.querySelectorAll("#vehicleClassificationDeleteBtn");

  const vehicleClassifications = await getAllVehicleClassification();
  console.log(vehicleClassifications);

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const vehicle = vehicleClassifications.data.vehicleClassification.find((vehicle) => vehicle._id === this.dataset.id);

      // display the popup to edit

      if (vehicle) {
        document.getElementById("editCarPopup").style.display = "block";
        document.getElementById("vehicleClassificationEdit").value = vehicle.name;
        document.getElementById("vehicleClassId").value = vehicle._id;
      }
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const vehicle = vehicleClassifications.data.vehicleClassification.find((vehicle) => vehicle._id === this.dataset.id);
      deleteVehicleClassification(vehicle._id);
    });
  });
});
