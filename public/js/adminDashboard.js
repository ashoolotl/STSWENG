const getAllVehicles = async () => {
  try {
    const res = await fetch("/api/v1/vehicles");
    const data = await res.json();
    return data.data.vehicles;
  } catch (error) {
    console.log(error);
  }
};

const getAllReceipts = async () => {
  try {
    const res = await fetch("/api/v1/receipts/all");
    const data = await res.json();
    return data.data.receipts;
  } catch (error) {
    console.log(error);
  }
};

const populateVehicles = (vehicles) => {
  const vehiclesContainer = document.querySelector(".registered-cars");
  vehicles.forEach((vehicle) => {
    const vehicleElement = document.createElement("div");
    vehicleElement.classList.add("car");
    vehicleElement.dataset.carDetails = `${vehicle.classification}-${vehicle.plateNumber}`;
    const markCompleteButton = `<button class="update-status" data-vehicleplatenum="${vehicle.plateNumber}">Mark Complete</button>`;
    vehicleElement.innerHTML = `
      <img src="/images/vehicleClassification/${vehicle.classification}.jpeg" alt="Image for ${vehicle.classification}.jpeg">
      <div class="car-status">
        <div class="car-info">
          <p class="car-text"><strong>Owner: </strong>${vehicle.owner.firstName} ${vehicle.owner.firstName}</p>
          <p class="car-text"><strong>Plate Number: </strong>${vehicle.plateNumber}</p>
          <p class="car-text"><strong>Status: </strong><span class="status current">${vehicle.status} ${vehicle.status === "Pending:" ? vehicle.lastService : ""}</span></p>
          ${vehicle.status === "Pending:" ? markCompleteButton : ""}
        </div>
      </div>
    `;
    vehiclesContainer.appendChild(vehicleElement);
  });
};

const populateReceipts = (receipts) => {
  console.log(receipts);
  const receiptsContainer = document.querySelector(".ordered-products");
  receipts.forEach((receipt) => {
    receipt.products.forEach((product) => {
      const receiptElement = document.createElement("div");
      receiptElement.classList.add("dashboardProduct");
      // CHANGE TO PRODUCT IMAGE
      receiptElement.innerHTML = `
      <img src="/images/products/car wash shampoo.png"> 
      <div class="order-details">
        <p><strong>Name:</strong> <span id="product-name">${product.name}</span></p>
        <p><strong>Quantity:</strong> <span id="product-quantity">x${product.quantity}</span></p>
        <p><strong>Total Price:</strong> <span id="product-price">&euro; ${product.price}</span></p>
      </div>
    `;
      receiptsContainer.appendChild(receiptElement);
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const vehicles = await getAllVehicles();
  const receipts = await getAllReceipts();
  populateVehicles(vehicles);
  populateReceipts(receipts);

  const updateStatusButtons = document.querySelectorAll(".update-status");
  if (updateStatusButtons.length > 0) {
    updateStatusButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
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