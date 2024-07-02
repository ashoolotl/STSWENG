const getAllService = async () => {
  try {
    const response = await fetch("/api/v1/services");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching services. Please try again later.";
  }
};

const getAllVehicleByOwner = async (id) => {
  try {
    const response = await fetch(`/api/v1/vehicles/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching vehicles. Please try again later.";
  }
};

const addItemToCart = async (data) => {
  try {
    const response = await fetch(`/api/v1/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData.status == "success") {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Item added to cart.";
      document.getElementById("bookingPopup").style.display = "none";
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while adding to cart. Please try again later.";
  }
};

function generateAvailableServices(classNameToGenerate, vehiclesOwner, serviceDetails, owner, serviceName, serviceDescription) {
  document.getElementById("bookingPopup").style.display = "flex";
  const matchingVehicles = [];
  vehiclesOwner.forEach((vehicleOwner) => {
    const matchingServiceDetail = serviceDetails.find((serviceDetail) => serviceDetail.vehicleClassification === vehicleOwner.classification);

    if (matchingServiceDetail) {
      matchingVehicles.push({
        plateNumber: vehicleOwner.plateNumber,
        classification: vehicleOwner.classification,
        price: matchingServiceDetail.price,
        _id: matchingServiceDetail._id,
      });
    }
  });

  var hrTestElement = document.getElementById("generatePopup");
  var hrElement = document.getElementById("generatePopup");
  var nextElement = hrElement.nextElementSibling;

  while (nextElement) {
    if (nextElement.tagName.toLowerCase() !== "button") {
      var toRemove = nextElement;
      nextElement = nextElement.nextElementSibling;
      toRemove.parentNode.removeChild(toRemove);
    } else {
      break;
    }
  }

  var counter = 0;
  for (vehicle of matchingVehicles) {
    var popupContentDiv = document.createElement("div");
    popupContentDiv.classList.add("popupContent");

    var contentWrapperDiv = document.createElement("div");
    contentWrapperDiv.classList.add("contentWrapper");

    var radioButtonInput = document.createElement("input");
    radioButtonInput.setAttribute("type", "radio");
    radioButtonInput.setAttribute("name", "vehicle");
    radioButtonInput.setAttribute("value", `${counter}`);

    var carImage = document.createElement("img");
    carImage.classList.add("bookingPopupImage");
    carImage.setAttribute("src", `/images/vehicleClassification/${vehicle.classification}.jpeg`);

    carImage.setAttribute("alt", "Car Image");
    carImage.setAttribute("id", `vehicleClassification${counter}`);
    carImage.setAttribute("data-value", `${vehicle.classification}`);

    var infoItemDiv = document.createElement("div");
    infoItemDiv.classList.add("info-item");
    infoItemDiv.setAttribute(`plateNumber${counter}`, vehicle.plateNumber);
    infoItemDiv.setAttribute(`price${counter}`, vehicle.price);
    infoItemDiv.setAttribute(`owner${counter}`, owner);
    infoItemDiv.setAttribute(`classification${counter}`, vehicle.classification);
    infoItemDiv.setAttribute(`serviceName${counter}`, serviceName);
    infoItemDiv.setAttribute(`serviceDescription${counter}`, serviceDescription);

    var plateNumberSpan = document.createElement("span");
    plateNumberSpan.classList.add("bookingPopupPlateNumber");
    plateNumberSpan.innerHTML = `<strong>Plate Number: </strong>${vehicle.plateNumber}`;

    var priceSpan = document.createElement("span");
    priceSpan.classList.add("bookingPopupPrice");
    priceSpan.innerHTML = `<strong>Price: </strong> €${vehicle.price}`;

    infoItemDiv.appendChild(plateNumberSpan);
    infoItemDiv.appendChild(priceSpan);

    var hiddenServiceName = document.createElement("input");

    hiddenServiceName.setAttribute("type", "hidden");
    hiddenServiceName.setAttribute("name", "serviceNameHidden");
    hiddenServiceName.setAttribute("value", serviceName);
    hiddenServiceName.setAttribute("id", `serviceName${counter}`);
    var hiddenOwnerId = document.createElement("input");

    hiddenOwnerId.setAttribute("type", "hidden");
    hiddenOwnerId.setAttribute("value", owner);
    hiddenOwnerId.setAttribute("id", `owner${counter}`);

    contentWrapperDiv.appendChild(radioButtonInput);
    contentWrapperDiv.appendChild(carImage);
    contentWrapperDiv.appendChild(infoItemDiv);

    popupContentDiv.appendChild(contentWrapperDiv);

    hrTestElement.parentNode.insertBefore(popupContentDiv, hrTestElement.nextSibling);

    var hrElement = document.createElement("hr");
    hrTestElement.parentNode.insertBefore(hrElement, popupContentDiv.nextSibling);
    counter++;
  }

  var radioButtons = document.querySelectorAll('input[type="radio"][name="vehicle"]');

  if (radioButtons.length > 0) {
    radioButtons[0].checked = true;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const addToCartButtons = document.querySelectorAll("#serviceAddToCart");
  const services = await getAllService();
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const service = services.data.services.find((service) => service._id === this.dataset.id);
      var serviceName = service.name;
      var serviceDescription = service.description;

      console.log("Vehicle class list for this service:");
      console.log(service.prices);

      const ownedVehiclesClassificationsName = [];
      const ownedVehiclesData = [];
      const vehiclesOwned = await getAllVehicleByOwner(this.dataset.owner);

      for (className of vehiclesOwned.data.vehicle) {
        ownedVehiclesClassificationsName.push(className.classification);
        ownedVehiclesData.push(className);
      }
      console.log("OWNER OWNS THESE VEHICLES");
      console.log(ownedVehiclesData);
      const matchingVehicles = ownedVehiclesClassificationsName.filter((vehicle) => {
        return service.prices.some((serviceVehicle) => serviceVehicle.vehicleClassification === vehicle);
      });
      console.log(matchingVehicles);
      if (vehiclesOwned.data.vehicle.length == 0) {
        document.getElementById("errorPopup").style.display = "block";
        document.getElementById("errorText").innerText = "Please add a vehicle before availing this service.";
      } else if (matchingVehicles.length == 0) {
        document.getElementById("errorPopup").style.display = "block";
        document.getElementById("errorText").innerText = "This service is not applicable to your vehicle.";
      } else {
        generateAvailableServices(matchingVehicles, ownedVehiclesData, service.prices, this.dataset.owner, serviceName, serviceDescription);
        document.getElementById("bookingPopup").style.display = "block";
      }
    });
  });
});

