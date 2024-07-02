const createPayment = async (data, id) => {
  try {
    const response = await fetch(`/api/v1/bookings/checkout-subscription/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    window.location.href = res.session.url;
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while creating payment. Please try again later.";
  }
};

const getAllSubscriptions = async () => {
  try {
    const response = await fetch("/api/v1/subscriptions", {
      method: "GET",
    });
    const res = await response.json();
    return res;
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching subscriptions. Please try again later.";
  }
};

const getAllVehicleByOwner = async (id) => {
  try {
    const response = await fetch(`/api/v1/vehicles/${id}`, {
      method: "GET",
    });
    const res = await response.json();
    return res;
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while vehicles. Please try again later.";
  }
};

async function showSubscriptionPopup(subscriptionId, userId, subscriptionName, subscriptionDescription) {
  document.getElementById("bookingPopup").style.display = "flex";
  const vehiclesOwned = await getAllVehicleByOwner(userId);
  if (vehiclesOwned.data.vehicle.length == 0) {
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "Please add a vehicle first before availing this subscription.";
  } else {
    const subscriptions = await getAllSubscriptions();
    console.log(vehiclesOwned);

    let selectedSubscriptionData = subscriptions.data.subscriptions.find((sub) => sub.name === subscriptionName);
    console.log(selectedSubscriptionData.prices);

    let subscriptionPrices = selectedSubscriptionData.prices;

    const generateSubscriptionForVehicle = [];
    vehiclesOwned.data.vehicle.forEach((ownedVehicle) => {
      let matchingPrice = null;
      subscriptionPrices.forEach((price) => {
        price.vehicleClassifications.forEach((vc) => {
          if (vc.vehicleClassification === ownedVehicle.classification) {
            matchingPrice = vc.price;
          }
        });
      });
      if (matchingPrice !== null) {
        generateSubscriptionForVehicle.push({
          classification: ownedVehicle.classification,
          price: matchingPrice,
          owner: userId,
          product: subscriptionName,
          plateNumber: ownedVehicle.plateNumber,
          description: subscriptionDescription,
        });
      } else {
        console.log("Price for", ownedVehicle.classification + ": Not found");
      }
    });
    if (generateSubscriptionForVehicle.length == 0) {
      alert("This subscription is not available for your vehicle");
    } else {
      console.log(generateSubscriptionForVehicle);
      generateSubscriptionPopup(generateSubscriptionForVehicle);
      document.getElementById("bookingPopup").style.display = "block";
    }
  }
}

function generateSubscriptionPopup(vehiclesData) {
  const hrElement = document.getElementById("generateVehicleSubscriptions");
  const parentElement1 = hrElement.parentNode;
  let nextSibling = hrElement.nextSibling;

  while (nextSibling) {
    const siblingToRemove = nextSibling;
    nextSibling = siblingToRemove.nextSibling;
    parentElement1.removeChild(siblingToRemove);
  }

  const parentElement = document.getElementById("generateVehicleSubscriptions").parentNode;

  var counter = 0;
  vehiclesData.forEach((vehicle) => {
    const popupContent = document.createElement("div");
    popupContent.classList.add("popupContent");

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("contentWrapper");

    const inputRadio = document.createElement("input");
    inputRadio.setAttribute("type", "radio");
    inputRadio.setAttribute("name", "vehicle");
    inputRadio.setAttribute("value", counter);

    const img = document.createElement("img");
    img.classList.add("bookingPopupImage");
    img.setAttribute("src", `/images/vehicleClassification/${vehicle.classification}.jpeg`);
    img.setAttribute("alt", `Image for ${vehicle.classification}`);

    const infoItem = document.createElement("div");
    infoItem.classList.add("info-item");

    infoItem.setAttribute(`plateNumber${counter}`, vehicle.plateNumber);
    infoItem.setAttribute(`price${counter}`, vehicle.price);
    infoItem.setAttribute(`owner${counter}`, vehicle.owner);
    infoItem.setAttribute(`classification${counter}`, vehicle.classification);
    infoItem.setAttribute(`productName${counter}`, vehicle.product);
    infoItem.setAttribute(`subscriptionDescription${counter}`, vehicle.description);

    const plateNumber = document.createElement("span");
    plateNumber.classList.add("bookingPopupPlateNumber");
    plateNumber.innerHTML = `<strong>Plate Number:</strong> ${vehicle.plateNumber}`;

    const price = document.createElement("span");
    price.classList.add("bookingPopupPrice");
    price.innerHTML = `<strong>Price:</strong> €${vehicle.price}`;

    infoItem.appendChild(plateNumber);
    infoItem.appendChild(price);

    contentWrapper.appendChild(inputRadio);
    contentWrapper.appendChild(img);
    contentWrapper.appendChild(infoItem);

    popupContent.appendChild(contentWrapper);

    parentElement.appendChild(popupContent);

    const hr = document.createElement("hr");
    parentElement.appendChild(hr);
    counter++;
  });
  var radioButtons = document.querySelectorAll('input[type="radio"][name="vehicle"]');

  if (radioButtons.length > 0) {
    radioButtons[0].checked = true;
  }
  const button = document.createElement("button");
  button.setAttribute("type", "submit");
  button.textContent = "Proceed to Payment";

  parentElement.appendChild(button);
}

document.getElementById("availSubscriptionForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var selectedVehicle = document.querySelector('input[type="radio"][name="vehicle"]:checked');

  var infoItem = document.querySelector(`[plateNumber${selectedVehicle.value}]`);
  var plateNumber = infoItem.getAttribute(`plateNumber${selectedVehicle.value}`);
  var price = infoItem.getAttribute(`price${selectedVehicle.value}`);
  var owner = infoItem.getAttribute(`owner${selectedVehicle.value}`);
  var classification = infoItem.getAttribute(`classification${selectedVehicle.value}`);
  var productName = infoItem.getAttribute(`productName${selectedVehicle.value}`);
  var productDescription = infoItem.getAttribute(`subscriptionDescription${selectedVehicle.value}`);

  const subscriptionData = {
    price: price,
    owner: owner,
    product: productName,
    plateNumber: plateNumber,
    classification: classification,
    description: productDescription,
  };

  var confirmResult = confirm(
    "The subscription tokens that you will receive after purchasing this can only be used with the vehicle plate number you selected that is linked to your account. Do you still want to proceed?"
  );
  if (confirmResult) {
    createPayment(subscriptionData, owner);
  } else {
    console.log("");
  }
});

function closePopupSubscriptionSelectVehicle() {
  document.getElementById("bookingPopup").style.display = "none";
}
