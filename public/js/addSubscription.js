const getAllSubscriptions = async () => {
  try {
    const response = await fetch("/api/v1/subscriptions");
    if (!response.ok) {
      throw new Error("Failed to fetch subscriptions");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching subscriptions:", err.message);
    alert("An error occurred while fetching subscriptions.");
  }
};

const updateSubscription = async (data, id) => {
  try {
    const response = await fetch(`/api/v1/subscriptions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update subscription");
    }
    const resData = await response.json();
    if (resData.status == "success") {
      alert("Update successful");
      window.location.reload();
    } else {
      throw new Error("Update unsuccessful");
    }
  } catch (err) {
    console.error("Error updating subscription:", err.message);
    alert("An error occurred while updating the subscription.");
  }
};

const addSubscription = async (data) => {
  try {
    const response = await fetch("/api/v1/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to add subscription");
    }
    const resData = await response.json();
    if (resData.status == "success") {
      alert("Subscription added successfully");
      window.location.reload();
    } else {
      throw new Error("Addition unsuccessful");
    }
  } catch (err) {
    console.error("Error adding subscription:", err.message);
    alert("An error occurred while adding the subscription.");
  }
};

const deleteSubscription = async (id) => {
  try {
    const response = await fetch(`/api/v1/subscriptions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete subscription");
    }
    const resData = await response.json();
    if (resData.status === undefined) {
      alert("Subscription successfully deleted");
      window.location.reload();
    } else {
      throw new Error("Deletion unsuccessful");
    }
  } catch (err) {
    console.error("Error deleting subscription:", err.message);
    alert("An error occurred while deleting the subscription.");
  }
};

// The DOMContentLoaded event listener logic remains unchanged

document.getElementById("add").addEventListener("click", function () {
  showOverlay();
  document.getElementById("addSubPopup").style.display = "block";
});

document.getElementById("closePopup").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("addSubPopup").style.display = "none";
});

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("photo", document.getElementById("photo").files[0]);

  const prices = [];
  const services = [];
  const vehicleClassifications = [];

  const checkboxesServices = document.querySelectorAll('input[type="checkbox"][name="selectedItems"]:checked');
  checkboxesServices.forEach((checkbox) => {
    const serviceName = checkbox.value;
    const tokenInput = checkbox.parentElement.querySelector('input[name="token"]');
    const tokensAmount = parseInt(tokenInput.value);

    services.push({
      service: serviceName,
      tokensAmount: tokensAmount,
    });
  });

  const checkBoxesVehicleClass = document.querySelectorAll('input[type="checkbox"][name="selectedItemsVehicleClass"]:checked');
  checkBoxesVehicleClass.forEach((checkbox) => {
    const vehicleClassName = checkbox.value;
    const priceInput = checkbox.parentElement.querySelector('input[name="price"]');
    const priceAmount = Number(priceInput.value);

    vehicleClassifications.push({
      vehicleClassification: vehicleClassName,
      price: priceAmount,
    });
  });

  prices.push({ services, vehicleClassifications });

  prices.forEach((price, index) => {
    price.services.forEach((service, serviceIndex) => {
      formData.append(`prices[${index}][services][${serviceIndex}][service]`, service.service);
      formData.append(`prices[${index}][services][${serviceIndex}][tokensAmount]`, service.tokensAmount);
    });

    price.vehicleClassifications.forEach((vehicle, vehicleIndex) => {
      formData.append(`prices[${index}][vehicleClassifications][${vehicleIndex}][vehicleClassification]`, vehicle.vehicleClassification);
      formData.append(`prices[${index}][vehicleClassifications][${vehicleIndex}][price]`, vehicle.price);
    });
  });

  console.log(prices);
  addSubscription(formData);
});