document.getElementById("addToCart").addEventListener("submit", function (event) {
  event.preventDefault();

  var selectedVehicle = document.querySelector('input[type="radio"][name="vehicle"]:checked');

  var infoItemDiv = document.querySelector(`[plateNumber${selectedVehicle.value}]`);

  var plateNumber = infoItemDiv.getAttribute(`plateNumber${selectedVehicle.value}`);
  var price = infoItemDiv.getAttribute(`price${selectedVehicle.value}`);
  var owner = infoItemDiv.getAttribute(`owner${selectedVehicle.value}`);
  var classification = infoItemDiv.getAttribute(`classification${selectedVehicle.value}`);
  var serviceName = infoItemDiv.getAttribute(`serviceName${selectedVehicle.value}`);
  var serviceDescription = infoItemDiv.getAttribute(`serviceDescription${selectedVehicle.value}`);

  const cartData = {
    price: price,
    owner: owner,
    product: serviceName,
    plateNumber: plateNumber,
    classification: classification,
    description: serviceDescription,
  };
  var confirmResult = confirm(
    "The service token that you will receive after purchasing this can only be used with the vehicle plate number you selected that is linked to your account. Do you still want to proceed?"
  );
  if (confirmResult) {
    addItemToCart(cartData);
  } else {
    console.log("");
  }
});

document.getElementById("closePopupBooking").addEventListener("click", function () {
  document.getElementById("bookingPopup").style.display = "none";
});
document.getElementById("closePopupError").addEventListener("click", function () {
  document.getElementById("errorPopup").style.display = "none";
});
