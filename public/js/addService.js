// this function is used to get all services
const getAllService = async () => {
  try {
    const response = await fetch("/api/v1/services");
    const data = await response.json();
    return data;
  } catch (err) {
    alert("An error occurred");
  }
};

// add a service to the database
const addService = async (data) => {
  try {
    const response = await fetch("/api/v1/services", {
      method: "POST",
      body: data,
    });
    const resData = await response.json();
    console.log(resData.status);
    if (resData.status == "success") {
      alert("success");
      window.location.reload();
    }
  } catch (err) {
    alert("An error occurred");
  }
};

// update the service with the id to the database
const updateService = async (data, id) => {
  try {
    const response = await fetch(`/api/v1/services/${id}`, {
      method: "PATCH",
      body: data,
    });
    const resData = await response.json();
    console.log(resData);
    if (resData.status == "success") {
      alert("update successful");
      window.location.reload();
    }
  } catch (err) {
    alert("An error occurred");
  }
};

// delete the service when button is clicked
const deleteService = async (id) => {
  try {
    const response = await fetch(`/api/v1/services/${id}`, {
      method: "DELETE",
    });
    const resData = await response.json();
    console.log(resData.status);
    if (resData.status === undefined) {
      alert("Service Successfully deleted");
      window.location.reload();
    }
  } catch (err) {
    alert("An error occurred");
  }
};

// this would close the popup form of edit a service
document.getElementById("closePopupEdit").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("editServicePopup").style.display = "none";
});

// this would add a onclick event when submit button is clicked
document.getElementById("formEdit").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData();

  // Append form fields to FormData
  var id = document.getElementById("serviceId").value;
  formData.append("name", document.getElementById("nameEdit").value);
  formData.append("description", document.getElementById("descriptionEdit").value);
  formData.append("duration", document.getElementById("durationEdit").value);
  var fileInput = document.getElementById("photoEdit");
  // Check if any file is selected
  if (fileInput.files && fileInput.files[0]) {
    // An image is uploaded
    formData.append("photo", document.getElementById("photoEdit").files[0]);
  }

  // // Get selected checkboxes and prepare prices data
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

  // // Append prices data to FormData as individual fields
  prices.forEach((price, index) => {
    formData.append(`prices[${index}][vehicleClassification]`, price.vehicleClassification);
    formData.append(`prices[${index}][price]`, price.price);
  });
  // console.log('DATA BEFORE PASSING INTO UPDATE');
  // console.log(prices);

  // // Call addService with the FormData object
  updateService(formData, id);

  // hideOverlay();
  // document.getElementById('addServicePopup').style.display = 'none';
});
// for edit and delete button add functionalities
document.addEventListener("DOMContentLoaded", async () => {
  const editButtons = document.querySelectorAll("#serviceEditBtn");
  const deleteButtons = document.querySelectorAll("#serviceDeleteBtn");

  const services = await getAllService();

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const service = services.data.services.find((service) => service._id === this.dataset.id);
      // show edit popup
      if (service) {
        showOverlay();
        document.getElementById("editServicePopup").style.display = "block";
        console.log(service.prices);
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