// Functions to show and hide the overlay
function showOverlay() {
  document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  // for each edit and delete buttons
  const editButtons = document.querySelectorAll("#subscriptionEditBtn");
  const deleteButtons = document.querySelectorAll("#subscriptionDeleteBtn");

  // fetch all subscriptions
  const subscriptions = await getAllSubscriptions();
  console.log(subscriptions);
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // find the subscription with the matching subscription_id == this.dataset.id
      const subscription = subscriptions.data.subscriptions.find((subscription) => subscription._id === this.dataset.id);
      document.getElementById("subscriptionId").value = subscription._id;
      // show the popup
      document.getElementById("editSubPopup").style.display = "block";
      // fill up the form data with the subscription details
      document.getElementById("nameEdit").value = subscription.name;

      // get all checkboxes
      const checkboxesServices = document.querySelectorAll('input[type="checkbox"][name="selectedItemsEdit"]');

      // check the current selections and place the input value of the tokens
      checkboxesServices.forEach(function (checkbox) {
        // make sure that the checked is the previous selection
        for (price of subscription.prices) {
          for (service of price.services) {
            if (checkbox.id == service.service) {
              checkbox.checked = true;
            }
          }
        }
      });
      // set the tokens input
      const tokenInputs = document.querySelectorAll('input[type="number"][name="tokenEdit"]');
      tokenInputs.forEach(function (input) {
        // Access attributes of each input element
        for (price of subscription.prices) {
          for (service of price.services) {
            if (input.id == service.service) {
              input.value = service.tokensAmount;
            }
          }
        }
      });
      const checkboxesVehicleClass = document.querySelectorAll('input[type="checkbox"][name="selectedItemsEditVehicleClass"]');

      checkboxesVehicleClass.forEach(function (checkbox) {
        for (price of subscription.prices) {
          for (vehicleClass of price.vehicleClassifications) {
            if (checkbox.id == vehicleClass.vehicleClassification) {
              checkbox.checked = true;
            }
          }
        }
      });
      // Select all input elements with type 'number' and name 'priceEdit'
      const priceInputs = document.querySelectorAll('input[type="number"][name="priceEdit"]');
      // set the prices
      priceInputs.forEach(function (input) {
        // Access attributes of each input element
        for (price of subscription.prices) {
          for (service of price.vehicleClassifications) {
            if (input.id == service.vehicleClassification) {
              input.value = service.price;
            }
          }
        }
      });
    });
  });

  // delete functionality
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const subscription = subscriptions.data.subscriptions.find((subscription) => subscription._id === this.dataset.id);

      deleteSubscription(subscription._id);
    });
  });
});

// close edit popup
document.getElementById("closePopupEdit").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("editSubPopup").style.display = "none";
});

document.getElementById("formEdit").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("nameEdit").value);
  var fileInput = document.getElementById("photoEdit");
  // Check if any file is selected
  if (fileInput.files && fileInput.files[0]) {
    // An image is uploaded
    formData.append("photo", document.getElementById("photoEdit").files[0]);
  }
  const prices = [];
  const services = [];
  const vehicleClassifications = [];

  const checkboxesServices = document.querySelectorAll('input[type="checkbox"][name="selectedItemsEdit"]:checked');
  checkboxesServices.forEach((checkbox) => {
    const serviceName = checkbox.value;
    const tokenInput = checkbox.parentElement.querySelector('input[name="tokenEdit"]');
    const tokensAmount = parseInt(tokenInput.value);

    services.push({
      service: serviceName,
      tokensAmount: tokensAmount,
    });
  });

  const checkBoxesVehicleClass = document.querySelectorAll('input[type="checkbox"][name="selectedItemsEditVehicleClass"]:checked');
  checkBoxesVehicleClass.forEach((checkbox) => {
    const vehicleClassName = checkbox.value;
    const priceInput = checkbox.parentElement.querySelector('input[name="priceEdit"]');
    const priceAmount = Number(priceInput.value);

    vehicleClassifications.push({
      vehicleClassification: vehicleClassName,
      price: priceAmount,
    });
  });

  prices.push({ services, vehicleClassifications });

  prices.forEach((price, index) => {
    price.services.forEach((service, serviceIndex) => {
      formData.append(`prices[${index}][services][${serviceIndex}][service]`, service.service);
      formData.append(`prices[${index}][services][${serviceIndex}][tokensAmount]`, service.tokensAmount);
    });

    price.vehicleClassifications.forEach((vehicle, vehicleIndex) => {
      formData.append(`prices[${index}][vehicleClassifications][${vehicleIndex}][vehicleClassification]`, vehicle.vehicleClassification);
      formData.append(`prices[${index}][vehicleClassifications][${vehicleIndex}][price]`, vehicle.price);
    });
  });
  var id = document.getElementById("subscriptionId").value;

  // console.log(prices);
  updateSubscription(formData, id);
});
