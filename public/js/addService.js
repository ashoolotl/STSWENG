// this function is used to get all services
const getAllService = async () => {
  try {
    const res = await fetch("/api/v1/services", {
      method: "GET",
    });
    const responseData = await res.json();
    return responseData;
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};

// add a service to the database
const addService = async (data) => {
  try {
    let object = {};
    data.forEach((value, key) => (object[key] = value));

    const res = await fetch("/api/v1/services", {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 403) {
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "You do not have permission to perform this action.";
      return;
    }

    const responseData = await res.json();

    if (responseData.status === "success") {
      document.getElementById("addServicePopup").style.display = "none";
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "The service has been successfully added.\n\nReloading...";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.error(err);
    if (err.message.includes("E11000 duplicate key error")) {
      document.getElementById("error-message").innerText = "Service already exists.";
    } else {
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "An error occurred while adding service. Please try again later.";
    }
  }
};

// update the service with the id to the database
const updateService = async (data, id) => {
  try {
    let object = {};
    data.forEach((value, key) => (object[key] = value));

    const res = await fetch(`/api/v1/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await res.json();

    if (responseData.status === "success") {
      document.getElementById("editServicePopup").style.display = "none";
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "The service has been successfully updated.\n\nReloading...";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while updating services. Please try again later.";
  }
};

// this would show the creation of add service
document.getElementById("add").addEventListener("click", function () {
  showOverlay();
  document.getElementById("addServicePopup").style.display = "block";
});
// this would close the popup form to add a service
document.getElementById("closePopup").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("addServicePopup").style.display = "none";
});

// Function to show  the overlay
function showOverlay() {
  document.getElementById("overlay").style.display = "block";
}
// function to hide the overlay
function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}
// on create of a new service when submit button is clicked
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const duration = document.getElementById("duration").value;
  const prices = [];
  const checkboxes = document.querySelectorAll('input[name="selectedItems"]:checked');

  console.log(checkboxes);

  if (name.trim === "" || description.trim === "" || duration.trim === "") {
    document.getElementById("error-message").innerText = "One or more fields is empty. Please fill in all fields and try again";
  } else if (checkboxes.length === 0) {
    document.getElementById("error-message").innerText = "Please select at least one vehicle classification. Please try again.";
  } else {
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("name", document.getElementById("name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("duration", document.getElementById("duration").value);
    formData.append("photo", document.getElementById("photo").files[0]);

    // Get selected checkboxes and prepare prices data
    checkboxes.forEach(function (checkbox) {
      const priceInput = checkbox.nextElementSibling;
      const price = Number(priceInput.value);
      prices.push({ vehicleClassification: checkbox.value, price: price });
    });

    // Append prices data to FormData as individual fields
    prices.forEach((price, index) => {
      formData.append(`prices[${index}][vehicleClassification]`, price.vehicleClassification);
      formData.append(`prices[${index}][price]`, price.price);
    });

    // Call addService with the FormData object
    addService(formData);
    hideOverlay();
  }
});

// delete the service when button is clicked
const deleteService = async (id) => {
  try {
    const res = await fetch(`/api/v1/services/${id}`, {
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

    let resData = {};
    if (res.status !== 204) {
      resData = await res.json();
    }

    console.log(resData.status);
    if (resData.status === "success" || res.status === 204) {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "The service has been deleted successfully.\n\nReloading...";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while deleting service. Please try again later.";
  }
};

document.getElementById("closePopupEdit").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("editServicePopup").style.display = "none";
});

document.getElementById("formEdit").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const duration = document.getElementById("duration").value;

  if (name.trim === "" || description.trim === "" || duration.trim === "") {
    document.getElementById("error-message").innerText = "One or more fields is empty. Please fill in all fields and try again";
  } else {
    const formData = new FormData();

    var id = document.getElementById("serviceId").value;
    formData.append("name", document.getElementById("nameEdit").value);
    formData.append("description", document.getElementById("descriptionEdit").value);
    formData.append("duration", document.getElementById("durationEdit").value);
    var fileInput = document.getElementById("photoEdit");

    if (fileInput.files && fileInput.files[0]) {
      formData.append("photo", document.getElementById("photoEdit").files[0]);
    }

    const prices = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="selectedItemsEdit"]:checked');
    checkboxes.forEach(function (checkbox) {
      const priceInput = checkbox.nextElementSibling;
      const price = Number(priceInput.value);
      prices.push({
        vehicleClassification: checkbox.value,
        price: price,
      });
    });

    prices.forEach((price, index) => {
      formData.append(`prices[${index}][vehicleClassification]`, price.vehicleClassification);
      formData.append(`prices[${index}][price]`, price.price);
    });

    updateService(formData, id);
  }
});
// for edit and delete button add functionalities
document.addEventListener("DOMContentLoaded", async () => {
  const editButtons = document.querySelectorAll("#serviceEditBtn");
  const deleteButtons = document.querySelectorAll("#serviceDeleteBtn");

  const services = await getAllService();

  if (!editButtons || !deleteButtons || !services) {
    return;
  }

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const service = services.data.services.find((service) => service._id === this.dataset.id);
      // show edit popup
      if (service) {
        showOverlay();
        document.getElementById("editServicePopup").style.display = "block";
        document.getElementById("nameEdit").value = service.name;
        document.getElementById("descriptionEdit").value = service.description;
        document.getElementById("durationEdit").value = service.duration;

        // set the id
        document.getElementById("serviceId").value = service._id;

        // loop through each of the vehicle class name and check
        var checkboxes = document.querySelectorAll('input[type="checkbox"][name="selectedItemsEdit"]');

        // Loop through each checkbox
        checkboxes.forEach(function (checkbox) {
          // make sure that the checked is the previous selection
          for (price of service.prices) {
            if (price.vehicleClassification == checkbox.id) {
              checkbox.checked = true;
            }
          }
        });

        // Select all input elements with type 'number' and name 'priceEdit'
        const numberInputs = document.querySelectorAll('input[type="number"][name="priceEdit"]');

        // Loop through each input element
        numberInputs.forEach(function (input) {
          // Access attributes of each input element
          for (price of service.prices) {
            if (input.id === price.vehicleClassification) {
              input.value = price.price;
            }
          }
        });
      }
    });
  });
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const service = services.data.services.find((service) => service._id === this.dataset.id);
      deleteService(service._id);
    });
  });
});

document.getElementById("closePopupError").addEventListener("click", function () {
  document.getElementById("errorPopup").style.display = "none";
});
