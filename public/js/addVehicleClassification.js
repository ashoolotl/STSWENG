const addVehicle = async (data) => {
  try {
    const res = await fetch("/api/v1/vehicle-classifications", {
      method: "POST",
      body: data,
    });

    const resData = await res.json();
    console.log("ako si status");
    console.log(resData.status);
    if (resData.status == "success") {
      document.getElementById("successPopup").style.display = "block";
    }
  } catch (err) {
    alert("An error occurred");
  }
};

const updateVehicleClassification = async (data, id) => {
  try {
    const res = await fetch(`/api/v1/vehicle-classifications/${id}`, {
      method: "PATCH",
      body: data,
    });

    const resData = await res.json();
    console.log(resData.status);
    if (resData.status == "success") {
      document.getElementById("successPopupEdit").style.display = "block";
    }
  } catch (err) {
    alert("An error occurred");
  }
};

const deleteVehicleClassification = async (id) => {
  try {
    const res = await fetch(`/api/v1/vehicle-classifications/${id}`, {
      method: "DELETE",
    });
    const resData = await res.json();
    console.log(resData.status);
    if (resData.status === undefined) {
      alert("Vehicle Classification Successfully deleted");
      window.location.reload();
    }
  } catch (err) {
    alert("An error occurred");
  }
};

const getAllVehicleClassification = async () => {
  try {
    const res = await fetch("/api/v1/vehicle-classifications", {
      method: "GET",
    });

    const resData = await res.json();
    return resData;
  } catch (err) {
    alert("An error occurred");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const editButtons = document.querySelectorAll("#vehicleClassificationEditBtn");
  const deleteButtons = document.querySelectorAll("#vehicleClassificationDeleteBtn");

  const vehicleClassifications = await getAllVehicleClassification();
  console.log(vehicleClassifications);
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const vehicle = vehicleClassifications.data.vehicleClassification.find((vehicle) => vehicle._id === this.dataset.id);

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
